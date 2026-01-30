import { BlurScrollEffect } from "./blurScrollEffect.js";

/* ---------------------------------------------------------
   1) REGISTER GSAP PLUGINS RIGHT AWAY
------------------------------------------------------------*/
gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------
   2) LENIS + SCROLLTRIGGER INTEGRATION (from Lenis docs)
------------------------------------------------------------*/

// Create Lenis instance
const lenis = new Lenis({
  // you can tweak if needed
  duration: 1.5,
  smooth: true,
  lerp: 0.08, // <= LOWER = smoother & more even motion
  wheelMultiplier: 0.7,
});

// Let ScrollTrigger update on Lenis scroll
lenis.on("scroll", () => {
  ScrollTrigger.update();
});

// Use GSAP's ticker to drive Lenis
gsap.ticker.add(time => {
  // GSAP's ticker time is in seconds, Lenis expects ms
  lenis.raf(time * 1000);
});

// Disable GSAP lag smoothing so there's no delay
gsap.ticker.lagSmoothing(0);

/* ---------------------------------------------------------
   3) ALL YOUR ORIGINAL GSAP / DOM CODE
      wrapped in an init function to ensure DOM is ready
------------------------------------------------------------*/

// Step A — Calculate offsets so numbers land in corners
const numLeft = document.getElementById("numLeft");
const numRight = document.getElementById("numRight");

// Measure current screen positions
const leftRect = numLeft.getBoundingClientRect();
const rightRect = numRight.getBoundingClientRect();

// Desired final corner positions
const targetLeftX = 80; // px from left
const targetLeftY = 60; // px from top

const targetRightX = window.innerWidth - 80 - rightRect.width;
const targetRightY = 60;

