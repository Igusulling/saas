import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { callTeamsApi } from "../utils/teamsApi";

const TeamsCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTeamsToken, setTeamsRefreshToken } = useAuth();
  const auth = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const teamsAccessToken = params.get("teams_access_token");
    const teamsRefreshToken = params.get("teams_refresh_token");
    const error = params.get("error");

    console.log("URL de callback reçue :", location.search);
    console.log("teamsAccessToken reçu :", teamsAccessToken);
    console.log("teamsRefreshToken reçu :", teamsRefreshToken);

    if (teamsAccessToken) {
      setTeamsToken(teamsAccessToken);
      if (teamsRefreshToken) {
        setTeamsRefreshToken(teamsRefreshToken);
        localStorage.setItem("teamsRefreshToken", teamsRefreshToken);
        console.log(
          "teamsRefreshToken stocké dans localStorage :",
          teamsRefreshToken
        );
      }
      // Exemple d'appel API Teams avec refresh automatique
      (async () => {
        try {
          const meetings = await callTeamsApi({
            endpoint: "/api/teams/meetings",
            method: "get",
            auth,
          });
          console.log("Réunions Teams:", meetings);
        } catch (err) {
          console.error(
            "Erreur lors de la récupération des réunions Teams:",
            err
          );
        }
      })();
      navigate("/EmmaAgent");
    } else if (error) {
      console.error("Erreur l'authentification Teams:", error);
      navigate("/EmmaAgent", {
        state: { error: "Échec de la connexion à Teams" },
      });
    }
  }, [location, navigate, setTeamsToken, setTeamsRefreshToken, auth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default TeamsCallback;
