import "../styles/footer.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <div className="company-logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="company-icon"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m4.93 19.07 1.41-1.41" />
                <path d="m17.66 6.34 1.41-1.41" />
              </svg>
              <h3 className="company-title">{t("footer.companyTitle")}</h3>
            </div>
            <p className="company-description">{t("footer.companyDesc")}</p>
          </div>

          <div>
            <h3 className="footer-heading">{t("footer.quickLinks")}</h3>
            <div className="quick-links">
              <Link to="/" className="footer-link">{t("nav.home")}</Link>
              <Link to="/about" className="footer-link">{t("nav.about")}</Link>
              <Link to="/our-work" className="footer-link">{t("nav.ourWork")}</Link>
              <Link to="/contact" className="footer-link">{t("nav.contact")}</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">{t("footer.contactInfo")}</h3>
            <div className="contact-info">
              <div className="contact-item">📞 +91 95588 95561</div>
              <div className="contact-item">✉️ raghav.enterpris1@gmail.com</div>
              <div className="contact-item">
                📍 30 shree campus, sardar chowk to Khadsad Road, Outer Ring Road,
                Surat, Gujarat 394326
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-section">{t("footer.copyright")}</div>
      </div>
    </footer>
  );
}

export default Footer;