function initAnimations() {
  // PRELOADER
  // gsap.to(".preloader-text", {
  //   y: 0,
  //   duration: 1,
  //   opacity: 1,
  //   ease: "power4.out",
  //   stagger: 0.25,
  //   delay: 0.5,
  // });

  let lastScrollY = window.scrollY;
  const navbar = document.querySelector(".header");
  const headerVideo = document.querySelector("#bannerVideo");
  const video2 = document.querySelector(".video2");

  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
      // scrolling down → hide navbar
      navbar.classList.add("hidden");
    } else {
      // scrolling up → show navbar
      navbar.classList.remove("hidden");
    }

    lastScrollY = window.scrollY;
  });

  // window.scrollTo(0, 0);
  const preloader = gsap.timeline({ delay: 2, ease: "power3.out" });

  preloader.to(
    ".numbers-container",
    {
      zIndex: 999,
      ease: "power4.out",
    },
    "pre-preloader",
  );
  preloader.add(() => headerVideo.play());
  preloader.to(
    ".header-video",
    {
      zIndex: 99,
      ease: "power4.out",
    },
    "pre-preloader",
  );
  preloader.to(
    "#edible",
    {
      x: window.innerWidth >= 767 ? "-40%" : "-0%",
      y: window.innerWidth >= 767 ? "0%" : "-40%",
      duration: 0.7,
      ease: "power4.out",
    },
    "preloader",
  );
  preloader.to(
    "#ventures",
    {
      x: window.innerWidth >= 767 ? "40%" : "0%",
      y: window.innerWidth >= 767 ? "0%" : "40%",
      duration: 0.7,
      ease: "power4.out",
    },
    "preloader",
  );
  preloader.to(
    ".header-video",
    {
      zIndex: 101,
      ease: "power4.out",
    },
    "preloader",
  );
  preloader.to(
    ".header",
    {
      opacity: 1,
      ease: "power4.out",
    },
    "preloader",
  );
  preloader.from(
    ".number-left",
    {
      x: 100,
      opacity: 0,
      duration: 0.7,
      ease: "power4.out",
    },
    "preloader",
  );
  preloader.from(
    ".number-right",
    {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    },
    "preloader",
  );
  preloader.from(
    ".header-video",
    {
      clipPath: "inset(100% 100% 100% 100%)",
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    },
    "preloader",
  );
  preloader.to(
    ".header-container",
    {
      marginRight: "0",
      duration: 1,
      // delay: 0.5,
      ease: "power4.out",
    },
    "preload2",
  );
  preloader.to(
    ".header-video",
    {
      width: "102vw",
      // x: "2vw",
      height: "100vh",
      // delay: 0.5,
      duration: 1,
      ease: "power4.out",
    },
    "preload2",
  );
  preloader.add(() => video2.play());
  preloader.to(
    "#edible, #ventures",
    {
      x: "0%",
      duration: 1,
      // delay: 0.5,
      ease: "power4.out",
    },
    "preload2",
  );
  preloader.to(
    "#edible, #ventures",
    {
      opacity: 0,
      ease: "power4.out",
    },
    "preload2",
  );
  preloader.to(
    ".number-left",
    {
      x: targetLeftX - leftRect.left,
      y: targetLeftY - leftRect.top,
      duration: 0.8,
      // delay:0.5,
      ease: "power4.out",
    },
    "preload2",
  );
  preloader.to(
    ".number-right",
    {
      x: targetRightX - rightRect.left,
      y: targetRightY - rightRect.top,
      duration: 0.8,
      // delay:0.5,
      ease: "power4.out",
    },
    "preload2",
  );
  preloader.to(
    "#bannerVideo",
    {
      opacity: 0,
      ease: "power4.out",
    },
    "preload3",
  );
  preloader.from(
    ".video2",
    {
      opacity: 0,
      ease: "power4.out",
    },
    "preload3",
  );
  preloader.to(
    ".number-right, .number-left",
    {
      opacity: 0,
      ease: "power4.out",
    },
    "preload3",
  );
  preloader.to(
    ".header-banner-text",
    {
      zIndex: 102,
      ease: "power4.out",
    },
    "preload3",
  );
  preloader.from(
    ".header .header-left, .header .header-right",
    {
      opacity: 0,
      ease: "power4.out",
    },
    "preload3",
  );
  preloader.from(".header-center", {
    y: -200,
    ease: "power4.out",
  });
  preloader.from(".horizontal-line", {
    clipPath: "inset(0 100% 0 0)",
    duration: 1,
    ease: "power4.out",
  });
  preloader.from(
    ".upper-text div",
    {
      y: 600,
      duration: 0.8,
      ease: "power4.out",
    },
    "together",
  );
  preloader.from(
    ".lower-text div",
    {
      y: -200,
      duration: 0.8,
      ease: "power4.out",
    },
    "together",
  );
  preloader.add(() => {
    document.body.classList.remove("no-scroll");
  });

  let tickerLine = gsap.timeline({
    scrollTrigger: {
      trigger: ".ticker_line_inner",
      start: "top 60% ",
      end: "bottom 10%",
      markers: false,
      scrub: true,
    },
  });
  tickerLine.to(".ticker_line_inner", {
    width: "100%",
  });

  let header = gsap.timeline({
    scrollTrigger: {
      trigger: ".ticker",
      start: "top 0%",
      end: "bottom 100%",
      markers: false,
      scrub: true,
      toggleActions: "play none none reverse",
    },
  });
  header.to(".header-container", { display: "none" });
  gsap.utils.toArray(".reveal-left").forEach(elem => {
    gsap.from(elem, {
      clipPath: "inset(0 100% 0 0)",
      ease: "power3.out",
      scrub: true,
      scrollTrigger: {
        trigger: elem,
        start: "top 80%",
        scrub: true,
        toggleActions: "play none none reverse",
      },
    });
  });

  let businesTool = gsap.timeline({
    scrollTrigger: {
      trigger: ".business_tool_line",
      start: "top 60% ",
      end: "250% 60%",
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
      end: "250% 0%",
      scrub: true,
      pin: true,
    },
  });
  businesTools.from(".business_design", { clipPath: "inset(0 100% 0 0)", opacity: 1 });
  businesTools.from(".business_development", { clipPath: "inset(0 100% 0 0)", opacity: 1 });
  businesTools.from(".business_launch", { clipPath: "inset(0 100% 0 0)", opacity: 1 });
  businesTools.to(".business_tool_inner_two_first", { opacity: 1 });
  businesTools.from(".business_tool_inner_two_first .business_tool_inner_line", { clipPath: "inset(0 90% 0 0 )", ease: "power4.out" });
  businesTools.from(".business_tool_inner_two_second .business_tool_inner_line", { clipPath: "inset(0 90% 0 0)", ease: "power4.out" });
  businesTools.from(".business_tool_inner_two_second .business_tool_inner_text", { opacity: 0 });

  let ventureTranform = gsap.timeline({
    scrollTrigger: {
      trigger: ".venture_tranform",
      start: window.innerWidth >= 767 ? "top 70%" : "30% 100%",
      end: window.innerWidth >= 767 ? "50% 70%" : "20% 80%",
      markers: false,
      scrub: true,
    },
  });
  ventureTranform.from(".venture_tranform-div", {
    width: "90vw",
    height: window.innerWidth >= 767 ? "80vh" : "30vh",
    scale: 0.7,
    y: "-50%",
    opacity: 0
  });

  let ventureTranform1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".venture_tranform1",
      start: "top 0% ",
      end: window.innerWidth >= 767 ? "150% 100%" : "200% 100%",
      scrub: true,
      pin: true,
      pinSpacing: true,
    },
  });
  ventureTranform1.from(
    ".venture_tranform-img",
    {
      opacity: 0,
      y: "-100%",
      stagger: 0.1,
      ease: "power4.out",
    },
    "thisshouldo",
  );
  ventureTranform1.fromTo(
    ".venture_tranform_line_inner",
    {
      width: 0,
    },
    {
      width: "100%",
      ease: "power4.out",
    },
  );
  ventureTranform1.from(".fade-last", {
    opacity: 0,
    ease: "power4.out",
  });

  let imagreveal = gsap.timeline({
    scrollTrigger: {
      trigger: ".text-banner-section",
      start: "top 0%",
      end: "bottom 100%",
      markers: false,
      scrub: true,
      toggleActions: "play none none reverse",
    },
  });
  imagreveal.from(".reveal-image", {
    clipPath: "inset(0 0% 0 0)",
    ease: "power3.out",
    scrub: true,
  });

  if (window.innerWidth > 768) {
    let leftToRight = gsap.timeline({
      scrollTrigger: {
        trigger: ".text-banner-section",
        start: "top top",
        end: "200% top",
        scrub: true,
        pin: true,
        // pinSpacing: true
      },
    });
    leftToRight.from(
      ".fade-in-img",
      {
        opacity: 0,
        ease: "power4.out",
      },
      "asdf",
    );
    leftToRight.to(
      ".text-banner-text-1",
      {
        opacity: 1,
        ease: "power4.out",
      },
      "asdf",
    );
    leftToRight.to(
      ".text-banner-text-1",
      {
        opacity: 0.2,
        ease: "power4.out",
      },
      "qwer",
    );
    leftToRight.to(
      ".text-banner-text-2",
      {
        opacity: 1,
        ease: "power4.out",
      },
      "qwer",
    );
    leftToRight.to(
      ".expand-img-1",
      {
        width: "20%",
      },
      "qwer",
    );
    leftToRight.to(
      ".expand-img-2",
      {
        width: "60%",
      },
      "qwer",
    );
    leftToRight.to(
      ".text-banner-text-2",
      {
        opacity: 0.2,
        ease: "power4.out",
      },
      "ret",
    );
    leftToRight.to(
      ".text-banner-text-3",
      {
        opacity: 1,
        ease: "power4.out",
      },
      "ret",
    );
    leftToRight.to(
      ".expand-img-2",
      {
        width: "20%",
      },
      "ret",
    );
    leftToRight.to(
      ".expand-img-3",
      {
        width: "60%",
      },
      "ret",
    );
    leftToRight.fromTo(
      ".fade-in-img-5",
      {
        opacity: -1000,
      },
      {
        opacity: 1,
        clipPath: "inset(0 0% 30% 0%)",
        ease: "power4.out",
      },
      "jdi",
    );
    leftToRight.to(
      ".hidden-text .business_tool_inner_line",
      {
        clipPath: "inset(0 0% 10% 0%)",
        ease: "power4.out",
      },
      "jdi",
    );
    leftToRight.to(".fade-in-img-5", {
      opacity: 1,
      clipPath: "inset(0 0% 100% 0%)",
      ease: "power4.out",
    });
  } else {
    let leftToRight = gsap.timeline({
      scrollTrigger: {
        trigger: ".text-banner-section",
        start: "top top",
        end: "200% top",
        scrub: true,
        pin: true,
        // pinSpacing: true
      },
    });
    leftToRight.from(
      ".fade-in-img",
      {
        opacity: 0,
        ease: "power4.out",
      },
      "asdf",
    );
    leftToRight.to(
      ".text-banner-text-1",
      {
        opacity: 1,
        ease: "power4.out",
      },
      "asdf",
    );
    leftToRight.to(
      ".text-banner-text-1",
      {
        opacity: 0.2,
        ease: "power4.out",
      },
      "qwer",
    );
    leftToRight.to(
      ".text-banner-text-2",
      {
        opacity: 1,
        ease: "power4.out",
      },
      "qwer",
    );
    leftToRight.to(
      ".expand-img-1",
      {
        width: "0%",
      },
      "qwer",
    );
    leftToRight.to(
      ".expand-img-2",
      {
        width: "100%",
      },
      "qwer",
    );
    leftToRight.to(
      ".text-banner-text-2",
      {
        opacity: 0.2,
        ease: "power4.out",
      },
      "ret",
    );
    leftToRight.to(
      ".text-banner-text-3",
      {
        opacity: 1,
        ease: "power4.out",
      },
      "ret",
    );
    leftToRight.to(
      ".expand-img-2",
      {
        width: "0%",
      },
      "ret",
    );
    leftToRight.to(
      ".expand-img-3",
      {
        width: "100%",
      },
      "ret",
    );
    leftToRight.to(
      ".hidden-text .business_tool_inner_line",
      {
        clipPath: "inset(0 0% 10% 0%)",
        ease: "power4.out",
      },
      "jdi",
    );
  }
  const ovalPath = document.querySelector("#ovalPath");

  if (ovalPath) {
    const length = ovalPath.getTotalLength();

    // prepare the stroke
    gsap.set(ovalPath, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(ovalPath, {
      strokeDashoffset: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ovalPath,
        start: "top 60%",
        end: "top 10%",
        toggleActions: "play none none reverse",
        scrub: true, // set true if you want scroll-controlled drawing
        // markers: true
      },
    });
  }

  let bridgeTheGap = gsap.timeline({
    scrollTrigger: {
      trigger: ".bridge-the-gap-section-outer",
      start: "top 0%",
      end: "500% 100%",
      markers: false,
      scrub: true,
      pin: true,
      pinSpacing: true,
    },
  });
  bridgeTheGap.from(
    ".slide-left-container-1",
    {
      x: "220%",
      ease: "power4.out",
    },
    "bridge-1",
  );
  bridgeTheGap.from(
    ".bridge-title-2",
    {
      x: "620%",
      ease: "power4.out",
    },
    "bridge-1",
  );
  bridgeTheGap.to(
    ".bridge-title-1",
    {
      opacity: 0.4,
      ease: "power4.out",
    },
    "bridge-1",
  );
  bridgeTheGap.fromTo(".bridge-the-gap-span", { x: "120%" }, { x: "80%", ease: "power4.out" }, "bridge-1");
  bridgeTheGap.to(
    ".bridge-the-gap-sticky-line",
    {
      width: "40%",
      ease: "power4.out",
    },
    "bridge-1",
  );

  bridgeTheGap.from(
    ".slide-left-container-2",
    {
      x: "220%",
      ease: "power4.out",
    },
    "bridge-2",
  );
  bridgeTheGap.from(
    ".bridge-title-3",
    {
      x: "500%",
      ease: "power4.out",
    },
    "bridge-2",
  );
  bridgeTheGap.to(
    ".bridge-title-2",
    {
      opacity: 0.4,
      ease: "power4.out",
    },
    "bridge-2",
  );
  bridgeTheGap.to(
    ".bridge-the-gap-span",
    {
      x: "50%",
      ease: "power4.out",
    },
    "bridge-2",
  );
  bridgeTheGap.to(
    ".bridge-the-gap-sticky-line",
    {
      width: "60%",
      ease: "power4.out",
    },
    "bridge-2",
  );

  bridgeTheGap.from(
    ".slide-left-container-3",
    {
      x: "220%",
      ease: "power4.out",
    },
    "bridge-3",
  );
  bridgeTheGap.from(
    ".bridge-title-4",
    {
      x: "500%",
      ease: "power4.out",
    },
    "bridge-3",
  );
  bridgeTheGap.to(
    ".bridge-title-3",
    {
      opacity: 0.4,
      ease: "power4.out",
    },
    "bridge-3",
  );
  bridgeTheGap.to(
    ".bridge-the-gap-span",
    {
      x: "25%",
      ease: "power4.out",
    },
    "bridge-3",
  );
  bridgeTheGap.to(
    ".bridge-the-gap-sticky-line",
    {
      width: "80%",
      ease: "power4.out",
    },
    "bridge-3",
  );

  bridgeTheGap.from(
    ".slide-left-container-4",
    {
      x: "220%",
      ease: "power4.out",
    },
    "bridge-4",
  );
  bridgeTheGap.from(
    ".bridge-title-5",
    {
      x: "500%",
      ease: "power4.out",
    },
    "bridge-4",
  );
  bridgeTheGap.to(
    ".bridge-the-gap-span",
    {
      x: "0%",
      ease: "power4.out",
    },
    "bridge-4",
  );
  bridgeTheGap.to(
    ".bridge-title-4",
    {
      opacity: 0.4,
      ease: "power4.out",
    },
    "bridge-4",
  );
  bridgeTheGap.to(
    ".bridge-the-gap-sticky-line",
    {
      width: "100%",
      ease: "power4.out",
    },
    "bridge-4",
  );

  let footerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".section_footer",
      start: window.innerWidth >= 767 ? "20% 100% " : "20% 80%",
      end: window.innerWidth >= 767 ? "150% 20%" : "100% 50%",
      markers: false,
      scrub: true,
      pin: true
    },
  });
  footerTimeline.to(
    ".bridge-the-gap-sticky",
    {
      y: "-70%",
      opacity: 0,
    },
    "a",
  );
  footerTimeline.to(
    ".steps_section",
    {
      backgroundColor: "#171f24",
    },
    "a",
  );
  footerTimeline.to(
    ".footer",
    {
      backgroundColor: "#171f24",
    },
    "a",
  );
  footerTimeline.to(
    ".bridge-the-gap-left",
    {
      transform: "translateX(45%)",
      scale: 2,
      color: "#fff",
    },
    "a",
  );
  footerTimeline.to(
    ".bridge-the-gap-span",
    {
      transform: "translate(-45%, 110%)",
      scale: 2,
      color: "#fff",
    },
    "a",
  );
}

