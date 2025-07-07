
import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import AnimalForm, { AnimalData } from '@/components/AnimalForm';
import ProfileOutput from '@/components/ProfileOutput';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateProfile = async (data: AnimalData) => {
    setIsLoading(true);
    
    // Simulate AI generation with a realistic delay
    setTimeout(() => {
      const profile = createAdoptionProfile(data);
      setGeneratedProfile(profile);
      setIsLoading(false);
      
      toast({
        title: "Profile Generated!",
        description: "Your adoption profile is ready to help find a loving home.",
      });

      // Smooth scroll to the output section
      setTimeout(() => {
        const outputElement = document.getElementById('profile-output');
        if (outputElement) {
          outputElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 2000);
  };

  const createAdoptionProfile = (data: AnimalData): string => {
    const { name, type, age, gender, temperament, healthNotes, backstory, idealHome } = data;
    
    let profile = `🐾 Meet ${name} - Your Next Best Friend!\n\n`;
    
    profile += `${name} is a ${age} old ${gender ? gender + ' ' : ''}${type} with a heart full of love and a personality that will melt your heart. `;
    
    if (temperament) {
      profile += `Known for being ${temperament.toLowerCase()}, ${name} brings joy and warmth to everyone they meet.\n\n`;
    }
    
    if (backstory) {
      profile += `📖 ${name}'s Story:\n${backstory}\n\n`;
    }
    
    if (healthNotes) {
      profile += `🏥 Health & Care:\n${healthNotes}\n\n`;
    }
    
    if (idealHome) {
      profile += `🏠 ${name}'s Perfect Home:\n${idealHome}\n\n`;
    } else {
      profile += `🏠 ${name}'s Perfect Home:\n${name} would thrive in a loving home where they can receive the attention and care they deserve. `;
      if (type.includes('puppy') || type.includes('kitten')) {
        profile += `As a young animal, they would benefit from patient training and lots of love.\n\n`;
      } else {
        profile += `They would make a wonderful companion for individuals or families ready to open their hearts.\n\n`;
      }
    }
    
    profile += `💕 Why Choose ${name}?\n`;
    profile += `${name} isn't just looking for a home - they're looking for a family. This special ${type} has so much love to give and is ready to become your most loyal companion. Every rescued animal deserves a second chance at happiness, and ${name} is no exception.\n\n`;
    
    profile += `📞 Ready to Meet ${name}?\n`;
    profile += `If you think ${name} might be the perfect addition to your family, don't wait! Contact us today to arrange a meeting. Your new best friend is waiting for you.\n\n`;
    
    profile += `#AdoptDontShop #RescueAnimalsIndia #${name}NeedsAHome #IndianAnimalRescue`;
    
    return profile;
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Global background texture */}
      <div className="fixed inset-0 nature-texture opacity-3 pointer-events-none" />

      {/* Hero Section */}
      <HeroSection />

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
