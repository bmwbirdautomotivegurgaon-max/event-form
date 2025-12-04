import React from 'react';

export const HeroPanel: React.FC = () => {
  return (
    <div className="relative w-full lg:w-1/2 h-96 lg:h-auto overflow-hidden bg-gray-900">
      {/* Background Image - Using a bear image placeholder to match description */}
      <img 
        src="https://picsum.photos/id/1020/800/1200" 
        alt="Bear" 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      
      {/* Dark Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      {/* Top Left Branding */}
      <div className="absolute top-8 left-8 flex items-center space-x-3 text-white">
        <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <span className="font-serif font-bold text-lg">B</span>
        </div>
        <span className="text-xs tracking-[0.2em] font-medium uppercase opacity-90">Bird Automotive</span>
      </div>

      {/* Bottom Left Title */}
      <div className="absolute bottom-12 left-8 md:bottom-16 md:left-12 max-w-md text-white">
        <p className="font-serif italic text-lg opacity-80 mb-2">Presenting</p>
        <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight tracking-wide">
          A MASTERPIECE<br />IN MOTION
        </h2>
      </div>
    </div>
  );
};