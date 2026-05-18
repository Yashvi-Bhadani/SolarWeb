import { jsPDF } from "jspdf";

function formatCurrency(value) {
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

export function generateSolarReportPdf({ inputs, calculations }) {
  const doc = new jsPDF();
  const margin = 14;
  let y = 20;

  const addLine = (text, size = 11, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, margin, y);
    y += lines.length * (size * 0.45) + 4;
  };

  doc.setTextColor(22, 101, 52);
  addLine("Raghav Solar — Savings Report", 18, true);
  doc.setTextColor(30, 41, 59);
  addLine(`Generated: ${new Date().toLocaleString("en-IN")}`, 10);
  y += 4;

  addLine("Your inputs", 13, true);
  addLine(`City: ${inputs.location}`);
  addLine(`Monthly bill: ${formatCurrency(inputs.monthlyBill)}`);
  addLine(`Electricity rate: Rs ${inputs.rate}/unit`);
  addLine(`Roof type: ${inputs.roofType}`);
  addLine(`Roof size: ${inputs.roofSize}`);
  addLine(`Usage: ${inputs.usageType}`);
  y += 4;

  addLine("Estimated results", 13, true);
  addLine(`Recommended system: ${calculations.systemSize.toFixed(1)} kW`);
  addLine(`Installation cost: ${formatCurrency(calculations.installCost)}`);
  addLine(`Govt subsidy (approx.): ${formatCurrency(calculations.subsidy)}`);
  addLine(`Panel count: ${calculations.panelCount}`);
  addLine(`Yearly savings: ${formatCurrency(calculations.annualSavings)}`);
  addLine(`25-year savings: ${formatCurrency(calculations.lifetimeSavings)}`);
  addLine(`Payback period: ${calculations.payback.toFixed(1)} years`);
  addLine(`CO2 reduction: ${calculations.co2Reduction} t/year`);
  addLine(`Monthly generation: ${Math.round(calculations.generationPerMonth)} kWh`);
  y += 6;

  doc.setTextColor(37, 99, 235);
  addLine("Contact us for a free consultation:", 11, true);
  doc.setTextColor(71, 85, 105);
  addLine("Email: raghav.enterpris1@gmail.com | Phone: +91 95588 95561");

  doc.save(`solar-savings-${inputs.location.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
