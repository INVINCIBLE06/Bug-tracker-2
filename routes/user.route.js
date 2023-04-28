const usercontroller = require('../controllers/user.controller');  // importing the user controller details
const { emailvalidation } = require("../middlewares/email.middleware"); // importing the email validation
const { passwordvalidation } = require("../middlewares/password.middleware"); // importing the password validation 
const verifyparams = require('../middlewares/verifyparams'); // Importing the middlware for the validation of body and params data
const constants = require('../utils/constants');
const tokenVerification = require('../middlewares/token.verification'); 


module.exports = function(app)
{
    /**
     * 
     * below route will first check the entered email is valid
     * after that password and confirm password are valid and similar
     * check the email and security answer and is correct then it will update the password in the database
     */
    app.put('bugtracker/api/forgot/pass/new/pass', emailvalidation, passwordvalidation, usercontroller.ForgotPassword);
    // Through the below we get all the users
    app.get('bugtracker/api/get/all/user', usercontroller.getallusers);
    // Through this we will get all the detaisl one emails id which was entered in the body
    app.get('bugtracker/api/get/one/user', emailvalidation, usercontroller.GetOneEmailDetails);
    // Through this we will check the security answer entered in the body. the answer will be checked on the basis of the email id entered in the req body.
    app.get('bugtracker/api/check/security/:email', verifyparams.VerifyEmailForSecurityAnswerOnPathParams, usercontroller.CheckSecurityAnswerWithEmailInParams);
    // through this we will change the password of the email id which was entered in the params 
    app.put('bugtracker/api/update/password/:email', verifyparams.VerifyEmailForSecurityAnswerOnPathParams, passwordvalidation, usercontroller.UpdatePasswordOnTheBasisOfEmailInParams);
    // Through this we will get all the active engineern that are available in the database
    app.get('bugtracker/api/get/all/active/engineer', usercontroller.GetAllActiveEngineer); 
    // through this we will update the user status from active to inactive or inactive to active 
    app.put('bugtracker/api/update/user/status/:id', verifyparams.UserIdIsCorrectInParams, usercontroller.UpdateUserStatus);
    // through this below route we will be having the information for all the user. Only the Id which is submiited in the pamras. That users information will not be fetched
    app.get('bugtracker/api/get/all/user/not/logged/one/:id', tokenVerification.IsAdminTokenVerification, verifyparams.UserIdIsCorrectInParams, usercontroller.GetAllUserWithOutTheLoggedOne);
    // This below route will be used for checking the checking the otp. Which is send to the user
    app.post('bugtracker/api/validate/otp/:id', verifyparams.UserIdIsCorrectInParams , usercontroller.CheckOTP);
    // this below route will be used for sending OTP to the user email
    app.post(`bugtracker/api/user/send/otp`, emailvalidation, usercontroller.SendOTPCodeToEmail);
    // This route will send the reset password link to the user.
    app.get('bugtracker/api/get/reset/password/link/:id', verifyparams.UserIdIsCorrectInParams, usercontroller.SendResetLinkForChangingThePassword);
    // This below route will be useful to update or reset the password. The link that will be send to the user it will cheked by the below route
    app.get(`/bugtracker/api/${constants.purpose.Passwordreset}/:token`, passwordvalidation, tokenVerification.resetPassword, usercontroller.ResetPasswordThroughLink);
    
    app.get(`/bugtracker/api/email/verfication/link/:id`, verifyparams.UserIdIsCorrectInParams, usercontroller.SendLinkForEmailVerfication);

    app.get(`/bugtracker/api/${constants.purpose.emailVerfication}/:token`, tokenVerification.emailVerification, usercontroller.VerifyEmailThroughLink);

};