import { Navigation } from "./components/Navigation";
import { ConfessionHero } from "./components/ConfessionHero";
import { ConfessionsSection } from "./components/ConfessionsSection";
import { GuidelinesSection } from "./components/GuidelinesSection";
import { Footer } from "./components/Footer";
import { useState } from "react";
import { Toaster } from "sonner";


export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleConfessionSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] dark">
      <Toaster richColors position="top-center" />
      
      <Navigation />
      <ConfessionHero onConfessionSubmitted={handleConfessionSubmitted} />
      <ConfessionsSection refreshTrigger={refreshTrigger} />
      <GuidelinesSection />
      <Footer />
    </div>
  );
}
