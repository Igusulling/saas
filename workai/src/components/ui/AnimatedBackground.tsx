import React from "react";

export const AnimatedBackground: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 bg-gray-900 z-0"></div>
      {/* Animated gradient blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] rounded-full opacity-30 blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-r from-[#00F260] to-[#0575E6] rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] rounded-full opacity-30 blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </>
  );
};
