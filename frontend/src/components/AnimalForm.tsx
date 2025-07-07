
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Heart, Dog, Sparkles, Leaf } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    <div data-section="form" className="w-full">
      <Card className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full border border-gray-200">
              <Heart className="text-red-500 w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            Create Your Adoption Profile
          </CardTitle>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Fill in the details below to generate a heartfelt adoption profile that will help find a loving home
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium text-gray-700">
                  Animal Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter animal's name"
                  className="bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-base font-medium text-gray-700">
                  Animal Type *
                </Label>
                <AutocompleteAnimalType
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-base font-medium text-gray-700">
                  Age *
                </Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="e.g., 2 years, 6 months"
                  className="bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-base font-medium text-gray-700">
                  Gender
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring-blue-100 transition-all duration-200">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperament" className="text-base font-medium text-gray-700">
                Temperament & Personality *
              </Label>
              <Input
                id="temperament"
                value={formData.temperament}
                onChange={(e) => handleInputChange('temperament', e.target.value)}
                placeholder="e.g., Friendly, playful, calm with children"
                className="bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="healthNotes" className="text-base font-medium text-gray-700">
                Health Notes
              </Label>
              <Textarea
                id="healthNotes"
                value={formData.healthNotes}
                onChange={(e) => handleInputChange('healthNotes', e.target.value)}
                placeholder="Any health conditions, vaccinations, special needs..."
                className="bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring-blue-100 transition-all duration-200 min-h-[100px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backstory" className="text-base font-medium text-gray-700">
                Rescue Story
              </Label>
              <Textarea
                id="backstory"
                value={formData.backstory}
                onChange={(e) => handleInputChange('backstory', e.target.value)}
                placeholder="Share their rescue story or background..."
                className="bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring-blue-100 transition-all duration-200 min-h-[120px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idealHome" className="text-base font-medium text-gray-700">
                Ideal Home
              </Label>
              <Textarea
                id="idealHome"
                value={formData.idealHome}
                onChange={(e) => handleInputChange('idealHome', e.target.value)}
                placeholder="Describe the perfect home for this animal..."
                className="bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring-blue-100 transition-all duration-200 min-h-[100px] resize-none"
              />
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Your Profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Dog className="w-6 h-6" />
                    <span>Generate Adoption Profile</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalForm;

const ANIMAL_TYPES = ["Dog", "Cat", "Puppy", "Kitten"];

function AutocompleteAnimalType({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState(value);
  const filtered = ANIMAL_TYPES.filter(type => type.toLowerCase().includes(input.toLowerCase()));

  React.useEffect(() => { setInput(value); }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setOpen(true);
            onChange(e.target.value);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Type or select animal type"
          className="bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring-blue-100 transition-all duration-200"
          autoComplete="off"
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-full min-w-[180px]">
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <div className="p-2 text-gray-400 text-sm">No matches</div>
          )}
          {filtered.map(type => (
            <button
              type="button"
              key={type}
              className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 text-base ${type === value ? 'bg-blue-100 font-semibold' : ''}`}
              onClick={() => {
                onChange(type);
                setInput(type);
                setOpen(false);
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
