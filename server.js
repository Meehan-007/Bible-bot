import express from 'express'; // ES module import
import twilio from 'twilio';   // ES module import (if available, otherwise use CommonJS)
import path from 'path';     // ES module import
import mongoose from 'mongoose'; // ES module import
import User from './user.js';  




const accountSid = 'AC7377e20d53d70fe286d8071a9388cfe9';
const authToken = '815464865ba28d5fed2baaafaa681b9e';
const client = twilio(accountSid, authToken);

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/twilio', {
    useNewUrlParser: true, // This is still needed
    useUnifiedTopology: true, // This is still needed
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
}); 

mongoose.connect('mongodb://localhost:27017/twilio', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});

const port =  3001;




app.post('/signup',async (req, res) => {
    const { recipient} = req.body.phone;
    console.log('recipient:', recipient);
    const textmessage = await req.body.url 
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