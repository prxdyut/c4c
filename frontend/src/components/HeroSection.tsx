import React, { useState } from 'react';
import { Heart, PawPrint, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BlurText from './blurtext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  const handleAnimationComplete = () => {
    // You can add any logic here if needed after animation completes
  };

  const handleStartClick = () => {
    setFade(true);
    setTimeout(() => {
      navigate('/create-animal');
    }, 500); // Duration matches the fade-out transition
  };

  return (
    <div className="nature-hero relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/video/hero-vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Main content */}
      <div className={`relative z-20 text-center px-4 max-w-6xl mx-auto transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
        {/* Icon */}

        {/* Main heading */}
        <BlurText
          text="Generate Heartfelt Animal Adoption Profiles"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white w-full justify-center"
        />

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-12 leading-relaxed">
          Create compelling adoption stories that help rescued animals in India find their forever homes. 
          Transform simple details into heartwarming profiles that connect with potential adopters.
        </p>

        {/* CTA Button */}
        <div className="mb-16">
          <button 
            onClick={handleStartClick}
            className="nature-button text-white px-8 py-4 rounded-full text-lg font-semibold hover-lift"
          >
            <PawPrint className="inline-block w-6 h-6 mr-2" />
            Start Creating Profiles
          </button>
        </div>

        {/* Decorative animal silhouettes */}
        {/* Removed animal icons as requested */}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;