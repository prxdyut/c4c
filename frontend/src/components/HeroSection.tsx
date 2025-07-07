import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera, FileText } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Help Pets Find Their Forever Home
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Create compelling adoption profiles using AI to help rescue animals find loving families.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700"
            onClick={() => navigate('/create')}
          >
            <FileText className="w-5 h-5 mr-2" />
            Create Profile
          </Button>
          
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/analyze')}
          >
            <Camera className="w-5 h-5 mr-2" />
            Analyze Photo
          </Button>
        </div>

        <p className="mt-8 text-gray-500">
          Powered by advanced AI to generate engaging and effective adoption profiles
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
