import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

// Fonction utilitaire pour faire un appel API Teams avec refresh automatique du token
export async function callTeamsApi({
  endpoint,
  method = "get",
  data = null,
  params = null,
  auth,
}: {
  endpoint: string;
  method?: "get" | "post";
  data?: any;
  params?: any;
  auth: ReturnType<typeof useAuth>;
}) {
  let { teamsToken, refreshTeamsToken, setTeamsToken } = auth;
  console.log("[TeamsAPI] Appel avec token:", teamsToken);
  try {
    const response = await axios({
      url: endpoint,
      method,
      data,
      params,
      headers: {
        Authorization: `Bearer ${teamsToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === "InvalidAuthenticationToken"
    ) {
      console.log("[TeamsAPI] Token expiré, tentative de refresh...");
      const newToken = await refreshTeamsToken();
      console.log("[TeamsAPI] Nouveau token obtenu:", newToken);
      if (newToken) {
        setTeamsToken(newToken);
        // On retente la requête avec le nouveau token
        const retryResponse = await axios({
          url: endpoint,
          method,
          data,
          params,
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
        return retryResponse.data;
      } else {
        console.error("[TeamsAPI] Echec du refresh token (token null)");
      }
    }
    throw error;
  }
}
