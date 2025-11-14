import { BlurScrollEffect } from './blurScrollEffect.js';

document.addEventListener("DOMContentLoaded", event => {
  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);
});

gsap.to(".preloader-text", {
  y: 0,
  duration: 1,
  opacity: 1,
  ease: "power4.out",
  stagger: 0.25,
  delay: 0.5,
});

let tickerLine = gsap.timeline({
  scrollTrigger: {
    trigger: ".ticker_line_inner",
    start: "top 40% ",
    end: "bottom 10%",
    markers: false,
    scrub: true,
  },
});
tickerLine.to(".ticker_line_inner", {
  width: "100%",
  duration: 2,
  ease: "power4.out",
  delay: 1,
});

/* JS: duplicate each .row's content, measure, create per-row keyframes and animation */
(function () {
  const root = document.documentElement;
  const rows = Array.from(document.querySelectorAll(".ticker .row"));
  if (!rows.length) return;

  const useGSAP = false; // set true if you include GSAP CDN and want GSAP behavior

  // create single style tag for keyframes and reuse it
  let styleEl = document.getElementById("ticker-dyn-style");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "ticker-dyn-style";
    document.head.appendChild(styleEl);
  }

  // measure helper: reflow minimized, single hidden container reused
  const measurer = (function () {
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.visibility = "hidden";
    el.style.whiteSpace = "nowrap";
    el.style.pointerEvents = "none";
    document.body.appendChild(el);
    return {
      measure(html) {
        el.innerHTML = html;
        return Math.round(el.getBoundingClientRect().width) || 0;
      },
      destroy() {
        document.body.removeChild(el);
      },
    };
  })();

  // IntersectionObserver to pause rows when off-screen
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        const row = e.target;
        const track = row.querySelector(".track");
        if (!track) return;
        if (e.isIntersecting) {
          track.style.animationPlayState = ""; // resume (inherits)
        } else {
          track.style.animationPlayState = "paused";
        }
      });
    },
    { threshold: 0.01 }
  );

  // debounce util
  const debounce = (fn, wait = 120) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), wait);
    };
  };

  // build a single track for a row: moves original children into track, clone once
  function buildTrack(row) {
    const originalChildren = Array.from(row.children).filter(n => n.nodeType === 1);
    if (!originalChildren.length) return null;

    // create track and move nodes (document fragment to avoid reflow per node)
    const track = document.createElement("div");
    track.className = "track";
    const frag = document.createDocumentFragment();
    originalChildren.forEach(n => frag.appendChild(n));
    track.appendChild(frag);

    // duplicate content (innerHTML) for seamless loop (fast)
    const originalHTML = track.innerHTML;
    track.innerHTML = originalHTML + originalHTML;

    // append track as single DOM insertion
    row.innerHTML = "";
    row.appendChild(track);

    return { track, originalHTML };
  }

  // measure, compute duration, create keyframes (single append)
  function setupRow(row, idx) {
    const { track, originalHTML } = buildTrack(row) || {};
    if (!track) return;

    // direction: explicit > alternate
    const explicit = (row.dataset.dir || "").trim().toLowerCase();
    const dir = explicit === "left" || explicit === "right" ? explicit : idx % 2 === 0 ? "left" : "right";

    // measure width of original set
    const width = measurer.measure(originalHTML) || Math.round(track.getBoundingClientRect().width / 2);
    const safeWidth = Math.max(1, Math.round(width));

    // compute duration using CSS var and optional per-row override
    const rootPxPerSec = parseFloat(getComputedStyle(root).getPropertyValue("--px-per-sec")) || 40;
    const rowPxPerSec = parseFloat(row.dataset.pxPerSec) || rootPxPerSec;
    const durationSec = Math.max(6, safeWidth / rowPxPerSec);

    // GSAP path if requested & gsap loaded
    if (useGSAP && window.gsap && typeof gsap.to === "function") {
      // kill previous tweens on track (safe)
      gsap.killTweensOf(track);
      if (dir === "right") {
        gsap.set(track, { x: -safeWidth });
        gsap.to(track, {
          x: 0,
          ease: "none",
          duration: durationSec,
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => {
              let v = parseFloat(x);
              if (v > 0) v -= safeWidth;
              if (v <= -safeWidth) v += safeWidth;
              return v + "px";
            }),
          },
        });
      } else {
        gsap.set(track, { x: 0 });
        gsap.to(track, {
          x: -safeWidth,
          ease: "none",
          duration: durationSec,
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => {
              let v = parseFloat(x);
              if (v <= -safeWidth) v += safeWidth;
              return v + "px";
            }),
          },
        });
      }

      io.observe(row);
      return;
    }

    // CSS fallback: create a unique keyframe per row and append once to styleEl
    // Use rounded pixel values to avoid fractional pixel rounding artifacts
    const animName = `ticker_move_${idx}`;
    const fromX = dir === "left" ? 0 : -safeWidth;
    const toX = dir === "left" ? -safeWidth : 0;

    // Append keyframe text to the single style element (minimizes style recalcs)
    styleEl.appendChild(
      document.createTextNode(`
@keyframes ${animName} {
  0%   { transform: translate3d(${fromX}px, 0, 0); }
  100% { transform: translate3d(${toX}px, 0, 0); }
}
`)
    );

    // apply animation to track in one style assignment (minimizes layout thrash)
    track.style.animationName = animName;
    track.style.animationDuration = `${durationSec}s`;
    track.style.animationTimingFunction = "linear";
    track.style.animationIterationCount = "infinite";
    track.style.willChange = "transform";
    track.style.animationPlayState = ""; // allow IO to control

    // observe visibility to pause when offscreen
    io.observe(row);
  }

  // main setup: clear previous keyframes, build each row once
  function setupAll() {
    // clear styleEl content to avoid leak on repeated setups
    styleEl.textContent = "";
    rows.forEach((r, i) => setupRow(r, i));
  }

  // initial setup and debounced resize handling
  const debouncedSetup = debounce(setupAll, 160);
  window.addEventListener("resize", debouncedSetup, { passive: true });
  window.addEventListener("orientationchange", debouncedSetup, { passive: true });

  // expose simple controls
  window.TickerOptimized = {
    refresh: setupAll,
    pauseAll: () => rows.forEach(r => r.classList.add("pause")),
    resumeAll: () => rows.forEach(r => r.classList.remove("pause")),
    destroy: () => {
      rows.forEach(r => io.unobserve(r));
      measurer.destroy();
      styleEl.remove();
    },
  };

  // initial run
  setupAll();
})();

