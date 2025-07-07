
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, Heart } from 'lucide-react';
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

  return (
    <Card className="w-full max-w-2xl mx-auto soft-shadow border-warmBlue-200 bg-warmBlue-50/50 backdrop-blur-sm animate-fade-in">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Heart className="text-red-500 w-6 h-6" />
          Adoption Profile Generated
        </CardTitle>
        <p className="text-muted-foreground">Your compelling adoption story is ready!</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-background/80 rounded-xl p-6 border border-warmBlue-200">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {profile}
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleCopy}
          className="w-full bg-warmBlue-500 hover:bg-warmBlue-600 text-white font-medium py-3 rounded-xl transition-all duration-200"
        >
          {copied ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Copied to Clipboard!
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Copy Profile Text
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileOutput;
