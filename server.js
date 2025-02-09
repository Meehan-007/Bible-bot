const express = require('express');
const twilio = require('twilio');
const path = require('path');


const accountSid = 'AC7377e20d53d70fe286d8071a9388cfe9';
const authToken = '[AuthToken]';
const client = require('twilio')(accountSid, authToken);

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const port = process.env || 3000;


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/signup', (req, res) => {
    const { recipient, textmessage } = req.body;
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