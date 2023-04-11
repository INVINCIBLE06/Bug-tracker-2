const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.emailVerification = (email, OTP) =>
{
    const generateOTP = () => 
    {
        return Math.floor(100000 + Math.random() * 900000); // generates a 6-digit OTP
    };
    
    const otp = generateOTP(); // call this function to generate OTP
    
    console.log(otp);

    const transporter = nodemailer.createTransport
    ({
        service : 'Gmail', // replace with your email service provider
        auth : 
        {
            user : process.env.adminemail, // replace with your email address
            pass : 'qxvckcwpijjisufz' // replace with your email password
        }
    });

    const sendVerificationEmail = (to, otp) => 
    {
        // const mailOptions = 
        // {
        //     from : process.env.adminemail, // replace with your email address
        //     to : to, // recipient's email address
        //     subject: 'Email Verification',
        //     text: `Your OTP for email verification is: ${otp}`
        // };
      
        // transporter.sendMail(mailOptions, (error, info) => 
        // {
        //     if (error) 
        //     {
        //         console.error('Error sending email:', error);
        //     } 
        //     else
        //     {
        //         console.log('Email sent:', info.response);
        //     }
        // });
    };      
    sendVerificationEmail(email, otp); // call this function to send the email

    // Assuming the user's provided OTP is stored in a variable called 'userOTP'
    if(OTP === otp) 
    {
        console.log('OTP matched. Email verified successfully!');
    }
    else
    {
        console.log('OTP did not match. Email verification failed.');
    }
  

}

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
            service : 'Gmail', // replace with your email service provider
            auth :
            {
                user : process.env.adminemail, // replace with your email address
                pass : 'qxvckcwpijjisufz' // replace with your email password
            }
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
                reject(error); // Reject the promise with the error
            } 
            else
            {
                console.log('Email sent:', info.response);
                resolve(info.response); // Resolve the promise with the email response
            }
        });
    });
};



   