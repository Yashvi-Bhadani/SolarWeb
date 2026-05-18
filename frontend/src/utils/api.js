export async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (contentType.includes("application/json")) {
    try {
      return { data: JSON.parse(text), isHtml: false };
    } catch {
      return { data: null, isHtml: false, raw: text };
    }
  }

  const trimmed = text.trim();
  if (trimmed.startsWith("<") || trimmed.startsWith("<!DOCTYPE")) {
    return { data: null, isHtml: true, raw: text };
  }

  try {
    return { data: JSON.parse(text), isHtml: false };
  } catch {
    return { data: null, isHtml: false, raw: text };
  }
}

export function formatConsultationMessage(payload) {
  const { location, roofType, roofSize, usageType, monthlyBill, rate, calculations } =
    payload;

  const fmt = (n) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

  return `Solar calculator — free consultation request

City: ${location}
Roof: ${roofType} (${roofSize})
Usage: ${usageType}
Monthly bill: ${fmt(monthlyBill)}
Electricity rate: ₹${rate}/unit

Estimated system: ${calculations?.systemSize?.toFixed?.(1) ?? calculations?.systemSize ?? "—"} kW
Installation cost: ${fmt(calculations?.installCost)}
Govt subsidy: ${fmt(calculations?.subsidy)}
25-year savings: ${fmt(calculations?.lifetimeSavings)}
Yearly savings: ${fmt(calculations?.annualSavings)}
Payback: ${calculations?.payback ?? "—"} years
Panel count: ${calculations?.panelCount ?? "—"}
CO₂ reduction: ${calculations?.co2Reduction ?? "—"} t/year
Monthly generation: ${Math.round(calculations?.generationPerMonth ?? 0)} kWh
Battery: ${calculations?.batterySuggestion ?? "—"}`;
}
