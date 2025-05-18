import React from "react";
import { motion } from "framer-motion";

interface Feature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  features: Feature[];
  isPopular?: boolean;
  yearlyDiscount?: number;
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period,
  features,
  isPopular,
  yearlyDiscount,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-[#1E2024] rounded-2xl p-6 ${
        isPopular ? "border-2 border-blue-500" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          Le Plus Complet
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
        <div className="flex items-center justify-center">
          <span className="text-4xl font-bold text-white">€{price}</span>
          <span className="text-lg text-gray-400 ml-1">{period}</span>
        </div>
        {yearlyDiscount && (
          <p className="text-sm text-gray-400 mt-2">
            Payez annuellement et économisez {yearlyDiscount}€
          </p>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            {feature.included ? (
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span
              className={`${feature.included ? "text-white" : "text-gray-400"}`}
            >
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onSelect}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          isPopular
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-white"
        }`}
      >
        Sélectionner
      </button>
    </motion.div>
  );
};

export default PricingCard;
