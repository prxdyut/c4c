import { Request, Response } from "express";
import { Animal, IAnimal } from "../models/Animal";
import OpenAI from "openai";
import multer from "multer";
import path from "path";
import fs from "fs";
import logger from "../utils/logger";
import fetch from "node-fetch";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { ChatCompletionContentPart } from "openai/resources/chat/completions";
const dotenv = require("dotenv");

dotenv.config();

// Configure public directory for serving images
const PUBLIC_DIR = path.join(__dirname, '../../public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3005';

// Ensure directories exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    return cb(
      new Error("Only image files (jpeg, jpg, png, webp) are allowed!")
    );
  },
}).array("images", 10); // Allow up to 10 images with field name 'images'

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      refusal: null | string;
      annotations: any[];
    };
    logprobs: null;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const SimplifiedAnimalAnalysisSchema = z.object({
  keywords: z.array(z.string()),
  features: z.array(z.string()),
  colors: z.array(z.string()),
  distinctiveFeatures: z.array(z.string()),
  breed: z.array(z.string()),
  coat: z.object({
    type: z.string(),
    texture: z.string(),
  }),
  physicalCharacteristics: z.object({
    eyeColor: z.string(),
    earType: z.string(),
  }),
  healthIndicators: z.object({
    appearanceScore: z.number().min(1).max(10),
    visibleConditions: z.array(z.string()),
    generalHealth: z.string(),
  }),

});

