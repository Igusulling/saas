import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

interface AgentCardProps {
  name: string;
  role: string;
  description: string;
  delay?: number;
  bgColor?: string;
  outfit?: string;
}

const AgentCard = ({
  name,
  role,
  description,
  delay = 0,
  bgColor = "bg-gray-100",
  outfit,
}: AgentCardProps) => {
  const navigate = useNavigate();

  const handleAgentClick = () => {
    if (name === "Emma" && role.includes("Assistant Réunion")) {
      navigate("/emma");
    } else if (name === "Alex" && role.includes("Générateur")) {
      navigate("/alex");
    } else {
      navigate("/signup");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-[420px] cursor-pointer"
      onClick={handleAgentClick}
    >
      {/* Image background avec dégradé */}
      <div
        className={`${bgColor} h-80 flex items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="text-4xl font-bold text-white z-10 group-hover:opacity-0 transition-opacity duration-300"
        >
          {name}
        </motion.div>
      </div>

      {/* Contenu fixe */}
      <div className="p-4 text-center absolute bottom-0 left-0 right-0 bg-white">
        <p className="text-sm font-medium text-primary mb-1">{role}</p>
        <p className="text-xs text-gray-500">{outfit}</p>
      </div>

      {/* Overlay au hover */}
      <div className="absolute inset-0 bg-black/80 flex flex-col p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Zone supérieure pour future image (réservée) */}
        <div className="h-40 flex items-center justify-center">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
        </div>

        {/* Zone de description */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-[250px] mx-auto">
          <p className="text-sm leading-relaxed mb-6 text-white/90 line-clamp-5">
            {description}
          </p>
          <button
            onClick={handleAgentClick}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-white transition-colors"
          >
            {name === "Emma" && role.includes("Assistant Réunion")
              ? "Découvrir l'agent"
              : name === "Alex" && role.includes("Générateur")
              ? "Découvrir l'agent"
              : "Bientôt disponible"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentCard;
