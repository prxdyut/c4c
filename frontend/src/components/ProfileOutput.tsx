import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Copy,
  CheckCircle,
  Heart,
  Sparkles,
  Download,
  Share2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ProfileOutputProps {
  profile: string;
  images: string[];
}

const ProfileOutput: React.FC<ProfileOutputProps> = ({ profile, images }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove the asterisks and wrap in bold
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile);
      setCopied(true);
      toast({
        title: "Profile Copied!",
        description: "The adoption profile has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description:
          "Unable to copy to clipboard. Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById('profile-output');
    if (!element) {
      toast({
        title: "Download Failed",
        description: "Could not find the profile content to download.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Temporarily modify styles for PDF generation
      element.classList.add('pdf-generation');
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        .pdf-generation {
          background-color: white !important;
          backdrop-filter: none !important;
          border: none !important;
        }
        .pdf-generation * {
          color: black !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(styleSheet);

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true, // Enable loading cross-origin images
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Clean up temporary styles
      element.classList.remove('pdf-generation');
      document.head.removeChild(styleSheet);

      // PDF dimensions (A4)
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10; // margin in mm
      const availableHeight = pageHeight - (2 * margin);

      // Calculate image dimensions maintaining aspect ratio
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate number of pages needed
      const pageCount = Math.ceil(imgHeight / availableHeight);
      
      // For each page
      for (let page = 0; page < pageCount; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // Calculate the height of the slice to use for this page
        const sourceY = page * (canvas.height / (imgHeight / availableHeight));
        const sliceHeight = canvas.height / (imgHeight / availableHeight);

        // Create a temporary canvas for the slice
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sliceHeight;
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sliceHeight,
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );

          // Add the slice to the PDF
          const imgData = tempCanvas.toDataURL('image/png');
          pdf.addImage(
            imgData,
            'PNG',
            margin,
            margin,
            imgWidth - (2 * margin),
            availableHeight
          );
        }
      }

      pdf.save('adoption-profile.pdf');

      toast({
        title: "Profile Downloaded!",
        description: "Your adoption profile has been saved as a PDF.",
      });
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "There was an error creating the PDF. Please try again.",
        variant: "destructive",
      });
      console.error('PDF generation error:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Animal Adoption Profile",
          text: profile,
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute -top-6 -left-6 text-3xl text-green-500/20 floating-leaf">
        🍃
      </div>
      <div className="absolute -top-4 -right-4 text-2xl text-blue-400/30 butterfly">
        🦋
      </div>
      <div className="absolute -bottom-8 left-1/3 text-xl text-brown-500/25 paw-print">
        🐾
      </div>

      <Card className="relative w-full max-w-4xl mx-auto glassmorphism soft-shadow border-white/20 hover-lift animate-fade-in">
        <CardHeader className="text-center pb-8 relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 via-blue-50/30 to-yellow-50/50 rounded-t-lg"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="bg-white/30 backdrop-blur-sm p-4 rounded-full border border-white/40 soft-shadow">
                  <Heart className="text-red-500 w-8 h-8 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                </div>
              </div>
            </div>

            <CardTitle className="text-3xl font-bold gradient-text mb-3">
              Your Adoption Profile is Ready!
            </CardTitle>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A heartfelt story that will help find a loving home for this
              special animal
            </p>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* Profile Content */}
          <div className="relative">
            <div id="profile-output" className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 soft-shadow hover-lift">
              <div className="flex justify-center mb-4 gap-4">
              {images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Animal"
                  className="w-40 h-40 rounded-full object-cover"
                />
              ))}
              </div>
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed font-medium">
                  {formatTextWithBold(profile)}
                </div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 text-2xl opacity-20">
                💕
              </div>
              <div className="absolute bottom-4 left-4 text-xl opacity-20">
                🐾
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-4 justify-center">

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <Button
              onClick={handleCopy}
              className="nature-button text-white font-semibold py-3 rounded-xl transition-all duration-300 hover-lift"
            >
              {copied ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Copied!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Copy className="w-5 h-5" />
                  <span>Copy Text</span>
                </div>
              )}
            </Button>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 font-semibold py-3 rounded-xl transition-all duration-300 hover-lift"
            >
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </div>
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold py-3 rounded-xl transition-all duration-300 hover-lift"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </div>
            </Button>
          </div>

          {/* Success message */}
          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Profile generated successfully! Ready to help find a loving home.
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileOutput;
