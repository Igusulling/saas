import React from "react";
import { Link } from "react-router-dom";

const AgentsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#121316] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121316] via-[#1a1b1f] to-[#121316]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Nos Agents IA Spécialisés
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Découvrez nos agents IA conçus pour transformer votre façon de
            travailler et vous aider à être plus productif.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Emma Card */}
          <div className="group relative bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:scale-101 hover:shadow-lg hover:shadow-violet-500/10 overflow-hidden">
            {/* Overlay lumineux très subtil au hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-violet-500 to-pink-500 pointer-events-none"></div>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-white">Emma</h3>
                <p className="text-gray-400">Assistant IA pour les réunions</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              Emma analyse vos réunions Zoom et Teams. Elle
              extrait les points clés, crée des comptes-rendus détaillés et
              identifie les actions à suivre pour vous faire gagner du temps.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
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
                Transcription 
              </li>
              <li className="flex items-center text-gray-300">
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
                Consigne personnalisée
              </li>
              <li className="flex items-center text-gray-300">
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
                Suivi des actions
              </li>
            </ul>

            <Link
              to="/emma"
              className="inline-flex items-center text-violet-500 hover:text-violet-400 transition-colors group-hover:translate-x-2 duration-300"
            >
              Découvrir Emma
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Alex Card */}
          <div className="group relative bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:scale-101 hover:shadow-lg hover:shadow-pink-500/10 overflow-hidden">
            {/* Overlay lumineux très subtil au hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-pink-500 to-violet-500 pointer-events-none"></div>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-white">Alex</h3>
                <p className="text-gray-400">Assistant IA pour le contenu</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              Alex vous aide à créer du contenu engageant pour vos réseaux
              sociaux et campagnes publicitaires. Il génère des vidéos, images, textes
              visuels et des stratégies adaptés à votre marque.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-pink-500 mr-3"
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
                Création de contenu
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-pink-500 mr-3"
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
                Stratégie marketing
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-pink-500 mr-3"
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
                Analyse de performance
              </li>
            </ul>

            <Link
              to="/alex"
              className="inline-flex items-center text-pink-500 hover:text-pink-400 transition-colors group-hover:translate-x-2 duration-300"
            >
              Découvrir Alex
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
