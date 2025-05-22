import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AnimatedBackground } from "../components/ui/AnimatedBackground";
import { LogoIcon } from "../components/ui/LogoIcon";
import {
  MailIcon,
  LockIcon,
  LogInIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Définir l'onglet actif en fonction de l'URL
  useEffect(() => {
    if (location.pathname === "/signup") {
      setActiveTab("register");
    } else {
      setActiveTab("signin");
    }
  }, [location]);

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!signInData.email || !signInData.password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      if (data.success && data.data) {
        localStorage.setItem("token", data.data.token);
        setUser(data.data.user);
        navigate("/dashboard");
      } else {
        throw new Error("Réponse invalide du serveur");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (
      !registerData.email ||
      !registerData.password ||
      !registerData.firstName ||
      !registerData.lastName
    ) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      if (data.success && data.data) {
        localStorage.setItem("token", data.data.token);
        setUser(data.data.user);
        navigate("/dashboard");
      } else {
        throw new Error("Réponse invalide du serveur");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex w-full min-h-screen justify-center items-center p-4 overflow-hidden font-sans bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AnimatedBackground />
      <div className="w-full max-w-xl z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <LogoIcon className="w-12 h-12" />
        </div>
        <div className="backdrop-blur-xl bg-white/[0.02] rounded-2xl shadow-2xl border border-white/[0.05] overflow-hidden">
          {/* Tabs */}
          <div className="flex p-1 bg-white/[0.03] m-4 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-3 px-6 rounded-lg text-base font-medium transition-all duration-300 ${
                activeTab === "signin"
                  ? "bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
              onClick={() => setActiveTab("signin")}
            >
              Connexion
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-6 rounded-lg text-base font-medium transition-all duration-300 ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Inscription
            </button>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <div className="relative">
              {activeTab === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      Bienvenue
                    </h1>
                    <p className="text-white/50 text-sm">
                      Connectez-vous à votre compte
                    </p>
                  </div>
                  {error && (
                    <div className="text-red-500 bg-red-500/10 p-4 rounded-lg text-sm animate-fadeIn">
                      {error}
                    </div>
                  )}
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    icon={<MailIcon size={18} />}
                    value={signInData.email}
                    onChange={handleSignInChange}
                    placeholder="Votre email"
                    required
                  />
                  <Input
                    label="Mot de passe"
                    type="password"
                    name="password"
                    icon={<LockIcon size={18} />}
                    value={signInData.password}
                    onChange={handleSignInChange}
                    placeholder="Votre mot de passe"
                    required
                  />
                  <Button
                    type="submit"
                    loading={loading}
                    icon={<LogInIcon size={18} />}
                  >
                    Se connecter
                  </Button>
                </form>
              )}
              {activeTab === "register" && (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      Créer un compte
                    </h1>
                    <p className="text-white/50 text-sm">
                      Rejoignez notre communauté
                    </p>
                  </div>
                  {error && (
                    <div className="text-red-500 bg-red-500/10 p-4 rounded-lg text-sm animate-fadeIn">
                      {error}
                    </div>
                  )}
                  <Input
                    label="Prénom"
                    type="text"
                    name="firstName"
                    icon={<UserIcon size={18} />}
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    placeholder="Votre prénom"
                    required
                  />
                  <Input
                    label="Nom"
                    type="text"
                    name="lastName"
                    icon={<UserIcon size={18} />}
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    placeholder="Votre nom"
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    icon={<MailIcon size={18} />}
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="Votre email"
                    required
                  />
                  <Input
                    label="Mot de passe"
                    type="password"
                    name="password"
                    icon={<LockIcon size={18} />}
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Créez un mot de passe"
                    required
                  />
                  <Button
                    type="submit"
                    loading={loading}
                    icon={<UserPlusIcon size={18} />}
                  >
                    Créer un compte
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.05] p-6 text-center bg-white/[0.02]">
            <p className="text-white/50 text-sm">
              {activeTab === "signin" ? (
                <>
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-[#E100FF] hover:text-white transition-colors font-medium"
                  >
                    S'inscrire
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="text-[#E100FF] hover:text-white transition-colors font-medium"
                  >
                    Se connecter
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
