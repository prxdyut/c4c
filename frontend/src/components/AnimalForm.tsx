
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Heart, Dog } from 'lucide-react';

interface AnimalFormProps {
  onGenerate: (data: AnimalData) => void;
  isLoading: boolean;
}

export interface AnimalData {
  name: string;
  type: string;
  age: string;
  gender: string;
  temperament: string;
  healthNotes: string;
  backstory: string;
  idealHome: string;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<AnimalData>({
    name: '',
    type: '',
    age: '',
    gender: '',
    temperament: '',
    healthNotes: '',
    backstory: '',
    idealHome: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleInputChange = (field: keyof AnimalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name && formData.type && formData.age && formData.temperament;

  return (
    <Card className="w-full max-w-2xl mx-auto soft-shadow border-cream-200 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Heart className="text-accent w-6 h-6" />
          Animal Details
        </CardTitle>
        <p className="text-muted-foreground">Fill in the details to create a compelling adoption profile</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                🐾 Animal Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter animal's name"
                className="border-cream-300 focus:border-accent focus:ring-accent/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium flex items-center gap-2">
                🐶 Animal Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="border-cream-300 focus:border-accent focus:ring-accent/20">
                  <SelectValue placeholder="Select animal type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-cream-300">
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="puppy">Puppy</SelectItem>
                  <SelectItem value="kitten">Kitten</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium flex items-center gap-2">
                📅 Age *
              </Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="e.g., 2 years, 6 months"
                className="border-cream-300 focus:border-accent focus:ring-accent/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium flex items-center gap-2">
                ⚧ Gender
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="border-cream-300 focus:border-accent focus:ring-accent/20">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-cream-300">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperament" className="text-sm font-medium flex items-center gap-2">
              ❤️ Temperament & Personality *
            </Label>
            <Input
              id="temperament"
              value={formData.temperament}
              onChange={(e) => handleInputChange('temperament', e.target.value)}
              placeholder="e.g., Friendly, playful, calm with children"
              className="border-cream-300 focus:border-accent focus:ring-accent/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthNotes" className="text-sm font-medium flex items-center gap-2">
              🏥 Health Notes
            </Label>
            <Textarea
              id="healthNotes"
              value={formData.healthNotes}
              onChange={(e) => handleInputChange('healthNotes', e.target.value)}
              placeholder="Any health conditions, vaccinations, special needs..."
              className="border-cream-300 focus:border-accent focus:ring-accent/20 min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backstory" className="text-sm font-medium flex items-center gap-2">
              📖 Rescue Story
            </Label>
            <Textarea
              id="backstory"
              value={formData.backstory}
              onChange={(e) => handleInputChange('backstory', e.target.value)}
              placeholder="Share their rescue story or background..."
              className="border-cream-300 focus:border-accent focus:ring-accent/20 min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idealHome" className="text-sm font-medium flex items-center gap-2">
              🏠 Ideal Home
            </Label>
            <Textarea
              id="idealHome"
              value={formData.idealHome}
              onChange={(e) => handleInputChange('idealHome', e.target.value)}
              placeholder="Describe the perfect home for this animal..."
              className="border-cream-300 focus:border-accent focus:ring-accent/20 min-h-[80px] resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Generating Profile...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Dog className="w-5 h-5" />
                Generate Adoption Profile
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnimalForm;
