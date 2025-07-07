
import React from 'react';
import { Heart, PawPrint, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-r from-green-50 via-blue-50 to-yellow-50 py-16 px-4 mt-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 nature-texture opacity-5"></div>
      <div className="absolute top-4 left-10 text-2xl text-green-500/20 floating-leaf">🍃</div>
      <div className="absolute top-8 right-16 text-xl text-blue-400/30 butterfly">🦋</div>
      <div className="absolute bottom-8 left-1/4 text-lg text-brown-500/25 paw-print">🐾</div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Mission Statement */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="bg-white/30 backdrop-blur-sm p-2 rounded-full border border-white/40">
                <PawPrint className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold gradient-text">Pawsome Profile Generator</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Creating heartfelt adoption profiles that connect rescued animals with loving families across India. 
              Every animal deserves a chance to find their forever home.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-green-600 transition-colors duration-200">
                How It Works
              </a>
              <a href="#" className="block text-muted-foreground hover:text-green-600 transition-colors duration-200">
                Success Stories
              </a>
              <a href="#" className="block text-muted-foreground hover:text-green-600 transition-colors duration-200">
                Partner Shelters
              </a>
              <a href="#" className="block text-muted-foreground hover:text-green-600 transition-colors duration-200">
                Adoption Tips
              </a>
            </div>
          </div>

          {/* Contact Info (now portfolio links) */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-foreground mb-4">Get In Touch</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center justify-center md:justify-end gap-2">
                <a href="https://pradyutdas.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 transition-colors duration-200">
                  <span>Pradyut Das</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-2">
                <a href="https://satvik-chaturvedi.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 transition-colors duration-200">
                  <span>Satvik Chaturvedi</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/30 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>Satvik Chaturvedi & Pradyut Das </span>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-green-600 transition-colors duration-200 flex items-center gap-1"
              >
                <span>Privacy Policy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-green-600 transition-colors duration-200 flex items-center gap-1"
              >
                <span>Terms of Service</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground/80">
              © 2024 Animal Profile Generator. Helping connect rescued animals with loving families across India.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
