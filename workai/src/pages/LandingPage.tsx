import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AgentsSection from "../components/AgentsSection";
import WhySection from "../components/WhySection";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <>
      <Header onSignupClick={handleSignupRedirect} />
      <main>
        <HeroSection onGetStartedClick={handleSignupRedirect} />
        <AgentsSection />
        <WhySection />
        <FinalCTA onCreateAccountClick={handleSignupRedirect} />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
