import express from 'express'; // ES module import
import twilio from 'twilio';   // ES module import (if available, otherwise use CommonJS)
import path from 'path';     // ES module import
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import {User} from './models/user'
import router from './api/bibleVerse'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';



// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

const client = twilio(apiKey, apiSecret, { accountSid });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
 //app.use("/api", api);
const port = process.env.PORT || 3001;

const mongoUri = process.env.MONGODB_URI;
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

    app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
}); 

// Run at 5 PM every day
let cronScheduleExpression = '0 17 * * *';

cron.schedule(cronScheduleExpression, async function () {
    console.log('Cron Job starting');

    try {
         
        const users = await User.find({}); // Get all users from the database
        console.log('Users:', users);
        const messagePromises = users.map(async (user) => {
            
            const recipient = user.phone;
            const url = user.url;
            let fullMessage = '';
            let Message = '';
            

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Data:', data);
              
                if (!data.final){
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
});

interface MongooseError extends Error {
    code?: number; // Optional code property
} 

// HTTP POST route for signup (separate from cron job)
app.post('/signup', async (req, res) => {
    try {
        console.log('Signup request:', req.body);
        let recipient = req.body.phone;
        const url = req.body.url;
        const fullMessage = req.body.message;
        
        // Validate phone number format
        const phoneRegex = /^\d{10}$/;  // Exactly 10 digits
        if (!phoneRegex.test(recipient)) {
            return res.status(400).json({ 
                error: "Invalid phone number. Please enter exactly 10 digits."
            });
        }

        recipient = `+1${recipient}`
        
        
        if (!recipient) {
            return res.status(400).json({ error: "Phone number is required" });
        }
         
          
          

        const user = await User.create({ phone: recipient, url: url, fullMessage: fullMessage });
        console.log('User SAVED successfully:', user);
        res.status(200).json({ 
            message: 'User saved successfully', 
            user: {  // User data is nested under 'user'
                phone: recipient,
                url: url,
                // ...
            }
        });

    } catch (err: any) {  // Use `any` instead of `unknown` for easier error handling
        console.error("Error saving user:", err);

        // Check if it's a duplicate key error
        if (err.code === 11000 || err.code === 11001) { 
            console.log("Duplicate key error:", err);
            return res.status(409).json({ error: 'This phone number is already signed up.' });
        }
            return res.status(500).json({ error: 'Failed to save user', details: err.message });
        
    }
});




app.put('/login', async (req, res) => {
    try {
        console.log('Login request: for the put', req.body);
        let { phone, url, fullMessage } = req.body; 
        console.log('URL', url);
        phone = `+1${phone}`

        const user = await User.findOneAndUpdate({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User found:', user.url);
        user.url = url;
        user.fullMessage = fullMessage;
        await user.save();

        console.log('User updated successfully:', user);
        res.status(200).json({ message: 'User updated successfully', user });
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
       const deletedUser = await User.findOneAndDelete({ phone})
        if (!deletedUser) {
            res.status(404).json({ message: 'No user found'});
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