const nodemailer = require('nodemailer');

exports.SendGeneratedValue = (to, value, purpose) =>
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
                user : process.env.adminemail, // replace with your email address
                pass : process.env.password // replace with your email password
            },
            secure : true,
        });


        if(value.length == 6)
        {
            const mailOptions = 
            {
                from : process.env.adminemail, // replace with your email address
                to : to, // recipient's email address
                subject : 'Verification',
                text : `Your OTP for ${purpose} is: ${value}`
            };

            transporter.sendMail(mailOptions, (error, info) => 
            {
                if(error)
                {
                    // console.error('Error sending email:', error);
                    reject(error); // Reject the promise with the error
                }
                else
                {
                    // console.log('Email sent:', info.response);
                    resolve(info.response); // Resolve the promise with the email response
                }
            });
            
        }
        else
        {
            const mailOptions = 
            {
                from : process.env.adminemail, // replace with your email address
                to : to, // recipient's email address
                subject : 'Verification',
                text : `Your Link for ${purpose} is: ${value}`
            };

            transporter.sendMail(mailOptions, (error, info) => 
            {
                if(error)
                {
                    // console.error('Error sending email:', error);
                    reject(error); // Reject the promise with the error
                }
                else
                {
                    // console.log('Email sent:', info.response);
                    resolve(info.response); // Resolve the promise with the email response
                }
            });
        }
    });
};