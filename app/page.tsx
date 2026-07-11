import Nav from "@/components/Nav";
import Hero from "@/components/Hero/Hero";
import InsightFlow from "@/components/InsightFlow/InsightFlow";
import DashboardPreview from "@/components/Dashboard/DashboardPreview";
import Signature from "@/components/Signature/Signature";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full bg-ink-950">
      <Nav />
      <Hero />
      <InsightFlow />
      <DashboardPreview />
      <Signature />
      <Footer />
    </main>
  );
}
