import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { benefitsData, howItWorksData } from "../data/homeData";

function Home() {
  const { t } = useLanguage();
  const benefits = t("home.benefits");
  const steps = t("home.steps");

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-image-overlay">
          <div className="hero-gradient-overlay"></div>
        </div>

        <div className="hero-content-container">

          <div className="hero-text-content">

            <div className="text">

              <h1 className="hero-title">{t("home.heroTitle")}</h1>

              <p className="hero-subtitle">{t("home.heroSubtitle")}</p>

              {/* BUTTONS */}
              <div className="hero-buttons">

                <Link
                  to="/contact"
                  className="btn btn-hero"
                >
                  {t("home.getQuote")}
                </Link>

                <Link
                  to="/our-work"
                  className="btn btn-outline"
                >
                  {t("home.viewWork")}
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* BENEFITS SECTION */}
      <section className="benefits-section">

        <div className="container">

          <div className="section-header">

            <h2 className="section-title">{t("home.benefitsTitle")}</h2>

            <p className="section-subtitle">{t("home.benefitsSubtitle")}</p>

          </div>

          <div className="benefits-grid">

            {benefitsData.map((item, index) => (

              <div
                className="card"
                key={index}
              >

                <div className="card-content">

                  <div
                    className="icon-container"
                    dangerouslySetInnerHTML={{
                      __html: item.icon,
                    }}
                  />

                  <h3 className="card-title">
                    {Array.isArray(benefits) ? benefits[index]?.title : item.title}
                  </h3>

                  <p className="card-description">
                    {Array.isArray(benefits) ? benefits[index]?.description : item.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works-section">

        <div className="container">

          <div className="section-header">

            <h2 className="section-title">{t("home.howTitle")}</h2>

            <p className="section-subtitle">{t("home.howSubtitle")}</p>

          </div>

          <div className="how-it-works-grid">

            {howItWorksData.map((item, index) => (

              <div
                className="how-it-works-item"
                key={index}
              >

                <div className="how-it-works-step">
                  {item.step}
                </div>

                <h3 className="how-it-works-title">
                  {Array.isArray(steps) ? steps[index]?.title : item.title}
                </h3>

                <p className="how-it-works-description">
                  {Array.isArray(steps) ? steps[index]?.description : item.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* STATS SECTION */}
      <section className="stats-section">

        <div className="container">

          <div className="stats-grid">

            <div className="stat-item">

              <div className="stat-number">
                500+
              </div>

              <div className="stat-label">{t("home.statProjects")}</div>

            </div>

            <div className="stat-item">

              <div className="stat-number">
                2M+
              </div>

              <div className="stat-label">{t("home.statKwh")}</div>

            </div>

            <div className="stat-item">

              <div className="stat-number">
                98%
              </div>

              <div className="stat-label">{t("home.statSatisfaction")}</div>

            </div>

          </div>

        </div>

      </section>

      {/* CTA SECTION */}
      <section className="cta-section">

        <div className="container">

          <div className="cta-card">

            <div className="cta-card-content">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-6"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m4.93 19.07 1.41-1.41"></path>
                <path d="m17.66 6.34 1.41-1.41"></path>
              </svg>

              <h2 className="cta-title">{t("home.ctaTitle")}</h2>

              <p className="cta-subtitle">{t("home.ctaSubtitle")}</p>

              <Link
                to="/contact"
                className="btn btn-outline-cta"
              >
                {t("home.ctaButton")}
              </Link>

            </div>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Home;