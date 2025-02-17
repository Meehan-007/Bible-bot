<<<<<<< HEAD
const { Schema, model, } = require('mongoose');

=======
import mongoose from 'mongoose'
const { Schema, model } = mongoose
>>>>>>> signin


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

<<<<<<< HEAD
module.exports = User;
=======
export { User }
>>>>>>> signin
