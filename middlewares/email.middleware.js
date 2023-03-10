// This file is designed for doing the email validations with the use of email-validator library
// we have used middleware for validation of user input data in that validation there is a check for email
// Which is performed in this file

const validator = require('email-validator');  // Importing the email-validator library and assigning it to validator variable

module.exports.emailvalidation = async (req, res, next) => 
{
    const email = await req.body.email // Assigning the user entered email to email variable
    // console.log(req.body)

    //checking
    if (validator.validate(email)) // Here the checking of the email value is done
    {
        next();  // If correct then next()
    } 
    else 
    {
        res.status(401).json
        ({
            message: "Invalid email"   // Or error message
        });
    }
};