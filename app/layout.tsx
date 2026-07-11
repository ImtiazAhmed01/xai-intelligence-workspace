import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Xai - Intelligence Workspace",
  description:
    "Xai turns raw data into structured intelligence, actionable insight, and AI automations - calmly, and in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="noise bg-ink-950">{children}</body>
    </html>
  );
}
