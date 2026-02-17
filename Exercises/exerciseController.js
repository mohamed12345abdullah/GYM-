
import asyncHandler from '../utils/asyncHandler.js';
import Exercise from './exerciseModel.js';

// Create new exercise
const createExercise = asyncHandler(async (req, res) => {
    const { name, description, sets, repetitions, images, muscles } = req.body;
        
    // Validate required fields
    if (!name || !description || !sets || !repetitions || !muscles) {
        return res.status(400).json({
            success: false,
            message: 'Name, description, sets, repetitions, and muscles are required fields'
        });
    }
    
    const exercise = await Exercise.create({    
        name,
        description,
        sets,
        repetitions,
        images: images || [],
        muscles
    });
    
    res.status(201).json({
        success: true,
        message: 'Exercise created successfully',
        exercise
    });
});

// Get all exercises
const getAllExercises = asyncHandler(async (req, res) => {
    const exercises = await Exercise.find();
    
    res.status(200).json({
        success: true,
        message: 'Exercises retrieved successfully',
        exercises,
        count: exercises.length
    });
});

// Get exercise by ID
const getExerciseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const exercise = await Exercise.findById(id);
    
    if (!exercise) {
        return res.status(404).json({
            success: false,
            message: 'Exercise not found'
        });
    }
    
    res.status(200).json({
        success: true,
        message: 'Exercise retrieved successfully',
        exercise
    });
});

// Update exercise
const updateExercise = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, sets, repetitions, images, muscles } = req.body;
    
    const exercise = await Exercise.findById(id);
    
    if (!exercise) {
        return res.status(404).json({
            success: false,
            message: 'Exercise not found'
        });
    }
    
    // Update fields if provided
    if (name !== undefined) exercise.name = name;
    if (description !== undefined) exercise.description = description;
    if (sets !== undefined) exercise.sets = sets;
    if (repetitions !== undefined) exercise.repetitions = repetitions;
    if (images !== undefined) exercise.images = images;
    if (muscles !== undefined) exercise.muscles = muscles;
    
    const updatedExercise = await exercise.save();
    
    res.status(200).json({
        success: true,
        message: 'Exercise updated successfully',
        exercise: updatedExercise
    });
});

// Delete exercise
const deleteExercise = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const exercise = await Exercise.findById(id);
    
    if (!exercise) {
        return res.status(404).json({
            success: false,
            message: 'Exercise not found'
        });
    }
    
    await Exercise.findByIdAndDelete(id);
    
    res.status(200).json({
        success: true,
        message: 'Exercise deleted successfully'
    });
});

// Get exercises by muscle group
const getExercisesByMuscle = asyncHandler(async (req, res) => {
    const { muscle } = req.params;
    
    const validMuscles = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];
    
    if (!validMuscles.includes(muscle)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid muscle group. Valid options: Chest, Back, Legs, Arms, Shoulders, Core'
        });
    }
    
    const exercises = await Exercise.find({ muscle: muscle });  
    
    res.status(200).json({
        success: true,
        message: `Exercises for ${muscle} retrieved successfully`,
        exercises,
        count: exercises.length
    });
});

export {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
    getExercisesByMuscle
};




