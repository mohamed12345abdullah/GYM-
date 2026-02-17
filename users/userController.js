import { log } from 'node:console';
import asyncHandler from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';

import User from './userModel.js';

 
 
const validateUser=(user)=>{
    
    //validate request body
    if (!user.name || !user.password || !user.age || !user.gender || !user.phone || !user.weight || !user.height || !user.price || !user.paied_amount || !user.remaining_amount || !user.startDate || !user.endDate) {
        return {
            success: false,
            message: 'All fields are required',
        };
     }
        

    //validate password
    if( user.password.length < 6 ){
        return {
            success: false,
            message: 'Password must be at least 6 characters',
        };
    }

    return {
        success: true,
        message: 'User is valid',
    };

}

const createUser = asyncHandler(async (req, res) => {
    const { name, password, age, gender, phone, weight, height ,price, paied_amount, remaining_amount,startDate,endDate } = req.body;


    const validationResult = validateUser({ name, password, age, gender, phone ,weight,height,price,paied_amount,remaining_amount,startDate,endDate});
    if (!validationResult.success) {
        throw new Error(validationResult.message);
        return;
    }
 

    log('User is valid');
    const hashedPassword = await bcrypt.hashSync(password, Number(process.env.saltRounds));
    const user = await User.create({
        name,
        password: hashedPassword,
        age,
        gender,
        phone,
        role: 'user',
        weight: weight,
        height: height,
        subscription: {
            price,
            paied_amount,
            remaining_amount,
            startDate,
            endDate,
        },
    });
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        user,
    });
});




const editUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
        return ;
    }
    const { name, email, age, gender, phone, weight, height,price, paied_amount, remaining_amount,startDate,endDate } = req.body;

    const validationResult = validateUser({ name, email, password:1234567, age, gender, phone,weight,height,price,paied_amount,remaining_amount,startDate,endDate });   
    if (!validationResult.success) {
        throw new Error(validationResult.message);
        return;
    }



    //update user
    existingUser.name = name;
    existingUser.email = email;
    existingUser.age = age;
    existingUser.gender = gender;
    existingUser.weight = weight;
    existingUser.height = height;
    existingUser.price = price;
    existingUser.paied_amount = paied_amount;
    existingUser.remaining_amount = remaining_amount;
    existingUser.startDate = startDate;
    existingUser.endDate = endDate;
    existingUser.phone = phone;
    await existingUser.save();  
    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: existingUser,
    });
});




const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
        return ;
    }
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        user,
    });
});



const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        users,
    });
});



const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
        return ;
    }
    res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        user,
    });
});



const changePassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
        return ;
    }
    const { password } = req.body;
    if (!password) {
        throw new Error('Password is required');
        return;
    }

    const hashedPassword = await bcrypt.hashSync(password, Number(process.env.saltRounds));
    existingUser.password = hashedPassword;
    await existingUser.save();
    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        user: existingUser,
    });
})



// Add exercise to user
const addExerciseToUser = asyncHandler(async (req, res) => {
    const { userId, exerciseId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    // Check if exercise exists
    const Exercise = (await import('./../Exercises/exerciseModel.js')).default;
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
        throw new Error('Exercise not found');
    }
    
    // Check if exercise already assigned to user
    if (user.exercises.includes(exerciseId)) {
        throw new Error('Exercise already assigned to user');
    }
    
    // Add exercise to user
    user.exercises.push(exerciseId);
    await user.save();
    
    // Populate exercises for response
    await user.populate('exercises');
    
    res.status(200).json({
        success: true,
        message: 'Exercise added to user successfully',
        user
    });
});

// Remove exercise from user
const removeExerciseFromUser = asyncHandler(async (req, res) => {
    const { userId, exerciseId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    // Check if exercise exists in user's exercises
    if (!user.exercises.includes(exerciseId)) {
        throw new Error('Exercise not assigned to this user');
    }
    
    // Remove exercise from user
    user.exercises = user.exercises.filter(id => id.toString() !== exerciseId);
    await user.save();
    
    // Populate remaining exercises for response
    await user.populate('exercises');
    
    res.status(200).json({
        success: true,
        message: 'Exercise removed from user successfully',
        user
    });
});

// Get all exercises for a user
const getUserExercises = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate('exercises');
    if (!user) {
        throw new Error('User not found');
    }
    
    res.status(200).json({
        success: true,
        message: 'User exercises retrieved successfully',
        exercises: user.exercises,
        count: user.exercises.length
    });
});

// Bulk assign exercises to user
const assignExercisesToUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { exerciseIds } = req.body;
    
    if (!exerciseIds || !Array.isArray(exerciseIds)) {
        throw new Error('Exercise IDs array is required');
    }
    
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    // Check if exercises exist
    const Exercise = (await import('./../Exercises/exerciseModel.js')).default;
    const exercises = await Exercise.find({ _id: { $in: exerciseIds } });
    if (exercises.length !== exerciseIds.length) {
        throw new Error('One or more exercises not found');
    }
    
    // Add only new exercises (avoid duplicates)
    const newExercises = exerciseIds.filter(id => 
        !user.exercises.includes(id)
    );
    
    user.exercises.push(...newExercises);
    await user.save();
    
    // Populate exercises for response
    await user.populate('exercises');
    
    res.status(200).json({
        success: true,
        message: `Added ${newExercises.length} exercises to user`,
        user
    });
});

export  {
    createUser,
    editUser,
    deleteUser,
    getAllUsers,
    getUserById,
    changePassword,
    addExerciseToUser,
    removeExerciseFromUser,
    getUserExercises,
    assignExercisesToUser,
}
