import mongoose, { Document, Schema } from 'mongoose';

export interface IAnimal extends Document {
    name: string;
    type: string;
    age: string;
    gender: string;
    temperament?: string;
    healthNotes?: string;
    backstory?: string;
    idealHome?: string;
    images: string[];
    // Analysis fields
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
    generatedProfile: string;
}

const AnimalSchema = new Schema<IAnimal>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    temperament: String,
    healthNotes: String,
    backstory: String,
    idealHome: String,
    images: [String],
    // Analysis fields
    keywords: [String],
    features: [String],
    colors: [String],
    distinctiveFeatures: [String],
    breed: [String],
    coat: {
        type: { type: String },
        texture: String
    },
    physicalCharacteristics: {
        eyeColor: String,
        earType: String
    },
    healthIndicators: {
        appearanceScore: { type: Number, min: 1, max: 10 },
        visibleConditions: [String],
        generalHealth: String
    },
    generatedProfile: String,
}, {
    timestamps: true
});

export const Animal = mongoose.model<IAnimal>('Animal', AnimalSchema); 