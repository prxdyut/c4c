import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { AnimalService } from '@/services/animalService';

interface AnalysisResult {
    animalType: string[];
    colors: string[];
    distinctiveFeatures: string[];
    condition: string;
    estimatedAge: string;
    size: string;
    breed: string[];
    gender: 'male' | 'female' | 'unknown';
    weight: string;
    coat: {
        type: string;
        length: string;
        texture: string;
    };
    physicalCharacteristics: {
        eyeColor: string;
        earType: string;
        tailType: string;
    };
    healthIndicators: {
        appearanceScore: number;
        visibleConditions: string[];
        generalHealth: string;
    };
    behavioralObservations: string[];
    specialNeeds: string[];
    confidence: number;
}

const AnalyzeImage = () => {
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<{ file: File; preview: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [creating, setCreating] = useState(false);

    const animalService = AnimalService.getInstance();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedImages(prev => [...prev, ...newFiles]);
            
            const newPreviews = newFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setImagePreviews(prev => [...prev, ...newPreviews]);
            setAnalysis(null); // Reset analysis when new images are selected
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            // Revoke the URL to prevent memory leaks
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedImages.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        setLoading(true);
        try {
            const response = await animalService.analyzeImages(selectedImages);
            // @ts-ignore
            setAnalysis(response.data.analyses);
            toast.success("Images analyzed successfully!");
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to analyze images. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProfile = async () => {
        if (!analysis || selectedImages.length === 0) {
            toast.error("Analysis and images are required");
            return;
        }

        setCreating(true);
        try {
            // Create FormData with images and analysis
            const formData = new FormData();
            selectedImages.forEach((image) => {
                formData.append('images', image);
            });

            // Add analysis data
            const profileData = {
                name: '', // Will be filled in the create form
                type: analysis.animalType[0] || 'Unknown',
                age: analysis.estimatedAge,
                gender: analysis.gender,
                healthNotes: `General Health: ${analysis.healthIndicators.generalHealth}\nVisible Conditions: ${analysis.healthIndicators.visibleConditions.join(', ')}\nSpecial Needs: ${analysis.specialNeeds.join(', ')}`,
                imageAnalysis: analysis
            };

            formData.append('data', JSON.stringify(profileData));

            const response = await animalService.createProfile(formData);
            
            if (response.data) {
                toast.success("Profile created successfully!");
                navigate('/create', { 
                    state: { 
                        profileId: response.data._id,
                        analysis: analysis,
                        images: imagePreviews.map(img => img.preview)
                    } 
                });
            }
        } catch (error) {
            console.error('Error creating profile:', error);
            toast.error("Failed to create profile. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    // Cleanup URLs when component unmounts
    React.useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Analyze Animal Images</h1>
            
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="image">Upload Animal Images</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="cursor-pointer"
                                multiple
                            />
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg shadow-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={selectedImages.length === 0 || loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze Images'
                            )}
                        </Button>
                    </form>

                    {analysis && (
                        <div className="mt-6">
                            <div className="border rounded-lg p-4">
                                <div className="space-y-4">
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Animal Type:</span>
                                        <span className="text-gray-600">{analysis.animalType.join(', ')}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Breed:</span>
                                        <span className="text-gray-600">{analysis.breed.join(', ')}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Colors:</span>
                                        <span className="text-gray-600">{analysis.colors.join(', ')}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Gender:</span>
                                        <span className="text-gray-600 capitalize">{analysis.gender}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Weight:</span>
                                        <span className="text-gray-600">{analysis.weight}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Coat:</span>
                                        <div className="pl-4">
                                            <p className="text-gray-600">Type: {analysis.coat.type}</p>
                                            <p className="text-gray-600">Length: {analysis.coat.length}</p>
                                            <p className="text-gray-600">Texture: {analysis.coat.texture}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Physical Characteristics:</span>
                                        <div className="pl-4">
                                            <p className="text-gray-600">Eye Color: {analysis.physicalCharacteristics.eyeColor}</p>
                                            <p className="text-gray-600">Ear Type: {analysis.physicalCharacteristics.earType}</p>
                                            <p className="text-gray-600">Tail Type: {analysis.physicalCharacteristics.tailType}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Distinctive Features:</span>
                                        <ul className="list-disc pl-5">
                                            {analysis.distinctiveFeatures.map((feature, index) => (
                                                <li key={index} className="text-gray-600">{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Health Indicators:</span>
                                        <div className="pl-4">
                                            <p className="text-gray-600">Appearance Score: {analysis.healthIndicators.appearanceScore}/10</p>
                                            <p className="text-gray-600">General Health: {analysis.healthIndicators.generalHealth}</p>
                                            <p className="text-gray-600">Visible Conditions:</p>
                                            <ul className="list-disc pl-5">
                                                {analysis.healthIndicators.visibleConditions.map((condition, index) => (
                                                    <li key={index} className="text-gray-600">{condition}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Condition:</span>
                                        <span className="text-gray-600">{analysis.condition}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Estimated Age:</span>
                                        <span className="text-gray-600">{analysis.estimatedAge}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Size:</span>
                                        <span className="text-gray-600">{analysis.size}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Behavioral Observations:</span>
                                        <ul className="list-disc pl-5">
                                            {analysis.behavioralObservations.map((observation, index) => (
                                                <li key={index} className="text-gray-600">{observation}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">Special Needs:</span>
                                        <ul className="list-disc pl-5">
                                            {analysis.specialNeeds.map((need, index) => (
                                                <li key={index} className="text-gray-600">{need}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">AI Confidence Score:</span>
                                        <span className="text-gray-600">{(analysis.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                                
                                <Button
                                    className="mt-6 w-full"
                                    variant="outline"
                                    onClick={handleCreateProfile}
                                    disabled={creating}
                                >
                                    {creating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Profile...
                                        </>
                                    ) : (
                                        'Create Profile with This Analysis'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyzeImage; 