import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ZoomCallback from "./pages/ZoomCallback";
import TeamsCallback from "./pages/TeamsCallback";
import EmmaAgent from "./pages/EmmaAgent";
import AlexAgent from "./pages/AlexAgent";

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
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/signin" element={<Login />} />
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
