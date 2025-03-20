import express from 'express'; // ES module import
import twilio from 'twilio';   // ES module import (if available, otherwise use CommonJS)
import path from 'path';     // ES module import
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { User } from './models/user'
import router from './api/bibleVerse';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;

const mongoUri = process.env.VITE_MONGODB_URI;
const port = process.env.PORT || 3001;

const client = twilio(accountSid, authToken);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
//app.use("/api", api);

console.log('mongoUri', mongoUri);
if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined");
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Connected to database:', mongoose.connection.name);

    })
    .catch(err => {
        console.log(err);
    });
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../client/dist'));
}





let cronScheduleExpression = '*/5 * * * *';

cron.schedule(cronScheduleExpression, async function () {
    console.log('Cron Job starting');
    console.log('Twilio credentials:', {
        accountSid: accountSid?.substring(0, 5) + '...',
        authTokenLength: authToken?.length,
        hasAuth: !!accountSid && !!authToken
      });
    try {

        const users = await User.find({}); // Get all users from the database
        console.log('Users:', users);
        const messagePromises = users.map(async (user) => {

            const recipient = user.phone;
            let url = user.url;

            // Fix relative URLs by making them absolute
            if (url.startsWith('/')) {
                console.log('Relative URL detected');
                // For local development
                url = `http://localhost:3001${url}`;
                
                // For production
                if (process.env.NODE_ENV === 'production') {
                    console.log('Production environment detected');
                    url = `https://bible-bot.org${url}`;
                }
            }

            console.log('Using URL:', url);

            let fullMessage = '';
            let Message = '';

            console.log('URL:', url);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Data:', data);

                if (!data.final) {
                    const textmessage = data.random_verse.text;
                    const verse = data.random_verse.verse;
                    const chapter = data.random_verse.chapter;
                    const book = data.random_verse.book;
                    fullMessage = `${textmessage} ${book} ${chapter}:${verse}`;
                    console.log('Message:', fullMessage);

                }
                else {
                    Message = data.final.map((item: { value: string }) => item.value).join(' ');
                    console.log('Message:', Message);
                }



                const message = await client.messages.create({
                    body: fullMessage || Message,
                    from: '+18667943172',
                    to: recipient
                })

                return { recipient, success: true, sid: message.sid }



            } catch (innerError: unknown) {
                if (innerError instanceof Error) {
                    console.error(`Error sending message to ${recipient}:`, innerError);
                    return { recipient, success: false, error: innerError.message };
                } else {
                    console.error(`Unexpected error sending message to ${recipient}:`, innerError);
                    return { recipient, success: false, error: "An unexpected error occurred." };
                }
            }
        })


    } catch (error) {
        console.error("Error in cron job:", error);
    }
}, {
  timezone: "America/New_York"  // Change to your timezone
});

interface MongooseError extends Error {
    code?: number; // Optional code property
}

// HTTP POST route for signup (separate from cron job)
app.post('/signup', async (req, res) => {
    try {
        let { phone, url } = req.body;
        console.log('Phone:', phone);
        const phoneRegex = /^\d{10}$/;  // Exactly 10 digits
        if (!phoneRegex.test(phone)) {  // Test original phone number
            return res.status(400).json({
                error: "Invalid phone number. Please enter exactly 10 digits."
            });
        }

        phone = `+1${phone}`; // Add +1 AFTER validation

        // Check for existing user first
        const existingUser = await User.findOne({ phone });
        console.log('Existing user:', existingUser);
        if (existingUser) {
            return res.status(409).json({ error: 'This phone number is already signed up.' });
        }

        const user = new User({ phone, url });
        await user.save();

        res.status(200).json({ message: 'User created successfully', user });
    } catch (err: any) {
        console.error("Error saving user:", err);
        res.status(500).json({ error: 'Failed to save user', details: err.message });
    }
});




app.put('/login', async (req, res) => {
    try {
        console.log('Login request: for the put', req.body);
        let phone = req.body.phone;
        let url = req.body.url;
        console.log('URL', url);
        phone = `+1${phone}`;

        if (!phone || !url) {
            return res.status(400).json({ error: 'Phone and selection are required' });
        }

        // Correctly structured findOneAndUpdate with 3 parameters
        const updatedUser = await User.findOneAndUpdate(
            {phone}, 
            {$set: {url}}, 
            {new: true, runValidators: true}
        );
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User updated successfully:', updatedUser);
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err: unknown) {
        console.error('Error updating user:', err);

        // Check if err is an instance of Error
        if (err instanceof Error) {
            res.status(500).json({ error: 'Failed to update user', details: err.message });
        } else {
            // Handle unexpected error
            res.status(500).json({ error: 'Failed to update user', details: 'An unexpected error occurred.' });
        }
    }
})

app.delete('/login', async (req, res) => {
    try {
        console.log('delete:', req.body);
        let { phone } = req.body;
        console.log('Phone:', phone);
        phone = `+1${phone}`

        console.log('Phone2:', phone);
        const deletedUser = await User.findOneAndDelete({ phone })
        if (!deletedUser) {
            res.status(404).json({ message: 'No user found' });
            return;
        }
        res.json(deletedUser);
    } catch (err: unknown) {
        console.error('Error deleting user:', err);

        // Check if err is an instance of Error
        if (err instanceof Error) {
            res.status(500).json({ error: 'Failed to delete user', details: err.message });
        } else {
            // Handle unexpected error
            res.status(500).json({ error: 'Failed to delete user', details: 'An unexpected error occurred.' });
        }
    }
})
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
export default app;