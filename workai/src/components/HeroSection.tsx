import React from "react";

interface HeroSectionProps {
  onGetStartedClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStartedClick }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#121316]">
      {/* Animated background */}
      <div className="absolute inset-0 bg-slate-950 z-0">
        {/* Blobs colorés plus visibles */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"
          style={{ willChange: "transform" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"
          style={{ willChange: "transform" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"
          style={{ willChange: "transform" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
          <span className="block">Gagnez du temps. </span>
          <span className="block bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
          Automatisez l’essentiel.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
        Une plateforme modulaire qui vous permet de déployer, connecter et exploiter des agents IA spécialisés via une interface unique. Générez des contenus, automatisez des actions ou analysez vos données, sans complexité technique.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStartedClick}
            className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            Commencer gratuitement
          </button>
          <button className="w-full sm:w-auto bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
            Voir la démo
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <div className="text-gray-400">Précision</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10k+</div>
            <div className="text-gray-400">Réunions analysées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">5min</div>
            <div className="text-gray-400">Temps d'analyse</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Disponibilité</div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121316] to-transparent"></div>
    </div>
  );
};

export default HeroSection;
