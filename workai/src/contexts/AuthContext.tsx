import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: string;
  isYearly: boolean;
  isSubscriber: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  zoomToken: string | null;
  setZoomToken: (token: string | null) => void;
  setZoomRefreshToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshZoomToken: () => Promise<string | null>;
  teamsToken: string | null;
  setTeamsToken: (token: string | null) => void;
  setTeamsRefreshToken: (token: string | null) => void;
  refreshTeamsToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomToken, setZoomToken] = useState<string | null>(
    localStorage.getItem("zoomToken")
  );
  const [zoomRefreshToken, setZoomRefreshToken] = useState<string | null>(
    localStorage.getItem("zoomRefreshToken")
  );
  const [teamsToken, setTeamsToken] = useState<string | null>(
    localStorage.getItem("teamsToken")
  );
  const [teamsRefreshToken, setTeamsRefreshToken] = useState<string | null>(
    localStorage.getItem("teamsRefreshToken")
  );

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("zoomToken");
        localStorage.removeItem("zoomRefreshToken");
        setUser(null);
        setZoomToken(null);
        setZoomRefreshToken(null);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      localStorage.removeItem("token");
      localStorage.removeItem("zoomToken");
      localStorage.removeItem("zoomRefreshToken");
      setUser(null);
      setZoomToken(null);
      setZoomRefreshToken(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post(
          "http://localhost:3000/api/zoom/disconnect",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (e) {
        // On ignore l'erreur pour ne pas bloquer le logout
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("zoomToken");
    localStorage.removeItem("zoomRefreshToken");
    setUser(null);
    setZoomToken(null);
    setZoomRefreshToken(null);
  };

  // Fonction pour rafraîchir le token Zoom
  const refreshZoomToken = async (): Promise<string | null> => {
    if (!zoomRefreshToken) return null;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/zoom/refresh-token",
        {
          refresh_token: zoomRefreshToken,
        }
      );
      setZoomToken(res.data.access_token);
      setZoomRefreshToken(res.data.refresh_token);
      return res.data.access_token;
    } catch (err) {
      setZoomToken(null);
      setZoomRefreshToken(null);
      localStorage.removeItem("zoomToken");
      localStorage.removeItem("zoomRefreshToken");
      return null;
    }
  };

  // Fonction pour rafraîchir le token Teams
  const refreshTeamsToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("teamsRefreshToken");
    if (!refreshToken) {
      console.warn("[AuthContext] Pas de refresh token Teams disponible");
      return null;
    }
    try {
      console.log("[AuthContext] Appel refreshTeamsToken avec:", refreshToken);
      const res = await axios.post(
        "http://localhost:3000/api/teams/refresh-token",
        {
          refresh_token: refreshToken,
        }
      );
      console.log("[AuthContext] Réponse refreshTeamsToken:", res.data);
      setTeamsToken(res.data.access_token);
      setTeamsRefreshToken(res.data.refresh_token);
      localStorage.setItem("teamsRefreshToken", res.data.refresh_token);
      return res.data.access_token;
    } catch (err) {
      console.error("[AuthContext] Erreur lors du refreshTeamsToken:", err);
      setTeamsToken(null);
      setTeamsRefreshToken(null);
      localStorage.removeItem("teamsToken");
      localStorage.removeItem("teamsRefreshToken");
      return null;
    }
  };

  // Effet pour sauvegarder le token Zoom et le refresh dans le localStorage
  useEffect(() => {
    if (zoomToken) {
      localStorage.setItem("zoomToken", zoomToken);
    } else {
      localStorage.removeItem("zoomToken");
    }
  }, [zoomToken]);
  useEffect(() => {
    if (zoomRefreshToken) {
      localStorage.setItem("zoomRefreshToken", zoomRefreshToken);
    } else {
      localStorage.removeItem("zoomRefreshToken");
    }
  }, [zoomRefreshToken]);

  // Effet pour sauvegarder le token Teams et le refresh dans le localStorage
  useEffect(() => {
    if (teamsToken) {
      localStorage.setItem("teamsToken", teamsToken);
    } else {
      localStorage.removeItem("teamsToken");
    }
  }, [teamsToken]);
  useEffect(() => {
    if (teamsRefreshToken) {
      localStorage.setItem("teamsRefreshToken", teamsRefreshToken);
    } else {
      localStorage.removeItem("teamsRefreshToken");
    }
  }, [teamsRefreshToken]);

  useEffect(() => {
    checkAuth();
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        zoomToken,
        setZoomToken,
        setZoomRefreshToken,
        setUser,
        logout,
        checkAuth,
        refreshZoomToken,
        teamsToken,
        setTeamsToken,
        setTeamsRefreshToken,
        refreshTeamsToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
