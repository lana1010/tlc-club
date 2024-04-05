const nodemailer = require('nodemailer');
//require('dotenv').config()

console.log("SERVICE=", process.env.MAIL_SERVICE);
console.log("MAIL_USER=", process.env.MAIL_USER);
console.log("MAIL_PASSWORD=", process.env.MAIL_PASSWORD);

const mailTransport = nodemailer.createTransport({
	service: process.env.MAIL_SERVICE,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
});

/*const mailTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'lana1010@gmail.com', // your Gmail address
		pass: 'syij sdms dltq tckg ' // your Gmail password
	}
}); */


const sendEmail = async (mailOptions) => {
    // Send email
    const info = await mailTransport.sendMail(mailOptions);

    console.log('Email sent: ' + info.response);
    return info;
};

module.exports = { sendEmail };