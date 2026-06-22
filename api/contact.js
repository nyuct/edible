const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { name, email, phone, jobTitle, organisation, enquiry, message } = body || {};

    if (!name || !email || !organisation || !enquiry || !message) {
      return res
        .status(400)
        .json({
          success: false,
          error:
            "name, email, organisation, enquiry, and message are required",
        });
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        error: "EMAIL_USER and EMAIL_PASS are not configured",
        data: process.env
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "wakeup@nyuct.com",
      subject: "New Contact Form Submission from Edible Ventures",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nJob Title: ${
        jobTitle || "Not provided"
      }\nOrganisation: ${organisation}\nEnquiry: ${enquiry}\nMessage: ${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false });
  }
};
