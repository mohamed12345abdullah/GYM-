import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
        enum: ['user', 'trainer' , 'manager'],
        default: 'user',
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
    },
    height: {
        type: Number,
        required: [true, 'Height is required'],
    },
    subscription: {
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        price: {
            type: Number,
            default: 0,
        },
        // ما تم دفعه
        paied_amount: {
            type: Number,
        },
        //  المتبقى من المبلغ
        remaining_amount: {
            type: Number,
            default: 0,
        },
    }
    ,
    exercises: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise',
        }
    ]

});

const User = mongoose.model('User', userSchema);


export default User;