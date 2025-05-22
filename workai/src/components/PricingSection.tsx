import React from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Gratuit",
    description: "Parfait pour commencer avec WorkAI",
    features: [
      "5 réunions par mois",
      "Transcription basique",
      "Synthèse simple",
      "Support par email",
    ],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "Pro",
    price: "49€",
    period: "/mois",
    description: "Pour les équipes qui veulent plus de fonctionnalités",
    features: [
      "Transcription avancée",
      "Synthèse détaillée",
      "Suivi des actions",
      "Support prioritaire",
    ],
    cta: "Essayer Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    description: "Solutions personnalisées pour les grandes entreprises",
    features: [
      "Toutes les fonctionnalités Pro",
      "Personnalisation avancée",
      "Support dédié 24/7",
      "SLA garanti",
      "Formation incluse",
    ],
    cta: "Contactez-nous",
    popular: false,
  },
];

const PricingSection: React.FC = () => {
  return (
    <section
      id="pricing"
      className="py-24 bg-[#121316] relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121316] via-[#1a1b1f] to-[#121316]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Tarifs Simples et Transparents
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Choisissez le plan qui correspond le mieux à vos besoins. Tous les
            plans incluent une période d'essai de 14 jours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#1E1F23] rounded-2xl p-8 border ${
                plan.popular ? "border-violet-500/50" : "border-white/10"
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-gray-300"
                  >
                    <svg
                      className="w-5 h-5 text-violet-500 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.name === "Enterprise" ? "/contact" : "/signup"}
                className={`block w-full text-center py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-600 hover:to-pink-600"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400">
            Besoin d'un plan personnalisé ?{" "}
            <Link
              to="/contact"
              className="text-violet-500 hover:text-violet-400"
            >
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
