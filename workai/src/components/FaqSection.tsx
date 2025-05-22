import React, { useState } from "react";

const faqs = [
  {
    question: "Comment fonctionne WorkAI ?",
    answer:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  {
    question: "Est-ce que mes données sont sécurisées ?",
    answer:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  {
    question: "Quelles plateformes de visioconférence sont supportées ?",
    answer:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
  },
  {
    question: "Puis-je essayer WorkAI avant de m'engager ?",
    answer:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  {
    question: "Comment puis-je obtenir de l'aide si j'ai des questions ?",
    answer:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
];

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#121316] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121316] via-[#1a1b1f] to-[#121316]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur WorkAI et son fonctionnement.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-[#1E1F23] hover:bg-[#25262B] transition-colors duration-200"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-white">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96 py-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
