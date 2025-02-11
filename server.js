import express from 'express'; // ES module import
import twilio from 'twilio';   // ES module import (if available, otherwise use CommonJS)
import path from 'path';     // ES module import
import mongoose from 'mongoose'; // ES module import
import * as dotenv from 'dotenv';
dotenv.config();
//import User from './user.js';  


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));



mongoose.connect( process.env.MONGODB_URI ||'mongodb://localhost:27017/twilio', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
}); 

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, './public')));
  
//     app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, './public/index.html')); 
//     });
// }

const port =  3001;




app.post('/signup',async (req, res) => {
    const { phone } = req.body;
    const { recipient} = phone;
    console.log('recipient:', recipient);
    const textmessage = req.body.url 
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