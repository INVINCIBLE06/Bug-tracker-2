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
    app.put('/forgot/pass/new/pass', emailvalidation, passwordvalidation, usercontroller.ForgotPassword);
    // Through the below we get all the users
    app.get('/get/all/user', usercontroller.getallusers);
    // Through this we will get all the detaisl one emails id which was entered in the body
    app.get('/get/one/user', emailvalidation, usercontroller.GetOneEmailDetails);
    // Through this we will check the security answer entered in the body. the answer will be checked on the basis of the email id entered in the req body.
    app.get('/check/security/:email', verifyparams.VerifyEmailForSecurityAnswerOnPathParams, usercontroller.CheckSecurityAnswerWithEmailInParams);
    // through this we will change the password of the email id which was entered in the params 
    app.put('/check/security/:email', verifyparams.VerifyEmailForSecurityAnswerOnPathParams, passwordvalidation, usercontroller.UpdatePasswordOnTheBasisOfEmailInParams);
    // Through this we will get all the active engineern that are available in the database
    app.get('/get/all/active/engineer', usercontroller.GetAllActiveEngineer); 
    // through this we will update the user status from active to inactive or inactive to active 
    app.put('/update/user/status/:id', verifyparams.UserIdIsCorrectInParams, usercontroller.UpdateUserStatus);
    // through this below route we will be having the information for all the user. Only the Id which is submiited in the pamras. That users information will not be fetched
    app.get('/get/all/user/not/logged/one/:id', verifyparams.UserIdIsCorrectInParams, usercontroller.GetAllUserWithOutTheLoggedOne);
/* ___________________________________________________________________________________________________________________________________________ */

    app.get('/get/reset/password/link/:id', verifyparams.UserIdIsCorrectInParams, usercontroller.SendResetLinkForChangingThePassword);

    app.post(`/user/send/otp`, emailvalidation, usercontroller.sendOTPcodeToEmailForVerification);

    app.post('/validate/otp/:id', verifyparams.UserIdIsCorrectInParams , usercontroller.CheckOTP);

    app.get(`/bugtracker/${constants.purpose.Passwordreset}/:token`, passwordvalidation, tokenVerification.resetPassword, usercontroller.ResetPasswordThroughLink);  


};