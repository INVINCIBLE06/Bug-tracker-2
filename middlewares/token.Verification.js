/**
 * The Unix timestamp used in JSON Web Tokens (JWT) is calculated by counting the number
 * of seconds that have passed or gone since January 1, 1970, at 00:00:00 UTC. This is also known as the Unix epoch.
 */

require('dotenv').config(); 
const jwt = require('jsonwebtoken');

const authConfig = require('../configs/auth.config');
const constants = require('../utils/constants');
const time = require('../models/ticket.model');
const fetch = require('../helper/commonfetchingfunction');

exports.resetPassword = async (req, res, next) => 
{
    let token = await req.params.token;
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
                    message : "The link is not valid !. Please check once again."
                });
            }
            
            else if(decoded.purpose != constants.purpose.Passwordreset)
            {
                return res.status(401).send
                ({
                    message : "The Token passed is not for resetting password"
                });
            }

            let userDetail = await fetch.getUserDetailsByIdCondition(decoded.id);
            // console.log(userDetail);

            if(userDetail)
            {   
                // if user exists
                // if(userDetail[0].email_verified == constants.status.notverified)
                // {
                //     //if user is already verified
                //     return res.status(401).send
                //     ({
                //         code : 401,
                //         success : false,
                //         message : "The user is not verified"
                //     });
                // }
                
                if(userDetail[0].password != decoded.unique) 
                {
                    // console.log("Password is changed. You cannot use the link again");
                    return res.status(401).send
                    ({
                        code : 401,
                        success : false,
                        message : "Password is changed. You cannot use the link again"
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
                        next(userDetail[0].id);
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


exports.emailVerification = async ( req, res, next ) => 
{
    let token = await req.params.token;
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
                    message : "The link is not valid !. Please check once again."
                });
            }
            
            else if(decoded.purpose != constants.purpose.emailVerfication)
            {
                return res.status(401).send
                ({
                    message : "The Token passed is not for verifying email"
                });
            }
            
            let userDetail = await fetch.getUserDetailsByIdCondition(decoded.id);
            // console.log(userDetail);

            if(userDetail)
            {   
                // if user exists
                // if(userDetail[0].email_verified == constants.status.notverified)
                // {
                //     //if user is already verified
                //     return res.status(401).send
                //     ({
                //         code : 401,
                //         success : false,
                //         message : "The user is not verified"
                //     });
                // }
                
                // if(userDetail[0].password != decoded.unique) 
                // {
                //     // console.log("Password is changed. You cannot use the link again");
                //     return res.status(401).send
                //     ({
                //         code : 401,
                //         success : false,
                //         message : "Password is changed. You cannot use the link again"
                //     });
                // }
                
                if(userDetail[0].email_verified == constants.status.verified) 
                {
                    // console.log("Link is already used. User is verifed as well.");
                    return res.status(401).send
                    ({
                        code : 401,
                        success : false,
                        message : "Link is already used. User is verifed as well."
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
                        next(userDetail[0].id);
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
