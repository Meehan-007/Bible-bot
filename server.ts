import express from 'express'; // ES module import
import twilio from 'twilio';   // ES module import (if available, otherwise use CommonJS)
import path from 'path';     // ES module import
import mongoose from 'mongoose';  

import * as dotenv from 'dotenv';
dotenv.config(); 

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

const port = process.env || 3001;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});

app.post('/signup', (req, res) => {
    const { phone } = req.body;
    const { recipient} = phone;
    const textmessage = req.body.url;
    console.log('textmessage:', textmessage);
    client.messages
        .create({
            body: textmessage,
            from: '+18667943172',
            to: recipient
        })
        .then(message => console.log(message.sid))
        .done();
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});