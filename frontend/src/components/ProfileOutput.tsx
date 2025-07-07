
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, Heart, Sparkles, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileOutputProps {
  profile: string;
}

const ProfileOutput: React.FC<ProfileOutputProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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
        description: "Unable to copy to clipboard. Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([profile], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adoption-profile.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Profile Downloaded!",
      description: "Your adoption profile has been saved to your device.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Animal Adoption Profile',
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
      <div className="absolute -top-6 -left-6 text-3xl text-green-500/20 floating-leaf">🍃</div>
      <div className="absolute -top-4 -right-4 text-2xl text-blue-400/30 butterfly">🦋</div>
      <div className="absolute -bottom-8 left-1/3 text-xl text-brown-500/25 paw-print">🐾</div>
      
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
              A heartfelt story that will help find a loving home for this special animal
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-6">
          {/* Profile Content */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 soft-shadow hover-lift">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed font-medium">
                  {profile}
                </div>
              </div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 text-2xl opacity-20">💕</div>
              <div className="absolute bottom-4 left-4 text-xl opacity-20">🐾</div>
            </div>
          </div>
          
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOutput;
