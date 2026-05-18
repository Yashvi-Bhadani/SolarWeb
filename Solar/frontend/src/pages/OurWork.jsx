import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { projectData } from "../data/projectsData";

function OurWork() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section
        style={{
          background:
            "linear-gradient(90deg, #0b3d91 0%, #0b5cb8 50%, #16a34a 100%)",
          padding: "80px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "800",
              marginBottom: "18px",
              lineHeight: "1.1",
            }}
          >
            {t("ourWork.title")}
          </h1>

          <p
            style={{
              fontSize: "24px",
              maxWidth: "950px",
              margin: "0 auto",
              lineHeight: "1.7",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {t("ourWork.subtitle")}
          </p>
        </div>
      </section>

      {/* PROJECT SECTION */}
      <section
        style={{
          padding: "70px 20px",
          background: "#f4f6f9",
        }}
      >
        <div
          style={{
            maxWidth: "1450px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))",
              gap: "32px",
            }}
          >
            {projectData.map((project, index) => (
              <div
                key={index}
                className="project-hover-card"
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  overflow: "hidden",
                  transition: "all 0.35s ease",
                  boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
                  border: "1px solid #e5e7eb",
                  cursor: "pointer",
                }}
              >
                {/* IMAGE */}
                <div
                  style={{
                    width: "100%",
                    height: "260px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div
                  style={{
                    padding: "26px",
                  }}
                >
                  {/* TAGS */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginBottom: "18px",
                    }}
                  >
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "#e8f1ff",
                          color: "#0b5cb8",
                          padding: "7px 15px",
                          borderRadius: "50px",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* TITLE */}
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: "800",
                      marginBottom: "18px",
                      color: "#111827",
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* LOCATION */}
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#4b5563",
                      marginBottom: "12px",
                    }}
                  >
                    📍 {project.location}
                  </p>

                  {/* CAPACITY */}
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#16a34a",
                      fontWeight: "700",
                      marginBottom: "18px",
                    }}
                  >
                    ⚡ {project.capacity}
                  </p>

                  {/* DESCRIPTION */}
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#6b7280",
                      lineHeight: "1.8",
                    }}
                  >
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* IMPACT SECTION */}
<section
  style={{
    background: "#eef2f7",
    padding: "90px 20px",
    textAlign: "center",
  }}
>
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    <h2
      style={{
        fontSize: "56px",
        fontWeight: "800",
        marginBottom: "70px",
        color: "#000",
      }}
    >
      Our Collective Impact
    </h2>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        flexWrap: "wrap",
      }}
    >
      {/* CARD 1 */}
      <div
        style={{
          background: "white",
          padding: "35px 40px",
          borderRadius: "14px",
          minWidth: "210px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "54px",
            fontWeight: "800",
            color: "#0b4ea2",
            marginBottom: "12px",
          }}
        >
          500+
        </h3>

        <p
          style={{
            fontSize: "20px",
            color: "#4b5563",
          }}
        >
          Projects Completed
        </p>
      </div>

      {/* CARD 2 */}
      <div
        style={{
          background: "white",
          padding: "35px 40px",
          borderRadius: "14px",
          minWidth: "210px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "54px",
            fontWeight: "800",
            color: "#16a34a",
            marginBottom: "12px",
          }}
        >
          2M+
        </h3>

        <p
          style={{
            fontSize: "20px",
            color: "#4b5563",
          }}
        >
          kWh Generated
        </p>
      </div>

      {/* CARD 3 */}
      <div
        style={{
          background: "white",
          padding: "35px 40px",
          borderRadius: "14px",
          minWidth: "210px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "54px",
            fontWeight: "800",
            color: "#0b4ea2",
            marginBottom: "12px",
          }}
        >
          1.5K
        </h3>

        <p
          style={{
            fontSize: "20px",
            color: "#4b5563",
          }}
        >
          Tons CO₂ Saved
        </p>
      </div>

      {/* CARD 4 */}
      <div
        style={{
          background: "white",
          padding: "35px 40px",
          borderRadius: "14px",
          minWidth: "210px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "54px",
            fontWeight: "800",
            color: "#16a34a",
            marginBottom: "12px",
          }}
        >
          $5M+
        </h3>

        <p
          style={{
            fontSize: "20px",
            color: "#4b5563",
          }}
        >
          Customer Savings
        </p>
      </div>
    </div>
  </div>
</section>

      {/* CTA SECTION */}
      <section
        style={{
          padding: "100px 20px",
          textAlign: "center",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "52px",
              fontWeight: "800",
              marginBottom: "25px",
              color: "#111827",
            }}
          >
            Ready to Start Your Solar Journey?
          </h2>

          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.8",
              color: "#6b7280",
              marginBottom: "40px",
            }}
          >
            Let us help you design and install a custom solar solution
            for your property
          </p>

          <a
            href="/contact"
            style={{
              display: "inline-block",
              background:
                "linear-gradient(90deg,#0b4ea2,#16a34a)",
              color: "white",
              padding: "18px 42px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "18px",
              transition: "0.3s",
            }}
          >
            Get Your Free Quote
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default OurWork;