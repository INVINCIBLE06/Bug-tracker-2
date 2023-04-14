const user = require('../models/user.model'); //importing the use module and assign it to user variable 
const bcrypt = require('bcryptjs'); // importing the bcrypt js for hashing our password
const constants = require('../utils/constants');
const fetch = require('../helper/commonfetchingfunction'); 




// The below function is for forgot password.
exports.ForgotPassword = async(req, res, next)=>
{
    // We take password, newpassword, email and security answer in the req body from the user
    // After verifying all from the database we will update them
    let users = await user.forPas(req.body.email, req.body.security_answer, bcrypt.hashSync(req.body.password, 8), bcrypt.hashSync(req.body.confirm_password, 8));
    if(users)
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Password Changed Successfully",
            })
    }
    else
    {
        // If anyone of them is not correct then we will display the else part of the code 
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "email id or security answer is incorrect. Please check it once",
            }) 
    }
};

// This function will give us all the users. Whiach are registered in the database

exports.getallusers = async(req, res, next) => 
{
    let users = await user.getAll();
    if(users)
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "User data successfully fetched",
                data : {
                            users : users
                       }
            });
    }
    else
    {
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Error while fetching user data",
            }) 
    }
};
// the below controller is for getting all the user information with the looged user. It is done on the basis of user id in params

exports.GetAllUserWithOutTheLoggedOne = async(req, res, next) => 
{
    let users = await user.getalluserwithouttheloggedone(req.params.id);  // taking the user id in params
    if(users)
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "User data successfully fetched",
                data : {
                            users : users
                       }
            });
    }
    else
    {
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Error while fetching user data",
            }) 
    }
};

// this function will give us one user details based on the email id entered in the body

exports.GetOneEmailDetails = async(req, res, next) =>
{
    let users = await user.getoneemaildetails(req.body.email) // We are taking the email of the desired in the request body
    if(users.length != 0)
    {
        // next();
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Successfull",
            });
    }
    else
    {
        console.log(users)
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Email Id is not correct",
            });
    }
};

// the below function will check the security answer submitted in the body based on the email in the params

exports.CheckSecurityAnswerWithEmailInParams = async (req, res, next) =>
{
    let users = await user.checksecurityanswerwithemailinparams(req.params.email, req.body.security_answer);
    if(users.length != 0)
    {
        // next();
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "Security Answer is correct",
        });
    }
    else
    {
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Security Answer is not correct",
            });
    }
};
/**
 * Below function will update the password based in the email id of the user in the params entered. 
*/
exports.UpdatePasswordOnTheBasisOfEmailInParams = async(req, res, next) =>
{
    // We will take the password and newpassword in the req body for updating the password of the user
    let users = user.updatepasswordonthebasisofemailinparams(req.params.email, bcrypt.hashSync(req.body.password, 8), bcrypt.hashSync(req.body.confirm_password, 8));
    if(users)
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Password Changed Successfully",
            })
    }
    else
    {
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Failed in Password update",
            }) 
    }
};

// There are two tyrpe of users one is active and another one is inactive. Thi below function will return us all the active user available to us at the database.
exports.GetAllActiveEngineer = async (req, res) =>
{
    let users = await user.getallactiveengineer();
    if(users)
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Active engineer data successfully fetched",
                users : users
            })
    }
    else
    {
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Error while fetching Active engineer data",
            }) 
    }
};

// There are two tyrpe of users one is active and another one is inactive. this function will be used to change them to opposite status
// suppse it the status is inactive then it will changed to active. 
// or if the status is active then it will changed to inactive it wll done on the basis of userid in the params
exports.UpdateUserStatus = async (req, res) =>
{
    let users = await user.updateuserstatus(req.params.id);
    // console.log(users);
    if(users[0].status == constants.status.active) // if the status is active, then it will changed to inactive
    {
        return res.send
        ({
            success : "True",
            code : 200,
            message : "User status changed to ACTIVE",
            data : users
        });
    }
    else if(users[0].status == constants.status.inactive) // if the status is inactive, then it will changed to active
    {
        return res.send
        ({
            success : "True",
            code : 200,
            message : "User status changed to INACTIVE",
            data : users
        });
    }
    else
    {
        return res.status(400).send
        ({
            success : false,
            code : 400,
            message : "Error while updating user status",
        });
    }
};

exports.SendResetLinkForChangingThePassword = async (req , res, next) =>
{
    let email = await fetch.getUserDetailsByIdCondition(req.param.id);
    console.log(email)
    // let users = await user.sendresetlinkforchangingthepassword(id);
    // console.log(link)

}

/**
 * Below function. I am writing is for email validation at the time registration it will be checked by sending a
 * OTP or verification link.  
 */
exports.sendOTPcodeToEmailForVerification = async (req, res, next) => 
{
    let id = await fetch.getUserDetailsByEmailCondition(req.body.email);
    let users = await user.sendOTPcodetoemailforverification(id);
    // if(users)
    // {

    // }
    // else
    // {

    // }
};

exports.CheckOTP = async (req , res) =>
{
    
}