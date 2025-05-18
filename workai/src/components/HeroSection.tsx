import React from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStartedClick }) => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Réinventez votre quotidien avec l'IA
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez une nouvelle ère de productivité avec nos agents IA
              spécialisés, conçus pour transformer votre façon de travailler.
            </p>
            <button
              onClick={onGetStartedClick}
              className="inline-block px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-secondary transition-colors"
            >
              Essayer maintenant
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1"
          >
            <img
              src="/hero-image.png"
              alt="WorkAI Illustration"
              className="w-full max-w-lg mx-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