export class AnimalController {
  private openai: OpenAI;
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || "";
    if (!this.openaiApiKey) {
      logger.error("OpenAI API key is not configured");
    }
    this.openai = new OpenAI({
      apiKey: this.openaiApiKey,
    });
    logger.info("AnimalController initialized with OpenAI configuration");
  }

  // Helper method to generate public URLs for images
  private generateImageUrls(imagePaths: string[]): string[] {
    return imagePaths.map(imagePath => {
      const relativePath = path.relative(PUBLIC_DIR, imagePath);
      return `${BASE_URL}/${relativePath.replace(/\\/g, '/')}`;
    });
  }

  private async analyzeLocalImages(imagePaths: string[], prompt: string) {
    try {
      const images = imagePaths.map((path) => {
        const image = fs.readFileSync(path);
        return Buffer.from(image).toString("base64");
      });

      logger.debug("Sending request to OpenAI Vision API", {
        imageCount: images.length,
        apiKey: this.openaiApiKey ? "Present" : "Missing",
      });

      const imageMessages = images.map(
        (image) =>
          ({
            type: "image_url",
            image_url: {
              url: `data:image/${path
                .extname(image)
                .substring(1)};base64,${image}`,
            },
          } as ChatCompletionContentPart)
      );

      const response = await this.openai.chat.completions.parse({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at analyzing animal photos. Extract keywords and distinctive features about the animal in json format: {keywords: string[], features: string[]}.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this animal photo and provide:\n1. Keywords that describe the animal (breed, color, size, etc)\n2. Distinctive features or characteristics",
              },
              ...imageMessages,
            ],
          },
        ],
        response_format: zodResponseFormat(
          SimplifiedAnimalAnalysisSchema,
          "analysis"
        ),
        max_tokens: 300,
      });

      const analysis = response.choices[0].message.parsed;
      logger.debug("Received analysis:", { analysis });
      return analysis;
    } catch (error) {
      console.log(error);
      logger.error("Error in analyzeLocalImage:", {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
              }
            : "Unknown error",
        imagePaths,
        apiKeyPresent: !!this.openaiApiKey,
      });
      throw error;
    }
  }

  async create(req: Request, res: Response) {
    try {
      logger.info("Creating new animal profile");

      // Handle file uploads if present
      const files = req.files as Express.Multer.File[];
      let imagePaths: string[] = [];
      let imageUrls: string[] = [];

      if (files && Array.isArray(files)) {
        imagePaths = files.map((file) => file.path);
        imageUrls = this.generateImageUrls(imagePaths);
        logger.info(`Processed ${imagePaths.length} image files`);
      }

      // Parse the profile data from the form
      const profileData = JSON.parse(req.body.data);

      // Create new animal document with image URLs
      const newAnimal = new Animal({
        ...profileData,
        images: imageUrls,
      });

      const result = await newAnimal.save();

      logger.info(`Animal profile created successfully with ID: ${result._id}`);
      res.status(201).json({
        message: "Animal profile created successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error creating animal profile:", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      res.status(500).json({
        error: "Failed to create animal profile",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async generateProfile(req: Request, res: Response) {
    try {
      logger.info("Generating animal profile");

      // Handle file uploads if present
      const files = req.files as Express.Multer.File[];
      let imagePaths: string[] = [];
      let imageUrls: string[] = [];

      if (files && Array.isArray(files)) {
        imagePaths = files.map((file) => file.path);
        imageUrls = this.generateImageUrls(imagePaths);
        logger.info(`Processed ${imagePaths.length} image files`);
      }

      // Parse the JSON data from the form-data
      let animalData;
      try {
        animalData = JSON.parse(req.body.data);
      } catch (error) {
        logger.error("Error parsing JSON data:", error);
        return res.status(400).json({
          error: "Invalid JSON data",
          details: "The data field must contain valid JSON"
        });
      }

      const {
        name,
        type,
        age,
        gender,
        temperament,
        healthNotes,
        backstory,
        idealHome,
        keywords,
        features,
        colors,
        distinctiveFeatures,
        breed,
        coat,
        physicalCharacteristics,
        healthIndicators
      } = animalData;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at writing compelling and emotional pet adoption profiles. Write a profile that will help this pet find their forever home.",
          },
          {
            role: "user",
            content: `Create an adoption profile with these details:
                        Name: ${name}
                        Type: ${type}
                        Age: ${age}
                        ${gender ? `Gender: ${gender}` : ""}
                        ${temperament ? `Temperament: ${temperament}` : ""}
                        ${healthNotes ? `Health Information: ${healthNotes}` : ""}
                        ${backstory ? `Background Story: ${backstory}` : ""}
                        ${idealHome ? `Ideal Home: ${idealHome}` : ""}
                        
                        Additional Details:
                        Colors: ${colors ? colors.join(", ") : ""}
                        Breed: ${breed ? breed.join(", ") : ""}
                        Distinctive Features: ${distinctiveFeatures ? distinctiveFeatures.join(", ") : ""}
                        Coat: ${coat ? `${coat.type} - ${coat.texture}` : ""}
                        Physical Characteristics: ${physicalCharacteristics ? 
                          `Eye Color: ${physicalCharacteristics.eyeColor}, Ear Type: ${physicalCharacteristics.earType}` : ""}
                        Health: ${healthIndicators ? 
                          `General Health: ${healthIndicators.generalHealth}, 
                           Appearance Score: ${healthIndicators.appearanceScore}/10, 
                           Conditions: ${healthIndicators.visibleConditions.join(", ")}` : ""}

                        Make it emotional and engaging, highlighting the pet's unique personality and needs.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      });

      const generatedProfile = completion.choices[0].message.content;
      logger.info(`Profile generated successfully for ${name}`);

      // Create or update the animal profile in the database with images
      const animalDataToSave = {
        ...animalData,
        images: imageUrls, // Save the public URLs instead of file paths
        generatedProfile // Save the generated profile in the database
      };

      // Create new animal document
      const animal = new Animal(animalDataToSave);
      const savedAnimal = await animal.save();

      res.json({
        message: "Profile generated and saved successfully",
        data: {
          animal: savedAnimal,
          generatedProfile
        },
      });
    } catch (error) {
      logger.error("Error generating profile:", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      res.status(500).json({
        error: "Failed to generate profile",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      logger.info("Retrieving all animals");
      const animals = await Animal.find();
      logger.info(`Retrieved ${animals.length} animals`);

      res.json({
        message: "Animals retrieved successfully",
        data: animals,
      });
    } catch (error) {
      logger.error("Error retrieving animals:", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      res.status(500).json({
        error: "Failed to retrieve animals",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      logger.info(`Retrieving animal with ID: ${id}`);

      const animal = await Animal.findById(id);

      if (!animal) {
        logger.warn(`Animal not found with ID: ${id}`);
        return res.status(404).json({ error: "Animal not found" });
      }

      logger.info(`Successfully retrieved animal: ${animal.name}`);
      res.json({
        message: "Animal retrieved successfully",
        data: animal,
      });
    } catch (error) {
      logger.error("Error retrieving animal:", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      res.status(500).json({
        error: "Failed to retrieve animal",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async analyzeImage(req: Request, res: Response) {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        logger.warn("No image files uploaded in request");
        return res.status(400).json({
          error: "No image files uploaded",
          message: "Please select at least one image to analyze",
        });
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const files = req.files as Express.Multer.File[];

      // Validate all files
      const invalidFile = files.find(
        (file) => !allowedTypes.includes(file.mimetype)
      );
      if (invalidFile) {
        logger.warn(`Invalid file type: ${invalidFile.mimetype}`);
        return res.status(400).json({
          error: "Invalid file type",
          message: "Only JPEG, PNG, and WebP images are supported",
        });
      }

      const analysis = await this.analyzeLocalImages(
        files.map((file) => file.path),
        ""
      );

      res.status(200).json({
        message: "Images analyzed successfully",
        data: analysis,
      });
    } catch (error) {
      logger.error("Error analyzing images:", {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
              }
            : "Unknown error",
      });
      res.status(500).json({
        error: "Failed to analyze images",
        message: "An unexpected error occurred while processing your request",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
