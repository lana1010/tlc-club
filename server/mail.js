const nodemailer = require('nodemailer');
//require('dotenv').config()

const mailTransport = nodemailer.createTransport({
	service: process.env.MAIL_SERVICE,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
});

const sendEmail = async (mailOptions) => {
    // Send email
    const info = await mailTransport.sendMail(mailOptions);

    console.log('Email sent: ' + info.response);
    return info;
};

module.exports = { sendEmail };