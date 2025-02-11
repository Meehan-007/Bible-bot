import express from 'express'; // ES module import
import twilio from 'twilio';   // ES module import (if available, otherwise use CommonJS)
import path from 'path';     // ES module import
import mongoose from 'mongoose';  
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config(); 

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});

app.post('/signup', async (req, res) => {
    console.log('req.body:', req.body);
    const recipient = req.body.user.phone;
    const url = req.body.user.url;

    console.log('recipient:', recipient);

    if (!recipient) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        const textmessage = data.random_verse.text;
        const verse = data.random_verse.verse;
        const chapter = data.random_verse.chapter;
        const book = data.random_verse.book;

        const fullMessage = `${textmessage} ${book} ${chapter}:${verse}`; // fullMessage is now inside the try block
        console.log('textmessage:', fullMessage);

        const message = await client.messages.create({
            body: fullMessage,
            from: '+18667943172',
            to: recipient
        });

        console.log(message.sid);
        res.status(200).json({ message: 'Message sent successfully' });

    } catch (error) { // The catch block is now correctly placed
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});