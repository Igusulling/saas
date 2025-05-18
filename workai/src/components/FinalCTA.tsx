import { motion } from "framer-motion";

interface FinalCTAProps {
  onCreateAccountClick: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onCreateAccountClick }) => {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Rejoignez WorkAI dès aujourd'hui
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Transformez votre façon de travailler avec nos agents IA
            spécialisés. Commencez votre essai gratuit maintenant.
          </p>
          <button
            onClick={onCreateAccountClick}
            className="inline-block px-8 py-4 bg-white text-primary rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Créer un compte
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
