import { Router } from 'express';
import { AnimalController } from '../controllers/AnimalController';

const router = Router();
const animalController = new AnimalController();

// Create a new animal profile
router.post('/', animalController.create.bind(animalController));

// Generate an adoption profile using HuggingFace
router.post('/generate-profile', animalController.generateProfile.bind(animalController));

// Get all animals
router.get('/', animalController.getAll.bind(animalController));

// Get one animal by ID
router.get('/:id', animalController.getOne.bind(animalController));

export default router; 