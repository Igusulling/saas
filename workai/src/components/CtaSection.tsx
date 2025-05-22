import React from "react";
import { Link } from "react-router-dom";

interface CtaSectionProps {
  onCreateAccountClick?: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onCreateAccountClick }) => {
  return (
    <section className="py-24 bg-[#121316] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121316] via-[#1a1b1f] to-[#121316]"></div>

      {/* Gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#1E1F23] rounded-2xl p-8 md:p-12 border border-white/10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à transformer votre workflow ?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Rejoignez-nous & utilisez WorkAI pour être plus productifs et et
              mieux organisés. Commencez gratuitement dès aujourd'hui.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onCreateAccountClick}
                className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                Créer un compte gratuit
              </button>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                Demander une démo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
