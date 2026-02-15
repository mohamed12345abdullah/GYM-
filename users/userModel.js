import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
    },
    role: {
        type: String,
        default: 'user',
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
    },
});

const User = mongoose.model('User', userSchema);

export default User;