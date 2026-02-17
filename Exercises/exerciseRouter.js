import express from 'express';
import {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
  getExercisesByMuscle
} from './exerciseController.js';

const router = express.Router();

// CRUD routes for exercises
router.post('/', createExercise);
router.get('/', getAllExercises);
router.get('/muscle/:muscle', getExercisesByMuscle);
router.get('/:id', getExerciseById);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

export default router;