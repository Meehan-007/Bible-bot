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
    },
    fullMessage: {
        type: String,
        required: false,
        trim: true,
    }
}, {
    timestamps: true

});



const User = model('User', userSchema);

userSchema.post('save', function(error: any, doc: any, next: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Phone number already exists'));
    } else {
        next(error);
    }
});

export { User }