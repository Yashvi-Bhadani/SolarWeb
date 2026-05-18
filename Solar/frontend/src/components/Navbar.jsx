import { Link, useLocation } from "react-router-dom";

import "../styles/navbar.css";
import { useLanguage } from "../context/LanguageContext";

import logo from "../assets/Raghav Solar_Final Logo-01.jpeg";

function Navbar() {

  const location = useLocation();
  const { t, lang, setLang } = useLanguage();

  return (
    <header className="navbar" id="myTopnav">

      <div className="navbar-container">

        <div className="navbar-left">

          <div className="logo">

            <img
              className="img1"
              src={logo}
              alt="Raghav Solar Logo"
              width="70"
            />

          </div>

        </div>

        <nav className="navbar-links">

          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            {t('nav.home')}
          </Link>

          <Link
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
          >
            {t('nav.about')}
          </Link>

          <Link
            to="/our-work"
            className={location.pathname === "/our-work" ? "active" : ""}
          >
            {t('nav.ourWork')}
          </Link>

          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            {t('nav.contact')}
          </Link>

          <Link
            to="/calculator"
            className={location.pathname === "/calculator" ? "active" : ""}
          >
            {t('nav.savings')}
          </Link>
          <div className="navbar-right">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="navbar-lang-select"
              aria-label="Language selector"
            >
              <option value="en">EN</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </div>        </nav>

      </div>

    </header>
  );
}

export default Navbar;