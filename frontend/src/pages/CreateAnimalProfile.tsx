import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, X, Plus, Minus, ExternalLink } from "lucide-react";
import { AnimalService } from '@/services/animalService';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ProfileOutput from '@/components/ProfileOutput';

interface AnalysisResult {
    keywords: string[];
    features: string[];
    colors: string[];
    distinctiveFeatures: string[];
    breed: string[];
    coat: {
        type: string;
        texture: string;
    };
    physicalCharacteristics: {
        eyeColor: string;
        earType: string;
    };
    healthIndicators: {
        appearanceScore: number;
        visibleConditions: string[];
        generalHealth: string;
    };
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string().min(1, "Type is required"),
    age: z.string().min(1, "Age is required"),
    gender: z.string().min(1, "Gender is required"),
    temperament: z.string().optional(),
    healthNotes: z.string().optional(),
    backstory: z.string().optional(),
    idealHome: z.string().optional(),
    distinctiveFeatures: z.array(z.string()),
    specialNeeds: z.array(z.string()),
    // Analysis fields
    keywords: z.array(z.string()),
    features: z.array(z.string()),
    colors: z.array(z.string()),
    breed: z.array(z.string()),
    coat: z.object({
        type: z.string(),
        texture: z.string()
    }),
    physicalCharacteristics: z.object({
        eyeColor: z.string(),
        earType: z.string()
    }),
    healthIndicators: z.object({
        appearanceScore: z.number(),
        visibleConditions: z.array(z.string()),
        generalHealth: z.string()
    })
});

type FormData = z.infer<typeof formSchema>;

