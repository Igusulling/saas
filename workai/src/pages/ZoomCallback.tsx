import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import EmmaAgent from "./EmmaAgent";

const ZoomCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setZoomToken }: any = useAuth();
  const { setZoomRefreshToken }: any = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const error = params.get("error");

    if (accessToken) {
      setZoomToken(accessToken);
      if (refreshToken) setZoomRefreshToken(refreshToken);
      navigate("/EmmaAgent");
    } else if (error) {
      console.error("Erreur l'authentification Zoom:", error);
      navigate("/EmmaAgent", {
        state: { error: "Échec de la connexion à Zoom" },
      });
    }
  }, [location, navigate, setZoomToken, setZoomRefreshToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default ZoomCallback;
