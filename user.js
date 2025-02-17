import mongoose from 'mongoose'
const { Schema, model } = mongoose


const userSchema = new Schema({

    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    }
});

const User = model('User', userSchema);

export { User }