let businesTool = gsap.timeline({
  scrollTrigger: {
    trigger: ".business_tool_line",
    start: "top 60% ",
    end: "bottom 60%",
    scrub: true,
  },
});
businesTool.to(".business_tool_line_inner", {
  height: "100%",
});

let businesTools = gsap.timeline({
  scrollTrigger: {
    trigger: ".business_tool_inner",
    start: "top 0% ",
    end: "200% 0%",
    scrub: true,
    pin: true,
  },
});
businesTools.to(".business_design", { left: "25%", opacity: 1 });
businesTools.to(".business_development", { right: "25%", opacity: 1 });
businesTools.to(".business_launch", { right: 0, opacity: 1 });
businesTools.to(".business_tool_inner_two_first", { opacity: 1 });
businesTools.to(".business_tool_inner_two_first .business_tool_inner_line", { width: "100%" });
businesTools.to(".business_tool_inner_two_second", { opacity: 1 });
businesTools.to(".business_tool_inner_two_second .business_tool_inner_line", { width: "100%" });

let ventureTranform = gsap.timeline({
  scrollTrigger: {
    trigger: ".venture_tranform",
    start: "top 0% ",
    end: "200% 100%",
    markers: false,
    scrub: true,
    pin: true,
    pinSpacing: true,
  },
});
ventureTranform.to(".venture_tranform-div", {
  width: "100vw",
  height: "100vh",
});


const init = () => {
  const effects = [
    { selector: '[data-effect-4]', effect: BlurScrollEffect },
  ];

  // Iterate over each effect configuration and apply the effect to all matching elements
  effects.forEach(({ selector, effect }) => {
    document.querySelectorAll(selector).forEach(el => {
      new effect(el);
    });
  });
};
init();

let ventureTranform1 = gsap.timeline({
  scrollTrigger: {
    trigger: ".venture_tranform1",
    start: "top 0% ",
    end: "200% 100%",
    markers: false,
    scrub: true,
    pin: true,
    pinSpacing: true,
  },
});
ventureTranform1.to(".venture_tranform-img1", {
  opacity: 10,
  bottom: "10px",
},0);
ventureTranform1.to(".venture_tranform-img2", {
  opacity: 10,
  bottom: "10px",
},0.1 );
ventureTranform1.to(".venture_tranform-img3", {
  opacity: 10,
  bottom: "10px",
},0.2);
ventureTranform1.to(".venture_tranform-img4", {
  opacity: 10,
  bottom: "10px",
},0.3);
