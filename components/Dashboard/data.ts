export const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "insights", label: "Insights" },
  { key: "automations", label: "Automations" },
  { key: "sources", label: "Sources" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

export const REVENUE_SERIES = [22, 28, 24, 31, 35, 33, 40, 44, 41, 48, 52, 58];

export const CONFIDENCE_SERIES = [61, 64, 63, 68, 72, 70, 75, 79, 81, 83, 85, 88];

export const INSIGHT_ROWS = [
  {
    id: "INS-241",
    title: "Churn risk concentrated in accounts onboarded via partner API",
    confidence: 94,
    impact: "High",
    status: "Ready",
  },
  {
    id: "INS-238",
    title: "Support tickets tagged 'billing' correlate with delayed invoices",
    confidence: 88,
    impact: "Medium",
    status: "Ready",
  },
  {
    id: "INS-233",
    title: "Weekend signups convert 2.1x lower without day-1 email",
    confidence: 76,
    impact: "Medium",
    status: "Reviewing",
  },
  {
    id: "INS-229",
    title: "Enterprise tier usage plateaus after seat count exceeds 40",
    confidence: 69,
    impact: "Low",
    status: "Reviewing",
  },
];

export const AUTOMATIONS = [
  { name: "Flag churn-risk accounts to CS", trigger: "Insight confidence > 90%", state: "Active" },
  { name: "Draft billing follow-up email", trigger: "Invoice overdue 3 days", state: "Active" },
  { name: "Notify growth on conversion dip", trigger: "Weekly conversion < 8%", state: "Paused" },
];
