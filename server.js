const express = require('express');
const twilio = require('twilio');
const path = require('path');
import bibleVerse from require("./utils.Ts")
// const { text } = require('body-parser');


const accountSid = 'AC7377e20d53d70fe286d8071a9388cfe9';
const authToken = '815464865ba28d5fed2baaafaa681b9e';
const client = require('twilio')(accountSid, authToken);

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));


const port =  3001;




app.post('/signup',async (req, res) => {
    const { recipient} = req.body;
    console.log('recipient:', recipient);
    const textmessage = await fetch('https://bible-api.com/data/web/random') 
    console.log('textmessage:', textmessage);
    client.messages
        .create({
            body: bibleVerse,
            from: '+18667943172',
            to: recipient
        })
        .then(message => console.log(message.sid))
        .done();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});