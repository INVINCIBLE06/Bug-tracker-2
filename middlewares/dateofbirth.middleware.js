// This file is designed for doing the Date or birth validations with the use of regex function
// we have used middleware for validation of user input data in that validation there is a check for Date or birth
// Which is performed in this file

module.exports.birthdateValidation = async (req, res, next) => {
    
    /**
    * This Function will check the date of birht is valid or not
    */
    const isValidDOB = (DOB) => 
    {
        // This is regex or regular expression for verify the Date or birth validation
        return DOB.match(/^\d{4}[./-]\d{2}[./-]\d{2}$/); // REGEX or regurlar expression
        // return DOB.match(/^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}$/);
    }

    //checking
    if (isValidDOB(req.body.date_of_birth)) // from here we are sending the value in the req.body.date_of_birth to the isValidDOB function
    {
        next();// If correct then next()
    } 
    else 
    {
        res.status(401).json
        ({
            message: "Date of birth is not in correct format."   // Or error message
        })
    }
}