const authcontroller = require('../controllers/auth.controller');   // importing the auth controller details and assigning it to the authcontroller variable
const duplicatecheck = require("../middlewares/duplicate.middleware"); // importing the details of duplicate middleware
const { emailvalidation } = require("../middlewares/email.middleware"); // importing the details for validating email 
const { passwordvalidation } = require("../middlewares/password.middleware"); // // importing the details for validating password
const { birthdateValidation } = require("../middlewares/dateofbirth.middleware") // importing the details for validating date of birth
const { contactvalidation } = require("../middlewares/contactnumber.middlware"); // importing the details for validating contact number
const verifyparams = require('../middlewares/verifyparams'); // Importing the middlware for the validation of body and params data
const tokenVerification = require('../middlewares/token.verification'); 


module.exports = function(app)
{
    /**
     * below route will be used to add or signup the user
     * email password contact and birthdate all will be validated and then it will be added to the database
     */
    app.post('/add/new/user', tokenVerification.IsAdminTokenVerification, emailvalidation, passwordvalidation, contactvalidation, birthdateValidation, duplicatecheck.duplicateValueEmail, duplicatecheck.duplicateValueMobile, authcontroller.AddNewUser);
    /**
     * below route will be used to signin the user
     * email and password will be validated and then it will be able to signin
     */
    app.post('/login/exist/user', emailvalidation, authcontroller.signin);
    /**
     * below route will be used to signin the user
     * email and password will be validated and then it will be able to signin
     */
    app.post('/logout/exist/user/:id', verifyparams.UserIdIsCorrectInParams, authcontroller.SignOut);

    // The below route is for logout of a user. Based on a userId
    app.get('/user/activity/log/:id', verifyparams.UserIdIsCorrectInParams, authcontroller.activitylogs);

    

    // app.post('/user/check/otp', authcontroller.CheckOTP);

}