const CreateAnimalProfile = () => {
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<{ file: File; preview: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [generatedProfile, setGeneratedProfile] = useState<string>('');
    const [distinctiveFeatures, setDistinctiveFeatures] = useState<string[]>(['']);
    const [specialNeeds, setSpecialNeeds] = useState<string[]>(['']);
    const [savedImages, setSavedImages] = useState<string[]>([]);
    const [profileCreated, setProfileCreated] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "",
            age: "",
            gender: "",
            temperament: "",
            healthNotes: "",
            backstory: "",
            idealHome: "",
            distinctiveFeatures: [""],
            specialNeeds: [""],
            keywords: [""],
            features: [""],
            colors: [""],
            breed: [""],
            coat: {
                type: "",
                texture: ""
            },
            physicalCharacteristics: {
                eyeColor: "",
                earType: ""
            },
            healthIndicators: {
                appearanceScore: 1,
                visibleConditions: [""],
                generalHealth: ""
            }
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedImages(prev => [...prev, ...newFiles]);
            
            const newPreviews = newFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setImagePreviews(prev => [...prev, ...newPreviews]);
            setAnalysis(null);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleArrayInputChange = (
        index: number,
        value: string,
        array: string[],
        setArray: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const newArray = [...array];
        newArray[index] = value;
        setArray(newArray);
        form.setValue('distinctiveFeatures', newArray);
    };

    const addArrayInput = (
        array: string[],
        setArray: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setArray([...array, '']);
    };

    const removeArrayInput = (
        index: number,
        array: string[],
        setArray: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (array.length > 1) {
            const newArray = array.filter((_, i) => i !== index);
            setArray(newArray);
            form.setValue('distinctiveFeatures', newArray);
        }
    };

    const analyzeImages = async () => {
        if (selectedImages.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        setLoading(true);
        try {
            const animalService = AnimalService.getInstance();
            const response = await animalService.analyzeImages(selectedImages);
            console.log(response);
            setAnalysis(response.data);
            
            // Pre-fill form with analysis data
            if (response.data) {
                const analysisData = response.data;
                form.setValue('keywords', analysisData.keywords);
                form.setValue('features', analysisData.features);
                form.setValue('colors', analysisData.colors);
                form.setValue('distinctiveFeatures', analysisData.distinctiveFeatures);
                form.setValue('breed', analysisData.breed);
                form.setValue('coat', analysisData.coat);
                form.setValue('physicalCharacteristics', analysisData.physicalCharacteristics);
                form.setValue('healthIndicators', analysisData.healthIndicators);
            }
            
            toast.success("Images analyzed successfully!");
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to analyze images. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        if (selectedImages.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            selectedImages.forEach((image) => {
                formData.append('images', image);
            });

            const profileData = {
                ...data,
                imageAnalysis: analysis
            };

            formData.append('data', JSON.stringify(profileData));

            const animalService = AnimalService.getInstance();
            const response = await animalService.createProfile(formData);
            console.log(response);
            if (response.data) {
                toast.success("Profile created successfully!");
                setGeneratedProfile(response.data.generatedProfile);
                setProfileCreated(true);
                // @ts-ignore
                setUploadedImages(response.data.animal.images || []);
                
                setTimeout(() => {
                    const outputElement = document.getElementById('profile-output');
                    if (outputElement) {
                        outputElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error creating profile:', error);
            toast.error("Failed to create profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Create Animal Profile</h1>
            
            <Card className="max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Image Upload Section */}
                            {!profileCreated && (
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
                            )}

                            {/* Preview Images (during upload) */}
                            {!profileCreated && imagePreviews.length > 0 && (
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

                            {/* Saved Images (after profile creation) */}
                            {profileCreated && savedImages.length > 0 && (
                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold mb-4">Saved Images</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {savedImages.map((imageUrl, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Saved ${index + 1}`}
                                                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                                                />
                                                <a
                                                    href={imageUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!profileCreated && (
                                <Button
                                    type="button"
                                    onClick={analyzeImages}
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
                            )}

                            {/* Form Fields */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pet's name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Dog, Cat, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="age"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Age</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Age" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Gender" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="temperament"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Temperament</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Temperament" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="healthNotes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Health Notes</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Health Notes" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Distinctive Features Array Input */}
                            <div className="space-y-2">
                                <Label>Distinctive Features</Label>
                                {distinctiveFeatures.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={feature}
                                            onChange={(e) => handleArrayInputChange(
                                                index,
                                                e.target.value,
                                                distinctiveFeatures,
                                                setDistinctiveFeatures
                                            )}
                                            placeholder="Feature"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeArrayInput(
                                                index,
                                                distinctiveFeatures,
                                                setDistinctiveFeatures
                                            )}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        {index === distinctiveFeatures.length - 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => addArrayInput(
                                                    distinctiveFeatures,
                                                    setDistinctiveFeatures
                                                )}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Special Needs Array Input */}
                            <div className="space-y-2">
                                <Label>Special Needs</Label>
                                {specialNeeds.map((need, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={need}
                                            onChange={(e) => handleArrayInputChange(
                                                index,
                                                e.target.value,
                                                specialNeeds,
                                                setSpecialNeeds
                                            )}
                                            placeholder="Special Need"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeArrayInput(
                                                index,
                                                specialNeeds,
                                                setSpecialNeeds
                                            )}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        {index === specialNeeds.length - 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => addArrayInput(
                                                    specialNeeds,
                                                    setSpecialNeeds
                                                )}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <FormField
                                control={form.control}
                                name="backstory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Backstory</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Backstory" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="idealHome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ideal Home</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ideal Home" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Add these form fields after the existing form fields */}
                            <div className="space-y-6">
                                {/* Keywords Array Input */}
                                <div className="space-y-2">
                                    <Label>Keywords</Label>
                                    <FormField
                                        control={form.control}
                                        name="keywords"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} placeholder="Keywords (comma-separated)" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Features Array Input */}
                                <div className="space-y-2">
                                    <Label>Features</Label>
                                    <FormField
                                        control={form.control}
                                        name="features"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} placeholder="Features (comma-separated)" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Colors Array Input */}
                                <div className="space-y-2">
                                    <Label>Colors</Label>
                                    <FormField
                                        control={form.control}
                                        name="colors"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} placeholder="Colors (comma-separated)" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Breed Array Input */}
                                <div className="space-y-2">
                                    <Label>Breed</Label>
                                    <FormField
                                        control={form.control}
                                        name="breed"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} placeholder="Breed (comma-separated)" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Coat Information */}
                                <div className="space-y-2">
                                    <Label>Coat Information</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="coat.type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Coat Type" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="coat.texture"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Coat Texture" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Physical Characteristics */}
                                <div className="space-y-2">
                                    <Label>Physical Characteristics</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="physicalCharacteristics.eyeColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Eye Color" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="physicalCharacteristics.earType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Ear Type" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Health Indicators */}
                                <div className="space-y-2">
                                    <Label>Health Indicators</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="healthIndicators.appearanceScore"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="number" min="1" max="10" {...field} placeholder="Appearance Score (1-10)" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="healthIndicators.generalHealth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} placeholder="General Health" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="healthIndicators.visibleConditions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} placeholder="Visible Conditions (comma-separated)" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {!profileCreated && (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Profile...
                                        </>
                                    ) : (
                                        'Create Profile'
                                    )}
                                </Button>
                            )}
                        </form>
                    </Form>

                    {/* Generated Profile Output */}
                    {generatedProfile && (
                        <div id="profile-output" className="mt-8">
                            <ProfileOutput profile={generatedProfile} images={uploadedImages} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateAnimalProfile; 