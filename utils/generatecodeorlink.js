const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');
const constants = require('./constants');
require('dotenv').config();

exports.GenerateSixDigitOTPcode = () =>
{
    return Math.floor(100000 + Math.random() * 900000); // generates a 6-digit OTP    
}

exports.GenerateLink = (id) => 
{
    try 
    {
        // Generate JWT token with id and purpose
        const token = jwt.sign
        ({
            id : id,
            purpose : constants.purpose.Passwordreset 
        },
        authConfig.secret,
        {
            expiresIn : constants.day_or_minutes_protection_policy_numbers.link_valid_till
        });
        let link = `${process.env.APP_URL}/get/${constants.purpose.Passwordreset}/link/${token}` ;
        return link;
    }
    catch(err)
    {
        console.error('Error generating JWT token:', err);
        return null; // or throw an error as appropriate for your use case
    }
}
