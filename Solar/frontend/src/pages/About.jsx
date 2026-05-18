import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

import "../styles/navbar.css";
import "../styles/footer.css";
import "../styles/root.css";
import "../styles/aboutus.css";

function About() {
  const { t } = useLanguage();
  const values = t("about.values");

  return (
    <>
      <Navbar />

      <div
        id="about-page"
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
              {t("about.title")}
            </h1>

            <p
              className="text-primary-foreground/90 max-w-3xl mx-auto"
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
              }}
            >
              {t("about.subtitle")}
            </p>
          </div>
        </section>

        {/* OUR STORY */}

        <section
          style={{
            paddingTop: "70px",
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
                maxWidth: "850px",
                margin: "0 auto",
              }}
            >
              <h2
                className="text-center mb-8"
                style={{
                  fontSize: "38px",
                  fontWeight: "700",
                }}
              >
                {t("about.ourStory")}
              </h2>

              <div
                style={{
                  fontSize: "18px",
                  lineHeight: "1.9",
                  color: "#475569",
                }}
              >
                <p style={{ marginBottom: "28px" }}>{t("about.storyP1")}</p>

                <p style={{ marginBottom: "28px" }}>{t("about.storyP2")}</p>

                <p>
                  Today, we continue to push the boundaries of solar
                  technology, partnering with leading manufacturers and
                  investing in training to ensure every installation meets
                  the highest standards. Our work has helped reduce carbon
                  emissions by thousands of tons while
                  <strong> saving our customers millions </strong>
                  in energy costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}

        <section
          style={{
            paddingBottom: "80px",
          }}
        >
          <div
            className="px-4"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <h2
              className="text-center mb-12"
              style={{
                fontSize: "38px",
                fontWeight: "700",
              }}
            >
              {t("about.valuesTitle")}
            </h2>

            <div className="values-grid">
              <div className="about-card">
                <div className="about-card-content">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15.4 13.9 1.8.8-1.2 2.7c-.2.4-.6.6-.9.6h-3.6c-.3 0-.7-.2-.9-.6L7 14.7l1.8-.8c1-.4 1.7-1.3 2-2.3.4-1.2.3-2.5-.2-3.7-.5-1.2-1.3-2.2-2.4-2.9C8 5.2 6.5 4.9 5.2 5.1 4 5.3 3 6.1 2 7l-1 2c-.6 1.1-.9 2.4-.8 3.7.1 1.3.6 2.5 1.4 3.6l1 2c.4.8 1.2 1.4 2 1.7.9.3 1.9.3 2.8 0h4c.9 0 1.9 0 2.8-.2.9-.3 1.7-.9 2-1.7l1-2c.8-1.1 1.3-2.3 1.4-3.6.1-1.3-.2-2.6-.8-3.7l-1-2c-1-1.2-2-1.9-3.2-2.1-1.3-.2-2.8.1-4.2.8-1.1.7-1.9 1.7-2.4 2.9-.5 1.2-.6 2.5-.2 3.7.3 1 1 1.9 2 2.3z" />
                    </svg>
                  </div>

                  <h3>{Array.isArray(values) ? values[0]?.title : "Excellence"}</h3>
                  <p>{Array.isArray(values) ? values[0]?.description : ""}</p>
                </div>
              </div>

              {/* CARD 2 */}

              <div className="about-card">
                <div className="about-card-content">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>

                  <h3>{Array.isArray(values) ? values[1]?.title : "Customer First"}</h3>
                  <p>{Array.isArray(values) ? values[1]?.description : ""}</p>
                </div>
              </div>

              {/* CARD 3 */}

              <div className="about-card">
                <div className="about-card-content">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>

                  <h3>{Array.isArray(values) ? values[2]?.title : "Innovation"}</h3>
                  <p>{Array.isArray(values) ? values[2]?.description : ""}</p>
                </div>
              </div>

              {/* CARD 4 */}

              <div className="about-card">
                <div className="about-card-content">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>

                  <h3>{Array.isArray(values) ? values[3]?.title : "Sustainability"}</h3>
                  <p>{Array.isArray(values) ? values[3]?.description : ""}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEADERSHIP */}

        <section
          style={{
            paddingBottom: "80px",
          }}
        >
          <div
            className="px-4"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <h2
              className="text-center mb-12"
              style={{
                fontSize: "38px",
                fontWeight: "700",
              }}
            >
              Our Leadership
            </h2>

            <div className="team-grid">
              <div className="about-card">
                <div className="about-card-content">
                  <div className="avatar-placeholder"></div>

                  <h3>Founder & CEO</h3>

                  <p>15+ years in renewable energy</p>
                </div>
              </div>

              <div className="about-card">
                <div className="about-card-content">
                  <div className="avatar-placeholder"></div>

                  <h3>Chief Technology Officer</h3>

                  <p>Solar engineering expert</p>
                </div>
              </div>

              <div className="about-card">
                <div className="about-card-content">
                  <div className="avatar-placeholder"></div>

                  <h3>Head of Operations</h3>

                  <p>500+ installations managed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}

        <section className="stats-section">
          <div
            className="px-4"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <h2
              className="text-center"
              style={{
                color: "white",
                fontSize: "40px",
                fontWeight: "700",
                marginBottom: "50px",
              }}
            >
              By the Numbers
            </h2>

            <div className="stats-grid">
              <div>
                <div className="stats-number">13+</div>
                <div className="stats-label">Years Experience</div>
              </div>

              <div>
                <div className="stats-number">500+</div>
                <div className="stats-label">Happy Customers</div>
              </div>

              <div>
                <div className="stats-number">50+</div>
                <div className="stats-label">Team Members</div>
              </div>

              <div>
                <div className="stats-number">98%</div>
                <div className="stats-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default About;