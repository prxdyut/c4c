import React, { useState, useEffect } from 'react';
import AnimalForm, { AnimalData } from '@/components/AnimalForm';
import ProfileOutput from '@/components/ProfileOutput';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AnimalService } from '@/services/animalService';

const CreateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<string>('');
  const { toast } = useToast();
  const [fadeIn, setFadeIn] = useState(false);
  const location = useLocation();
  const analysisData = location.state?.analysis;

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const generateProfile = async (data: AnimalData) => {
    setIsLoading(true);
    try {
      const animalService = AnimalService.getInstance();
      const response = await animalService.generateProfile({
        ...data,
        type: data.type || '',
        temperament: data.temperament || '',
        backstory: data.backstory + (analysisData ? `\n\nAI Analysis: ${analysisData}` : '')
      });
      setGeneratedProfile(response.data.generatedProfile);
      toast({
        title: 'Profile Generated!',
        description: 'Your adoption profile is ready to help find a loving home.',
      });
      setTimeout(() => {
        const outputElement = document.getElementById('profile-output');
        if (outputElement) {
          outputElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background relative transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Back to Home Navigation */}
      <div className="absolute left-0 top-0 p-6 z-30">
        <Link to="/" className="flex items-center gap-2 text-blue-700 hover:underline font-semibold text-lg">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
      {/* Global background texture */}
      <div className="fixed inset-0 nature-texture opacity-3 pointer-events-none" />
      {/* Form Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimalForm 
            onGenerate={generateProfile} 
            isLoading={isLoading}
            initialData={{
              type: analysisData || '',
              temperament: analysisData || '',
            }}
          />
        </div>
      </div>
      {/* Output Section */}
      {generatedProfile && (
        <div
          id="profile-output"
          className="relative py-20 px-4 bg-gradient-to-b from-transparent to-green-50/30"
        >
          <div className="max-w-6xl mx-auto">
            <ProfileOutput profile={generatedProfile} />
          </div>
        </div>
      )}
      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default CreateProfile; 