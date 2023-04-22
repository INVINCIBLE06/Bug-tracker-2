const jwt = require('jsonwebtoken');
require('dotenv').config();

const authConfig = require('../configs/auth.config');
const constants = require('./constants');


exports.GenerateSixDigitOTPcode = () =>
{
    return Math.floor(100000 + Math.random() * 900000); // generates a 6-digit OTP    
}

exports.token = (password,  id) => 
{
    try 
    {
        // Generate JWT token with id and purpose
        const token = jwt.sign
        ({
            id : id,
            purpose : constants.purpose.Passwordreset,
            password  : password,
        },
        authConfig.secret,
        {
            expiresIn : constants.day_or_minutes_protection_policy_numbers.link_valid_till
        });
        return token;       
    }
    catch(err)
    {
        console.error('Error generating JWT token:', err);
        return null; // or throw an error as appropriate for your use case
    }
}

exports.CreateLink = (token) =>
{
    let link = `${process.env.APP_URL}/bugtracker/${constants.purpose.Passwordreset}/${token}` ;
    return link;
}

