import express from 'express';
import { AnimalController, upload } from '../controllers/AnimalController';

const router = express.Router();
const animalController = new AnimalController();

// Create a new animal profile
router.post('/', upload, animalController.create.bind(animalController));

// Generate profile text
router.post('/generate-profile', upload, animalController.generateProfile.bind(animalController));

// Analyze image and extract details
router.post('/analyze-image', upload, animalController.analyzeImage.bind(animalController));

// Get all animals
router.get('/', animalController.getAll.bind(animalController));

// Get one animal by ID
router.get('/:id', animalController.getOne.bind(animalController));

export default router; 