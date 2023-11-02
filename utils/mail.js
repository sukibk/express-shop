const nodemailer = require('nodemailer');
const sendGridTransporter = require('nodemailer-sendgrid-transport');
require('dotenv');

const transporter = nodemailer.createTransport(sendGridTransporter(({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
})))

module.exports = transporter;