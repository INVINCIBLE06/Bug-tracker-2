require('dotenv').config(); 
const jwt = require('jsonwebtoken');

const authConfig = require('../configs/auth.config');
const constants = require('../utils/constants');
const fetch = require('../helper/commonfetchingfunction');
const time = require('../models/ticket.model');


exports.resetPassword = async (req, res, next) => 
{
    const token = await req.params.token;
    // console.log(token);
    
    try
    {
        jwt.verify(token, authConfig.secret, async (err, decoded) =>
        {
            if(err)
            {
                console.log('Error', err.message)
                return res.status(401).send
                ({
                    message : "The link is not valid!. Please check once again."
                });
            }
            
            else if(decoded.purpose != constants.purpose.Passwordreset)
            {
                return res.status(401).send
                ({
                    message : "The Token passed is not for resetting password"
                });
            }

            else if(decoded.resetDone == true)
            {
                console.log(`This link is already used for reseting the password. Please make a request again`)
                return res.status(401).send
                ({
                    message : "This link is already used for reseting the password. Please make a request again"
                });
            }

            let userDetail = await fetch.getUserDetailsByIdCondition(decoded.id);
            // console.log(userDetail);

            if(userDetail)
            {   
                // if user exists
                if(userDetail[0].email_verified == constants.status.verified)
                {
                    //if user is already verified
                    return res.status(401).send
                    ({
                        code : 401,
                        success : false,
                         message : "The user is not verified"
                    });
                }
                else
                {
                    const tokenCreatedAt = time.convertUnixTimeIntoSimpleFormat(decoded.iat) ;  //time converted to miliseconds
                    // console.log('This is created time of Token - ', tokenCreatedAt);
                    
                    const tokenExpiresAt = time.convertUnixTimeIntoSimpleFormat(decoded.exp);                
                    // console.log('Token expiration time :- ', tokenExpiresAt);

                    const now = time.nowd();
                    // console.log(`Current time - `, now)
                    
                    if(tokenExpiresAt <= now)
                    {   
                        // checks if token is more then certain time old
                        // sendEmail.resetPassword(req.user); // if token is expired, a new token is sent to email-Id
                        return res.status(401).send
                        ({
                            message : "This link has expired. A new link has been sent to your email address."
                        }); 
                    }
                    else
                    {
                        const newTokenDetails = {
                            tokenCreatedAt : tokenCreatedAt,
                            id : userDetail[0].id
                        }

                        next(newTokenDetails);

                    }
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
        res.status(500).send
        ({
            message : "Internal server error while token validation"
        });        
    }
};

/**
 * the Unix timestamp used in JSON Web Tokens (JWT) is calculated by counting the number
 * of seconds that have passed or gone since January 1, 1970, at 00:00:00 UTC. This is also known as the Unix epoch.
 */