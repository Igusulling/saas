import React, { useState } from "react";
import { motion } from "framer-motion";
import PricingCard from "../components/PricingCard";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

const pricingPlans = {
  monthly: [
    {
      name: "Pack Essentiel",
      price: 58.25,
      period: "/mois",
      yearlyDiscount: 139,
      features: [
        { text: "9 assistants IA ultra-puissants", included: true },
        { text: "Power Up - Usage illimité", included: true },
        { text: "Recherche sur Internet", included: true },
        { text: "Export des résultats web en PDF", included: true },
        { text: "Audit SEO instantané de votre site", included: true },
      ],
    },
    {
      name: "Pack Pro",
      price: 116.58,
      period: "/mois",
      yearlyDiscount: 278,
      isPopular: true,
      features: [
        { text: "Accès à l'intégralité du Pack Essentiel", included: true },
        { text: "Accès à l'intégralité du Pack Premium", included: true },
        { text: "Support prioritaire 24/7", included: true },
        { text: "Formation personnalisée", included: true },
        { text: "API dédiée", included: true },
        { text: "Statistiques avancées", included: true },
      ],
    },
    {
      name: "Pack Premium",
      price: 58.25,
      period: "/mois",
      yearlyDiscount: 139,
      features: [
        { text: "8 assistants IA", included: false },

        { text: "Gestion de 10 000 appels simultanés", included: true },
        {
          text: "Appels entrants et sortants gérés de manière fluide",
          included: true,
        },
        {
          text: "Support 24/7 pour une assistance sans interruption",
          included: true,
        },
      ],
    },
  ],
};

type RegisterResponse = {
  message?: string;
  data?: {
    token: string;
    user: any;
  };
};

const Register = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1);

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          plan: selectedPlan,
          isYearly: isYearly,
        }),
      });

      let data: RegisterResponse = {};
      try {
        data = await response.json();
      } catch (e) {
        // ignore json parse error
      }
      if (!response.ok) {
        setError(
          (data as RegisterResponse)?.message || "Erreur lors de l'inscription"
        );
        setLoading(false);
        return;
      }

      // Stockage du token
      localStorage.setItem(
        "token",
        (data as RegisterResponse).data?.token || ""
      );
      // Mise à jour immédiate de l'état de l'utilisateur
      setUser((data as RegisterResponse).data?.user);

      // Redirection vers le dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121316] text-white flex flex-col">
      {/* Logo header */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-blue-500 transition-colors flex items-center gap-2"
        >
          WorkAI
        </Link>
      </div>

      {/* Contenu principal */}
      <div className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Travaillez mieux, plus vite, plus efficacement.
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Que vous soyez une startup en pleine expansion ou une société bien
              établie, nos packs vous offrent des solutions sur mesure pour
              optimiser votre développement et maximiser votre efficacité.
            </p>
          </div>

          {step === 1 && (
            <>
              <div className="flex justify-center items-center mb-8 space-x-4">
                <span
                  className={`text-lg ${
                    !isYearly ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  Annuel
                </span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className={`relative w-14 h-7 bg-gray-700 rounded-full transition-colors
                    ${isYearly ? "bg-blue-600" : ""}`}
                  aria-label="Basculer entre paiement annuel et mensuel"
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform
                      ${isYearly ? "translate-x-8" : "translate-x-1"}`}
                  />
                </button>
                <span
                  className={`text-lg ${
                    isYearly ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  Mensuel
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans.monthly.map((plan) => (
                  <PricingCard
                    key={plan.name}
                    {...plan}
                    price={
                      isYearly
                        ? plan.price * 12 - plan.yearlyDiscount
                        : plan.price
                    }
                    period={isYearly ? "/an" : "/mois"}
                    onSelect={() => handlePlanSelect(plan.name)}
                  />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto bg-[#1E2024] rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                Créez votre compte {selectedPlan}
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                      required
                      aria-label="Prénom"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                      required
                      aria-label="Nom"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                    aria-label="Email"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                    aria-label="Mot de passe"
                    placeholder="Votre mot de passe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                    aria-label="Confirmer le mot de passe"
                    placeholder="Confirmez votre mot de passe"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={loading}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Inscription en cours...
                      </>
                    ) : (
                      "S'inscrire"
                    )}
                  </button>
                </div>
              </form>
              <p className="mt-6 text-center text-gray-400">
                Déjà un compte ?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-400">
                  Se connecter
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Register;