// let topTobottom = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".text-banner-section",
//     start: "top 15%",
//     end: "100% top",
//     scrub: true,
//     pin: true,
//     markers: true,
//     pinSpacing: true
//   }
// });
// topTobottom.to(".fade-in-img-4", {
//   clipPath: "inset(0 0% 100% 0 )",
//   ease: "power4.out"
// });

/* ---------------------------------------------------------
   4) ENSURE initAnimations RUNS EVEN IF DOM IS ALREADY LOADED
------------------------------------------------------------*/

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAnimations);
} else {
  initAnimations();
}
gsap.registerPlugin(ScrollTrigger);

const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
if (!isSafari) {
  const headings = gsap.utils.toArray(".animation_title");

  headings.forEach(target => {
    const split = new SplitType(target, { types: "words, chars" }); // NOTE: SplitType, not SplitText
    const chars = split.chars;

    gsap.fromTo(
      chars,
      {
        opacity: 0.2,
        transformOrigin: "50% 0%",
        willChange: "transform",
        x: 2,
        // skewX: -20,
      },
      {
        opacity: 1,
        x: 0,
        // skewX: 0,
        ease: "sine.in",
        stagger: {
          each: 0.02,
          from: "start",
        },
        scrollTrigger: {
          trigger: target,
          start: "50% 80%",
          end: "50% 70%",
          scrub: 1,
          markers: 0,
        },
      },
    );
  });
}
