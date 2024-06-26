const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
//const helmet = require('helmet') //helps secure Express apps by setting HTTP response headers
//require('dotenv').config()
require('dotenv').config({ path: './server/.env' });

var cors = require('cors')

// import the additional web-app server modules
const conf = require('./config.js');
const { sendEmail } = require('./mail.js');

// create express application
const app = express();

// Environment parameters
let logger = conf.DEFAULT_LOGGER;

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// middleware to serve static files with the correct MIME type
app.use(express.static('/', { 'extensions': ['js'] }));

app.use(express.json());

// ********************************************
// ***************** ROUTING ******************
// ********************************************

// the POST proxy
app.post('*', async (req, res, next) => {
    logger.debug('Requested route: ' + req.path);
    // append the common headers for all POST requests
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});

// the GET proxy
app.get('*', async (req, res, next) => {
    logger.debug('Requested route: ' + req.path);
    // append the common headers for all GET requests
    res.header("Content-Type", "text/html");
    next();
});

// ********************************************
// ********** The application routers *********
// ********************************************

// Serve static files from the '/public' directory
app.use(express.static(path.join(__dirname, '../public'), { 
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Serve the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Serve the HTML form
app.post('/submit_form', async (req, res) => {
	const { contact_name, contact_email, contact_message } = req.body;

	// basic validation
	if (
		!contact_email || !contact_email.trim() ||
		!contact_name || !contact_name.trim() ||
		!contact_message || !contact_message.trim()
	) {
		return res.status(400).json({ message: 'name, email, and message are required' });
	}

	// Construct email
	try {
		const mailOptions = {
			from: process.env.MAIL_SENDER_DEFAULT, // sender address
			to: process.env.MAIL_RECEIVER, // receiver email
			subject: 'New message from ' + contact_name,
			text: `Name: ${contact_name}\nEmail: ${contact_email}\n\n${contact_message}`
			//html: '<p>Hello, this is a test email.</p>', // HTML body
		};
	
		// Send email asynchronously
		await sendEmail(mailOptions);

		// Redirect with success message
        return res.redirect('/?message=Message%20sent%20successfully');
	} catch (error) {
		console.error(error);
		// Redirect with error message
        return res.redirect('/?message=Error%20occurred,%20message%20not%20sent');
	}
});


module.exports = app;
