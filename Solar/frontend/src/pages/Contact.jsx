import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { parseApiResponse } from "../utils/api";

import "../styles/navbar.css";
import "../styles/contactus.css";
import "../styles/footer.css";
import "../styles/root.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setStatusMessage("");

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setStatus("error");
      setStatusMessage(t("contact.validationError"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { data: result, isHtml } = await parseApiResponse(response);
      if (isHtml) {
        throw new Error(t("calculator.backendUnavailable"));
      }
      if (!response.ok) {
        throw new Error(result?.message || "Unable to submit your request.");
      }

      setStatus("success");
      setStatusMessage(result.message || "Your request has been submitted successfully.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setStatus("error");
      setStatusMessage(error.message || "Failed to submit your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        id="contact-page"
        style={{
          background: "#f8fafc",
        }}
      >
        {/* HERO SECTION */}

        <section
          className="bg-gradient-hero text-primary-foreground"
          style={{
            paddingTop: "50px",
            paddingBottom: "50px",
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1
              className="font-bold mb-6"
              style={{
                fontSize: "56px",
                lineHeight: "1.1",
              }}
            >
              {t('contact.title')}
            </h1>

            <p
              className="text-primary-foreground/90 max-w-3xl mx-auto"
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
              }}
            >
              {t('contact.subtitle')}
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}

        <section
          style={{
            paddingTop: "60px",
            paddingBottom: "60px",
          }}
        >
          <div
            className="px-4"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div
              className="contact-grid grid gap-8"
              style={{
                alignItems: "start",
              }}
            >
              {/* LEFT SIDE */}

              <div className="left-column space-y-6">
                {/* PHONE */}

                <div className="info-card rounded-xl border bg-card text-card-foreground shadow-sm">
                  <div className="card-spacing">
                    <div className="w-12 h-12 rounded-lg bg-[linear-gradient(135deg,hsl(210_100%_20%),hsl(210_100%_35%))] flex items-center justify-center text-primary-foreground mb-4">
                      <div className="svg-mid">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                    </div>

                    <h3 className="font-bold mb-2">Phone</h3>

                    <p className="text-muted-foreground">
                      +91 95588 95561
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      Mon-Fri 9am-6pm
                    </p>
                  </div>
                </div>

                {/* EMAIL */}

                <div className="info-card rounded-xl border bg-card text-card-foreground shadow-sm">
                  <div className="card-spacing">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-secondary-foreground mb-4">
                      <div className="svg-mid">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="20"
                            height="16"
                            x="2"
                            y="4"
                            rx="2"
                          ></rect>

                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                      </div>
                    </div>

                    <h3 className="font-bold mb-2">Email</h3>

                    <p className="text-muted-foreground">
                      raghav.sales955@gmail.com
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      We'll reply within 24h
                    </p>
                  </div>
                </div>

                {/* OFFICE */}

                <div className="info-card rounded-xl border bg-card text-card-foreground shadow-sm">
                  <div className="card-spacing">
                    <div className="w-12 h-12 rounded-lg bg-[linear-gradient(135deg,hsl(210_100%_20%),hsl(210_100%_35%))] flex items-center justify-center text-primary-foreground mb-4">
                      <div className="svg-mid">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>

                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                    </div>

                    <h3 className="font-bold mb-2">Office</h3>

                    <p className="text-muted-foreground">
                      30 shree campus, sardar chowk to Khadsad Road,
                    </p>

                    <p className="text-muted-foreground">
                      Outer Ring Road, Surat, Gujarat 395013
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE FORM */}

              <div className="right-column">
                <div className="form-card rounded-xl border bg-card text-card-foreground shadow-strong">
                  <div className="card-spacing">
                    <h2>Send Us a Message</h2>

                    {status && (
                      <div
                        className={`notification-box ${status === "success" ? "notification-success" : "notification-error"
                          }`}
                        role="status"
                        aria-live="polite"
                      >
                        {statusMessage}
                      </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                      <div>
                        <label htmlFor="name">Full Name *</label>

                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email">Email Address *</label>

                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone">Phone Number *</label>

                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="99xxxxxxxx"
                        />
                      </div>

                      <div>
                        <label htmlFor="message">Message *</label>

                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your solar energy needs..."
                        ></textarea>
                      </div>

                      <button type="submit" id="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? t('contact.sending') : t('contact.sendMessage')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAP SECTION */}

        <section
          style={{
            paddingBottom: "70px",
          }}
        >
          <div
            className="px-4"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
            >
              <iframe
                src="https://www.google.com/maps?q=https://maps.app.goo.gl/wRTAyZnuvN1HdjN69&output=embed"
                src="https://www.google.com/maps?q=Raghav+Nextgen+Energy+Pvt+Ltd+Surat&output=embed"
                width="100%"
                height="480"
                style={{
                  border: 0,
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Contact;