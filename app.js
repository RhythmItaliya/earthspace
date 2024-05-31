const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'littlemovie00@gmail.com',
        pass: 'vogscivnohmvbpqu'
    }
};

const transporter = nodemailer.createTransport(smtpConfig);
transporter.verify(function (error, success) {
    if (error) {
        console.log('SMTP connection error:', error);
    } else {
        console.log('SMTP connection successful.');
    }
});

app.post('/send-email', (req, res) => {
    const { name, email, subject, number, message } = req.body;
    console.log(req.body); 
    const adminEmail = 'littlemovie00+12@gmail.com';

    const mailOptions = {
        from: 'littlemovie00@gmail.com',
        to: adminEmail,
        subject: `New Message from ${name}: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nContact Number: ${number}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
        } else {
            console.log('Email sent successfully!');
            res.json({ success: true, message: 'Message sent successfully.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});