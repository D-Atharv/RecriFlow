import { redirect } from "next/navigation";

import { getSessionUser } from "@/server/auth/session";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { StatsSection } from "@/components/landing/stats-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { AiFeature } from "@/components/landing/ai-feature";
import { FeatureOnboard } from "@/components/landing/feature-onboard";
import { FeatureDecide } from "@/components/landing/feature-decide";
import { FeatureData } from "@/components/landing/feature-data";
import { SecuritySection } from "@/components/landing/security-section";
import { NewsSection } from "@/components/landing/news-section";
import { Footer } from "@/components/landing/footer";

import { FeatureManagement } from "@/components/landing/feature-management";

export default async function HomePage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeatureManagement />
        <LogoCloud />
        <StatsSection />
        <TestimonialSection />
        <AiFeature />
        <FeatureOnboard />
        <FeatureDecide />
        <FeatureData />
        <SecuritySection />
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}
