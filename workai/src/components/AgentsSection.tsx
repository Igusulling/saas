import React from "react";
import AgentCard from "./AgentCard";

const agents = [
  {
    name: "Emma",
    role: " Assistant Réunion",
    description:
      "LOrem  ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    bgColor: "bg-gradient-to-br from-rose-400 to-pink-500",
    outfit: "",
    delay: 0,
  },
  {
    name: "Alex",
    role: "Générateur de Présentations",
    description:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    bgColor: "bg-gradient-to-br from-blue-400 to-indigo-500",
    outfit: "",
    delay: 0.1,
  },
  {
    name: "Sophie",
    role: "Recrutement Automatisé ",
    description:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    bgColor: "bg-gradient-to-br from-purple-400 to-violet-500",
    outfit: "",
    delay: 0.2,
  },
  {
    name: "Lucas",
    role: "Analyse de Fichiers ",
    description:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    bgColor: "bg-gradient-to-br from-emerald-400 to-teal-500",
    outfit: "",
    delay: 0.3,
  },
  {
    name: "Léa",
    role: " Générateur et Planificateur de Contenu",
    description:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    bgColor: "bg-gradient-to-br from-amber-400 to-orange-500",
    outfit: "",
    delay: 0.4,
  },
];

const AgentsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Notre Équipe d'Agents IA
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez notre équipe d'agents virtuels, disponibles 24/7 pour
            répondre à vos besoins professionnels. Chaque agent est spécialisé
            dans son domaine pour vous offrir une expertise pointue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {agents.map((agent, index) => (
            <AgentCard key={index} {...agent} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
