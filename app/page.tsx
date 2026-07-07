'use client';

// import Hero from '@/components/Hero';
// import InsightFlow from '@/components/InsightFlow';
// import Dashboard from '@/components/Dashboard';
// import Signature3D from '@/components/Signature3D';
import Hero from "./components/Hero";
import InsightFlow from "./components/InsightFlow";
import Dashboard from "./components/Dashboard";
import Singature3D from "./components/Signature3D";
// import Singature3D from "./components/Signature3D";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* <Hero /> */}
      <Hero></Hero>
      <InsightFlow />
      <Dashboard />
      {/* <Signature3D /> */}
      <Singature3D></Singature3D>

      <footer className="py-20 text-center text-sm text-gray-500 border-t border-white/10">
        © 2026 Xai Intelligence Workspace • Frontend Challenge Prototype
      </footer>
    </main>
  );
}