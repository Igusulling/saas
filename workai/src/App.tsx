import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AgentsSection from "./components/AgentsSection";
import FeaturesSection from "./components/FeaturesSection";
import PricingSection from "./components/PricingSection";
import FaqSection from "./components/FaqSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import { AuthPage } from "./pages/AuthPage";
import EmmaAgent from "./pages/EmmaAgent";
import AlexAgent from "./pages/AlexAgent";
import ZoomCallback from "./pages/ZoomCallback";
import TeamsCallback from "./pages/TeamsCallback";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-[#121316]">
      <Navbar onSignupClick={handleSignupClick} />
      <HeroSection onGetStartedClick={handleSignupClick} />
      <AgentsSection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection onCreateAccountClick={handleSignupClick} />
      <Footer />
    </div>
  );
};

const OAuthCallback = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("teams_access_token") || params.get("teams_refresh_token")) {
    return <TeamsCallback />;
  }
  return <ZoomCallback />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#121316]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/emma" element={<EmmaAgent />} />
            <Route path="/alex" element={<AlexAgent />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
