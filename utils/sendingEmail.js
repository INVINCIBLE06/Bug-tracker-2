const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');

exports.GenerateSixDigitOTPcode = () =>
{
    return Math.floor(100000 + Math.random() * 900000); // generates a 6-digit OTP    
}

exports.SendGeneratedOTPCode = (to, otp) =>
{
    return new Promise((resolve, reject) =>
    {
        const transporter = nodemailer.createTransport
        ({
            // service: 'Gmail', // replace with your email service provider
            port : 465,    // -> True for 465, false for other ports
            host : "smtp.gmail.com",
            auth :
            {
                user : 'sp832154@gmail.com', // replace with your email address
                pass : 'qxvckcwpijjisufz' // replace with your email password
            },
            secure : true,
        });

        const mailOptions = 
        {
            from : process.env.adminemail, // replace with your email address
            to : to, // recipient's email address
            subject : 'Email Verification',
            text : `Your OTP for email verification is: ${otp}`
        };
        
        transporter.sendMail(mailOptions, (error, info) => 
        {
            if(error)
            {
                console.error('Error sending email:', error);
                // reject(error); // Reject the promise with the error
            }
            else
            {
                console.log('Email sent:', info.response);
                // resolve(info.response); // Resolve the promise with the email response
            }
        });
    });
};

exports.GenerateResetLinkForPassword = (id) =>
{
    let token = jwt.sign({ id : id, purpose : "Passwordreset"}, authConfig.secret, {expiresIn : process.env.password_link_valid_till}) 
    return token;        
}