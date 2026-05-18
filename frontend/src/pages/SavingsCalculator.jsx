import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { gujaratCities, defaultGujaratCity } from "../data/gujaratCities";
import { generateSolarReportPdf } from "../utils/generateSolarReportPdf";
import { formatConsultationMessage, parseApiResponse } from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import "../styles/calculator.css";

const cities = gujaratCities;

const roofFactors = {
  "RCC Roof": 0.92,
  "Metal Roof": 0.98,
  "Tile Roof": 0.95,
  "Apartment Balcony": 0.8,
};

const sizeFactors = {
  Small: 0.85,
  Medium: 1.0,
  Large: 1.18,
};

const usageFactors = {
  Residential: 0.8,
  Commercial: 1.1,
};

const subsidyRates = {
  "RCC Roof": 0.18,
  "Metal Roof": 0.22,
  "Tile Roof": 0.2,
  "Apartment Balcony": 0.15,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export default function SavingsCalculator() {
  const { t } = useLanguage();
  const [bill, setBill] = useState(8500);
  const [location, setLocation] = useState(defaultGujaratCity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roofType, setRoofType] = useState("Metal Roof");
  const [roofSize, setRoofSize] = useState("Medium");
  const [usageType, setUsageType] = useState("Residential");
  const [rate, setRate] = useState(7);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const [leadErrors, setLeadErrors] = useState({});

  const quickSteps = t("calculator.quickSteps");

  const calculations = useMemo(() => {
    const monthlyConsumption = bill / rate;
    const sunHours = cities[location] || 5.5;
    const efficiency = roofFactors[roofType] * sizeFactors[roofSize];
    const targetGeneration = monthlyConsumption * 0.95;
    const systemSize = clamp(
      (targetGeneration / (sunHours * 30 * 0.95)) *
        (1 + (0.12 * usageFactors[usageType] - 0.09)),
      1,
      20
    );

    const panelSize = 450;
    const panelCount = Math.max(4, Math.ceil((systemSize * 1000) / panelSize));
    const generationPerMonth = systemSize * sunHours * 30 * 0.92;
    const annualGeneration = generationPerMonth * 12;
    const degradationFactor = 0.005;
    const inflation = 0.05;
    const costPerKw = 68000;
    const installCost = systemSize * costPerKw * efficiency;
    const subsidy = installCost * subsidyRates[roofType];
    const netCost = installCost - subsidy;
    const monthlySolarValue = Math.max(0, generationPerMonth * rate * 0.88);
    const monthlySavings = bill - monthlySolarValue;

    let lifetimeSavings = 0;
    let solarGeneration = annualGeneration;
    let currentRate = rate;
    for (let year = 1; year <= 25; year += 1) {
      const yearlyValue = solarGeneration * currentRate * 0.88;
      lifetimeSavings += yearlyValue;
      solarGeneration *= 1 - degradationFactor;
      currentRate *= 1 + inflation;
    }

    const payback = Math.max(
      3,
      Math.min(15, netCost / (monthlySavings * 12 || 1))
    );
    const co2Reduction =
      Math.round(((annualGeneration * 0.85) / 1000) * 100) / 100;
    const batterySuggestion = systemSize >= 6 ? "Recommended" : "Optional";
    const solarCost25 = monthlySolarValue * 12 * 25;
    const gridCost25 = bill * 12 * 25 * Math.pow(1 + inflation, 24);

    return {
      systemSize,
      installCost,
      subsidy,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      lifetimeSavings,
      payback,
      co2Reduction,
      panelCount,
      batterySuggestion,
      solarCost25,
      gridCost25,
      generationPerMonth,
    };
  }, [bill, location, roofType, roofSize, usageType, rate]);

  const handleDownloadPdf = () => {
    try {
      generateSolarReportPdf({
        inputs: {
          location,
          monthlyBill: bill,
          rate,
          roofType,
          roofSize,
          usageType,
        },
        calculations,
      });
      setToast({ type: "success", message: t("calculator.pdfSuccess") });
      setTimeout(() => setToast(null), 4000);
    } catch (error) {
      console.error("PDF generation error:", error);
      setToast({ type: "error", message: t("calculator.pdfError") });
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleLeadSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    if (name.trim().length < 2) errors.name = true;
    if (!/^\d{10}$/.test(phone.trim())) errors.phone = true;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = true;

    setLeadErrors(errors);

    if (Object.keys(errors).length > 0) {
      setToast({ type: "error", message: t("calculator.validationError") });
      return;
    }

    setIsSubmitting(true);
    setToast({ type: "info", message: t("calculator.consultSubmitting") });

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location,
      roofType,
      roofSize,
      usageType,
      monthlyBill: bill,
      rate,
      calculations: {
        systemSize: calculations.systemSize,
        installCost: calculations.installCost,
        subsidy: calculations.subsidy,
        lifetimeSavings: calculations.lifetimeSavings,
        annualSavings: calculations.annualSavings,
        payback: calculations.payback,
        panelCount: calculations.panelCount,
        co2Reduction: calculations.co2Reduction,
        generationPerMonth: calculations.generationPerMonth,
        batterySuggestion: calculations.batterySuggestion,
      },
    };

    try {
      let response = await fetch("/api/calculator/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let { data: result, isHtml } = await parseApiResponse(response);

      if (isHtml || response.status === 404) {
        response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            message: formatConsultationMessage(payload),
          }),
        });
        ({ data: result, isHtml } = await parseApiResponse(response));
      }

      if (isHtml) {
        throw new Error(t("calculator.backendUnavailable"));
      }

      if (!response.ok) {
        throw new Error(result?.message || t("calculator.consultFailed"));
      }

      setToast({
        type: "success",
        message: result?.message || t("calculator.successLead"),
      });
      setName("");
      setPhone("");
      setEmail("");
      setTimeout(() => setToast(null), 5000);
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || t("calculator.consultFailed"),
      });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = [
    { name: t("calculator.withSolar"), cost: calculations.solarCost25 / 1000 },
    {
      name: t("calculator.withoutSolar"),
      cost: calculations.gridCost25 / 1000,
    },
  ];

  const meterProgress = Math.min(
    1,
    Math.max(0, calculations.lifetimeSavings / 5000000)
  );
  const meterPercent = Math.min(
    100,
    Math.round((calculations.lifetimeSavings / 5000000) * 100)
  );

  return (
    <motion.div
      className="calculator-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />

      <main className="calculator-main">
        <motion.div
          className="calculator-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero */}
          <section className="calc-section">
            <motion.div
              className="calc-hero-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="calc-badge">{t("calculator.name")}</span>
                <h1 className="calc-title">{t("calculator.title")}</h1>
                <p className="calc-subtitle">{t("calculator.subtitle")}</p>

                <div className="calc-steps">
                  <motion.div
                    className="calc-step-card calc-step-card--title"
                    whileHover={{ scale: 1.02 }}
                  >
                    {t("calculator.quickStepsTitle")}
                  </motion.div>
                  {Array.isArray(quickSteps) &&
                    quickSteps.map((step, index) => (
                      <motion.div
                        key={step}
                        className="calc-step-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.08 }}
                      >
                        {step}
                      </motion.div>
                    ))}
                </div>

                <div className="calc-stat-row">
                  <motion.div
                    className="calc-stat-card calc-stat-card--green"
                    whileHover={{ y: -4 }}
                  >
                    <p className="calc-stat-label">{t("calculator.savings25")}</p>
                    <p className="calc-stat-value">
                      {formatCurrency(calculations.lifetimeSavings)}
                    </p>
                  </motion.div>
                  <motion.div
                    className="calc-stat-card calc-stat-card--blue"
                    whileHover={{ y: -4 }}
                  >
                    <p className="calc-stat-label">{t("calculator.payback")}</p>
                    <p className="calc-stat-value">
                      {calculations.payback.toFixed(1)} yrs
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="calc-meter-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div className="calc-meter-header">
                  <p>{t("calculator.estimatedPotential")}</p>
                  <span className="calc-live-pill">{t("calculator.live")}</span>
                </motion.div>
                <div className="calc-meter-svg-wrap">
                  <svg viewBox="0 0 220 220" className="h-52 w-52 sm:h-64 sm:w-64">
                    <defs>
                      <linearGradient id="meter-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="110"
                      cy="110"
                      r="90"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="18"
                    />
                    <motion.circle
                      cx="110"
                      cy="110"
                      r="90"
                      fill="none"
                      stroke="url(#meter-grad)"
                      strokeWidth="18"
                      strokeLinecap="round"
                      strokeDasharray={565.48}
                      animate={{
                        strokeDashoffset: 565.48 - meterProgress * 565.48,
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <text
                      x="110"
                      y="108"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-slate-900 text-3xl font-bold"
                      style={{ fontSize: 28, fontWeight: 700, fill: "#0f172a" }}
                    >
                      {meterPercent}%
                    </text>
                    <text
                      x="110"
                      y="138"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: 11, fill: "#64748b" }}
                    >
                      {t("calculator.longTermPower")}
                    </text>
                  </svg>
                </div>
                <motion.div
                  className="calc-meter-stats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="calc-meter-stat">
                    <p>{t("calculator.systemSize")}</p>
                    <p>{calculations.systemSize.toFixed(1)} kW</p>
                  </div>
                  <motion.div
                    className="calc-meter-stat"
                    whileHover={{ scale: 1.03 }}
                  >
                    <p>{t("calculator.co2Reduction")}</p>
                    <p>{calculations.co2Reduction} t/yr</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>

          {/* Inputs */}
          <motion.section
            className="calc-section"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="calc-two-col">
              <div>
                <h2 className="calc-block-title">{t("calculator.yourInputs")}</h2>
                <p className="calc-block-desc">{t("calculator.inputsSubtitle")}</p>
                <motion.div
                  className="calc-field"
                  whileHover={{ scale: 1.005 }}
                >
                  <label>{t("calculator.monthlyBill")}</label>
                  <div className="calc-input-box">
                    <motion.div
                      className="flex items-center justify-between gap-4 text-slate-600"
                      key={bill}
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="text-sm font-medium">
                        ₹{bill.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-slate-400">
                        {Math.round((bill / 50000) * 100)}%
                      </span>
                    </motion.div>
                    <input
                      type="range"
                      min="500"
                      max="50000"
                      step="100"
                      value={bill}
                      onChange={(e) => setBill(Number(e.target.value))}
                    />
                    <input
                      type="number"
                      value={bill}
                      onChange={(e) => setBill(Number(e.target.value))}
                    />
                  </div>
                </motion.div>
              </div>

              <div>
                <h2 className="calc-block-title">
                  {t("calculator.locationRooftop")}
                </h2>
                <p className="calc-block-desc">{t("calculator.locationSubtitle")}</p>
                <div className="calc-field">
                  {[
                    {
                      label: t("calculator.location"),
                      value: location,
                      setter: setLocation,
                      options: Object.keys(cities),
                    },
                    {
                      label: t("calculator.roofType"),
                      value: roofType,
                      setter: setRoofType,
                      options: Object.keys(roofFactors),
                    },
                    {
                      label: t("calculator.roofSize"),
                      value: roofSize,
                      setter: setRoofSize,
                      options: Object.keys(sizeFactors),
                    },
                    {
                      label: t("calculator.usageType"),
                      value: usageType,
                      setter: setUsageType,
                      options: Object.keys(usageFactors),
                    },
                  ].map((input) => (
                    <label key={input.label} className="block mb-4 last:mb-0">
                      <span className="block text-sm font-semibold text-slate-700 mb-2">
                        {input.label}
                      </span>
                      <select
                        value={input.value}
                        onChange={(e) => input.setter(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        {input.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                  <label className="block">
                    <span className="block text-sm font-semibold text-slate-700 mb-2">
                      {t("calculator.electricityRate")}
                    </span>
                    <input
                      type="number"
                      min="4"
                      max="20"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </label>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Results */}
          <motion.section
            className="calc-section"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="calc-results-grid calc-results-grid--4">
              {[
                {
                  title: t("calculator.recommendedSystem"),
                  value: `${calculations.systemSize.toFixed(1)} kW`,
                  hint: t("calculator.optimalCapacity"),
                },
                {
                  title: t("calculator.installationCost"),
                  value: formatCurrency(calculations.installCost),
                  hint: t("calculator.beforeSubsidy"),
                },
                {
                  title: t("calculator.govtSubsidy"),
                  value: formatCurrency(calculations.subsidy),
                  hint: t("calculator.approximateIncentive"),
                },
                {
                  title: t("calculator.panelCount"),
                  value: calculations.panelCount,
                  hint: t("calculator.estimatedModules"),
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="calc-result-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <p className="label">{item.title}</p>
                  <p className="value">{item.value}</p>
                  <p className="hint">{item.hint}</p>
                </motion.div>
              ))}
            </div>

            <div className="calc-chart-row">
              <div className="calc-chart-box">
                <div className="calc-chart-header">
                  <div>
                    <h3>{t("calculator.savingsBreakdown")}</h3>
                    <p className="calc-block-desc mt-1">
                      {t("calculator.breakdownSubtitle")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="calc-btn-outline"
                    onClick={handleDownloadPdf}
                  >
                    {t("calculator.downloadPDF")}
                  </button>
                </div>
                <div className="mt-6 h-[280px] sm:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 16, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="rgba(148,163,184,0.35)"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid #bfdbfe",
                          borderRadius: 8,
                        }}
                        formatter={(value) => [
                          `₹${Math.round(value).toLocaleString("en-IN")}k`,
                          "Cost",
                        ]}
                      />
                      <Bar dataKey="cost" radius={[12, 12, 0, 0]} fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="calc-impact-panel">
                <h3 className="calc-block-title">{t("calculator.impactPayback")}</h3>
                <div className="calc-impact-list">
                  {[
                    {
                      label: t("calculator.yearlySavings"),
                      value: formatCurrency(calculations.annualSavings),
                    },
                    {
                      label: t("calculator.paybackPeriod"),
                      value: `${calculations.payback.toFixed(1)} yrs`,
                    },
                    {
                      label: t("calculator.co2Reduction"),
                      value: `${calculations.co2Reduction} t/year`,
                    },
                    {
                      label: t("calculator.batteryAdvice"),
                      value:
                        calculations.batterySuggestion === "Recommended"
                          ? t("calculator.recommended")
                          : t("calculator.optional"),
                    },
                  ].map((item) => (
                    <div key={item.label} className="calc-impact-item">
                      <p className="label">{item.label}</p>
                      <p className="value">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Future + Lead */}
          <div className="calc-future-grid">
            <motion.section
              className="calc-section"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="calc-block-title">{t("calculator.futureTitle")}</h2>
              <p className="calc-block-desc">{t("calculator.futureSubtitle")}</p>
              <motion.div
                className="grid gap-4 mt-6 sm:grid-cols-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                <motion.div
                  className="calc-result-card"
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <p className="label">{t("calculator.co2Offset25")}</p>
                  <p className="value mt-2">
                    {(calculations.co2Reduction * 25).toFixed(1)} t
                  </p>
                </motion.div>
                <motion.div
                  className="calc-result-card"
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <p className="label">{t("calculator.generationMonth")}</p>
                  <p className="value mt-2">
                    {Math.round(calculations.generationPerMonth)} kWh
                  </p>
                </motion.div>
              </motion.div>
              <motion.div
                className="calc-highlight-card mt-6"
                whileHover={{ scale: 1.01 }}
              >
                <p className="tag">{t("calculator.savingsHero")}</p>
                <h3 className="calc-block-title mt-2">
                  {t("calculator.youCouldSave")}
                </h3>
                <p className="amount">{formatCurrency(calculations.lifetimeSavings)}</p>
                <p className="calc-block-desc mt-3">
                  {t("calculator.savingsOver25")}
                </p>
              </motion.div>
            </motion.section>

            <motion.section
              className="calc-section"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="calc-block-title">{t("calculator.leadGeneration")}</h2>
              <p className="calc-block-desc">{t("calculator.leadSubtitle")}</p>
              <form onSubmit={handleLeadSubmit} className="calc-lead-form">
                <div className="calc-lead-fields">
                  <label className="calc-lead-field">
                    <span>{t("calculator.name")}</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("calculator.namePlaceholder")}
                    />
                    {leadErrors.name && (
                      <p className="calc-error-text">{t("calculator.invalidName")}</p>
                    )}
                  </label>
                  <label className="calc-lead-field">
                    <span>{t("calculator.phone")}</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("calculator.phonePlaceholder")}
                    />
                    {leadErrors.phone && (
                      <p className="calc-error-text">
                        {t("calculator.invalidPhone")}
                      </p>
                    )}
                  </label>
                </div>
                <label className="calc-lead-field">
                  <span>{t("calculator.email")}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("calculator.emailPlaceholder")}
                  />
                  {leadErrors.email && (
                    <p className="calc-error-text">{t("calculator.invalidEmail")}</p>
                  )}
                </label>
                <motion.button
                  type="submit"
                  className="calc-btn-primary"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                >
                  {isSubmitting
                    ? t("calculator.consultSubmitting")
                    : t("calculator.getConsult")}
                </motion.button>
              </form>
            </motion.section>
          </div>
        </motion.div>
      </main>

      <Footer />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`calc-toast calc-toast--${toast.type}`}
        >
          {toast.message}
        </motion.div>
      )}
    </motion.div>
  );
}
