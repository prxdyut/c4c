
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cream-100/50 py-8 px-4 mt-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span>for Indian Animal Rescues</span>
        </div>
        <p className="text-sm text-muted-foreground/80 mt-2">
          Helping connect rescued animals with loving families across India
        </p>
      </div>
    </footer>
  );
};

export default Footer;
