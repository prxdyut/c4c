import { Request, Response } from 'express';
import { Animal, IAnimal } from '../models/Animal';
import OpenAI from 'openai';
const dotenv = require('dotenv');

dotenv.config();

export class AnimalController {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async create(req: Request, res: Response) {
        try {
            const newAnimal = new Animal(req.body);
            const result = await newAnimal.save();
            
            res.status(201).json({
                message: 'Animal profile created successfully',
                data: result
            });
        } catch (error) {
            console.error('Error creating animal profile:', error);
            res.status(500).json({ 
                error: 'Failed to create animal profile',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async generateProfile(req: Request, res: Response) {
        try {
            const { name, type, age, gender, temperament, healthNotes, backstory, idealHome } = req.body;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert at writing compelling and emotional pet adoption profiles. Write a profile that will help this pet find their forever home."
                    },
                    {
                        role: "user",
                        content: `Create an adoption profile with these details:
                        Name: ${name}
                        Type: ${type}
                        Age: ${age}
                        ${gender ? `Gender: ${gender}` : ''}
                        ${temperament ? `Temperament: ${temperament}` : ''}
                        ${healthNotes ? `Health Information: ${healthNotes}` : ''}
                        ${backstory ? `Background Story: ${backstory}` : ''}
                        ${idealHome ? `Ideal Home: ${idealHome}` : ''}

                        Make it emotional and engaging, highlighting the pet's unique personality and needs.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 500,
                top_p: 0.9
            });

            const generatedProfile = completion.choices[0].message.content;

            res.json({
                message: 'Profile generated successfully',
                data: {
                    originalData: req.body,
                    generatedProfile
                }
            });

        } catch (error) {
            console.error('Error generating profile:', error);
            res.status(500).json({ 
                error: 'Failed to generate profile',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const animals = await Animal.find();
            res.json({
                message: 'Animals retrieved successfully',
                data: animals
            });
        } catch (error) {
            console.error('Error retrieving animals:', error);
            res.status(500).json({ 
                error: 'Failed to retrieve animals',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const animal = await Animal.findById(id);
            
            if (!animal) {
                return res.status(404).json({ error: 'Animal not found' });
            }

            res.json({
                message: 'Animal retrieved successfully',
                data: animal
            });
        } catch (error) {
            console.error('Error retrieving animal:', error);
            res.status(500).json({ 
                error: 'Failed to retrieve animal',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
} 