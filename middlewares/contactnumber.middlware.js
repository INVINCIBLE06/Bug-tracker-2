// This file is desined for doing the mobile number or contact number validations with the use of regex function
// we have used middlewared for validation of user inoput data in that validation there is a check for contact number
// Which is performed in this filee


module.exports.contactvalidation = async (req, res, next) => 
{
    const mobile = await req.body.mobile // Assigning the user entered mobile number to mobile variable

    const IsValidContactNo = (mobile) => 
    {
        // This is regex or regular expression for verify the contact number validation
        return mobile.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/); // REGEX or regurlar expression
    };


    //checking
    if (IsValidContactNo(mobile)) // from here we are sending the value in the mobile to the IsValidContactNo function
    {
        next(); // If correct then next()
    } 
    else 
    {
        res.status(401).json
        ({
            message: "invalid mobile number" // Or error message
        })
    }
}