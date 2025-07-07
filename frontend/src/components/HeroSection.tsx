
import React from 'react';
import { Heart } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="hero-gradient py-16 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-accent/10 p-4 rounded-full">
              <Heart className="w-12 h-12 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Animal Adoption
            <br />
            <span className="text-accent">Profile Generator</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create compelling adoption stories that help rescued animals in India find their forever homes. 
            Transform simple details into heartwarming profiles that connect with potential adopters.
          </p>
        </div>
        
        {/* Decorative animal silhouettes */}
        <div className="flex justify-center items-center gap-8 opacity-20">
          <div className="text-6xl">🐕</div>
          <div className="text-5xl">🐈</div>
          <div className="text-4xl">🐾</div>
          <div className="text-5xl">🐕‍🦺</div>
          <div className="text-6xl">🐱</div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
