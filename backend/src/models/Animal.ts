import mongoose, { Document, Schema } from 'mongoose';

export interface IAnimal extends Document {
    name: string;
    type: string;
    age: string;
    gender?: string;
    temperament?: string;
    healthNotes?: string;
    backstory?: string;
    idealHome?: string;
    createdAt: Date;
}

const AnimalSchema = new Schema<IAnimal>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String },
    temperament: { type: String },
    healthNotes: { type: String },
    backstory: { type: String },
    idealHome: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const Animal = mongoose.model<IAnimal>('Animal', AnimalSchema); 