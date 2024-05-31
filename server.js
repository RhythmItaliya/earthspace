const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://earthspace.onrender.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'earthspaceinternational@gmail.com',
        pass: 'xriuhulzxsrqrnok'
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send-email', (req, res) => {
    const { name, email, subject, number, message } = req.body;
    const adminEmail = 'earthspaceinternational@gmail.com';

    const htmlTemplate = `
        <html>
        <body>
            <h2>Earthspace International - New Message Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Name:</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${name}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Email:</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${email}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Contact Number:</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${number}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; vertical-align: top;">Message:</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; vertical-align: top;">${message.replace(/\n/g, '<br>')}</td>
                </tr>
            </table>
        </body>
        </html>
    `;

    const mailOptions = {
        from: 'Earthspace International <earthspaceinternational@gmail.com>',
        to: adminEmail,
        subject: `New Message from ${name}: ${subject}`,
        html: htmlTemplate
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
    console.log(`Server is running on ${PORT}`);
});
