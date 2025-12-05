import React from "react";

export const HeroPanel: React.FC = () => {
  return (
    <div className="relative w-full lg:w-1/2 h-96 lg:h-auto overflow-hidden bg-gray-900">
      <img
        src="/banner.jpg"
        alt="Bear"
        className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

      {/* Text */}
      <div
        className="
    absolute bottom-12 left-8 md:bottom-16 md:left-12 max-w-md text-white
    [@media(max-width:1300px)]:pb-48
  "
      >
        <p className="text-lg opacity-80 mb-2">Presenting</p>

        <h2
          className="text-3xl md:text-5xl leading-tight tracking-wide"
          style={{ fontFamily: "var(--font-bmw-bold)" }}
        >
          A MASTERPIECE
          <br />
          IN MOTION
        </h2>
      </div>
    </div>
  );
};

export default HeroPanel;
