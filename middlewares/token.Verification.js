const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');
require('dotenv').config(); 
const constants = require('../utils/constants');
const fetch = require('../helper/commonfetchingfunction'); 


exports.resetPassword = async (req, res) => 
{
    const token = await req.params.token;
    /// console.log(token);
    try
    {
        jwt.verify(token, authConfig.secret, async (err, decoded) =>
        {
            if(err)
            {
                return res.status(401).send
                ({
                    message : "The link is not valid!. Please check once again."
                });
            }

            if(decoded.purpose != constants.purpose.Passwordreset)
            {
                return res.status(401).send
                ({
                    message : "The Token passed is not for resetting password"
                });
            }

            let userDetail = await fetch.getUserDetailsByIdCondition(decoded.id)
            // console.log(userDetail);

            if(userDetail)
            {   
                //if user exists
                // if(userDetail[0].email_verified == constants.status.notverified)
                // {
                //     //if user is already verified
                //     return res.status(401).send
                //     ({
                //         code : 401,
                //         success : false,
                //          message : "The user is not verified"
                //     });
                // }
            
                const dateNow = new Date();
                console.log(dateNow.getTime());

                const tokenLife = (decoded.iat) * 1000 ;  //time converted to miliseconds
                console.log(tokenLife);

                if(tokenLife => dateNow.getTime())
                {   
                    // checks if token is more then certain time old
                    // sendEmail.resetPassword(req.user);    // if token is expired, a new token is sent to email-Id
                    return res.status(401).send
                    ({
                        message : "This link has expired. A new link has been sent to your email address."
                    });
                }
            }
            else
            {
                return res.status(401).send
                ({
                    message : "User not found"
                });
            }
        });
    }
    catch(err)
    {
        console.log("#### Error while velidating reset password token ##### ", err.message);
        res.status(500).send({
            message : "Internal server error while token validation"
        });        
    }
};