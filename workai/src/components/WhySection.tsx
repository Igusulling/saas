import { Clock, Zap, Layers, Settings } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Clock,
    title: "Gain de temps",
    description:
      "Automatisez vos tâches répétitives et concentrez-vous sur ce qui compte vraiment.",
  },
  {
    icon: Zap,
    title: "Productivité",
    description:
      "Boostez votre efficacité avec des agents IA spécialisés et performants.",
  },
  {
    icon: Layers,
    title: "Centralisation",
    description:
      "Tous vos agents IA au même endroit, pour une gestion simplifiée.",
  },
  {
    icon: Settings,
    title: "Automatisation",
    description:
      "Libérez-vous des tâches manuelles grâce à l'automatisation intelligente.",
  },
];

const WhySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi WorkAI ?
          </h2>
          <p className="text-xl text-gray-600">
            Les avantages de notre plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
