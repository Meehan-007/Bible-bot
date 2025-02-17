import express from 'express'; // ES module import
import twilio from 'twilio';   // ES module import (if available, otherwise use CommonJS)
import path from 'path';     // ES module import
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
import cron from 'cron';
import {User} from './user.js'



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});

let cronScheduleExpression = '0 13 * * 0-6'; // 7 AM every day
let CronJob = cron.CronJob;
console.log('Cron Job is --- starting');
let job = new CronJob(cronScheduleExpression, async function () {
    console.log('Cron Job starting');

    try {
        const users = await User.find({}); // Get all users from the database
               console.log('Users:', users);
        const messagePromises = users.map(async (user) => {
            const recipient = user.phone;
            const url = user.url;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                const textmessage = data.random_verse.text;
                const verse = data.random_verse.verse;
                const chapter = data.random_verse.chapter;
                const book = data.random_verse.book;
                const fullMessage = `${textmessage} ${book} ${chapter}:${verse}`;

                console.log('Sending message to', recipient); // Log recipient
                 console.log('Message:', fullMessage); // Log message
                const message = await client.messages.create({
                    body: fullMessage,
                    from: '+18667943172',
                    to: recipient
                });

                console.log('Message sent successfully to', recipient, message.sid);

            } catch (innerError) {
                console.error(`Error sending message to ${recipient}:`, innerError);
                // Handle error for individual users here.  You might want to log it or store it in the database.
            }
        })
        const results = await Promise.all(messagePromises);
        console.log("Message sending results:", results);
    } catch (error) {
        console.error("Error in cron job:", error);
    }
}, null, true); // Start the cron job immediately


// HTTP POST route for signup (separate from cron job)
app.post('/signup', async (req, res) => {
    try {
        console.log('Signup request:', req.body);
        const recipient = req.body.phone;
        const url = req.body.url;
console.log('Recipient:', recipient);
console.log('URL:', url);
        if (!recipient) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        const user = await User.create({ phone: recipient, url: url });

        console.log('User SAVED successfully:', user);
        res.status(200).json({ message: 'User saved successfully', user });

    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).json({ error: 'Failed to save user', details: err.message });
    }
});

// app.post('/login', async (req, res) => {
//     try {
//         console.log('Login request:', req.body);

//         const {phone} = req.body;
//         console.log('Phone:', phone);
//         const user = await User.findOne({ phone });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         console.log('User found:', user); 
//         res.status(200).json({ message: 'User found', user });
//     } catch (err){
//         console.error('Error finding user:', err);
//         res.status(500).json({ error: 'Failed to find user', details: err.message });
//     }
// })

app.put('/login', async (req, res) => {
    try {
        console.log('Login request: for the put', req.body);
        const { phone, url } = req.body; 
        console.log('URL', url);

        const user = await User.findOneAndUpdate({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User found:', user.url);
        user.url = url;
        await user.save();

        console.log('User updated successfully:', user);
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user', details: err.message });
    }
})
app.delete('/login', async (req, res) => {
    try {
        console.log('delete:', req.body);
        const { phone } = req.body;
        console.log('Phone:', phone);
       const deletedUser = await User.findOneAndDelete({ phone})
        if (!deletedUser) {
            res.status(404).json({ message: 'No user found'});
            return;
        };
        res.json(deletedUser);
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user', details: err.message });
    }
        

    
})
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });