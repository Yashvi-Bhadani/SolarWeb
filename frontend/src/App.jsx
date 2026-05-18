import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OurWork from "./pages/OurWork";
import Admin from "./pages/Admin";
import SavingsCalculator from "./pages/SavingsCalculator";

import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./context/LanguageContext";

function App() {

  return (
    <LanguageProvider>
      <BrowserRouter>

        <ScrollToTop />

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/calculator" element={<SavingsCalculator />} />

        </Routes>

      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;