

import mongoose from 'mongoose';


const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sets: {
        type: Number,
        required: true,
    },
    repetitions: {
        type: Number,
        required: true,
    },
    images:     [{
        type: String
    }],
    muscles:    {
        type: [String],
        enum: ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'],
    },


});



export default mongoose.model('Exercise', exerciseSchema);
