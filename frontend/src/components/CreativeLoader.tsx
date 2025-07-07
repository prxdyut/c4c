import React from 'react';
import { PawPrint } from 'lucide-react';

const CreativeLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
    <PawPrint className="w-16 h-16 text-neutral-700 animate-pulse-paw" />
    <style>{`
      @keyframes pulse-paw {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      .animate-pulse-paw {
        animation: pulse-paw 1.5s ease-in-out infinite;
      }
    `}</style>
  </div>
);

export default CreativeLoader; 