/**
 * This file have been created for checking the password and confirm password is valid or not.
 * We will also check both the entered password are correct or not.
 */


module.exports.passwordvalidation = async (req, res, next) => 
{
    const password = await req.body.password  // Assigning the user entered password to password variable
    // console.log(req.body)

    const isValidPassword = (Password) => 
    {
        // This is regex or regular expression for verify the password validation
        return Password.match(/^(?=.*[^a-zA-Z0-9]).{8,12}$/); // REGEX or regurlar expression
    };


    //checking
    if (isValidPassword(password)) // from here we are sending the value in the password to the isValidPassword function
    { // If true then again check for the confirm password
        if(isValidPassword(req.body.confirm_password))  // from here we are sending the value in the req.body.confirm_password to the isValidPassword function
        { // if true then we are checking that both the password are similar or not. This check for this 
            if(req.body.password == req.body.confirm_password)
            { // If true all the 3 checks are passed then it will go to the next
                next();
            }
            else
            {
                return res.status(401).json
                ({
                    // This will come when both the password are not similar
                    message: "Both the password are not matching. Please check it once and enter it again"
                });
            }
        }
        else
        {
            return res.status(401).json
            ({
                // This will come when confirm passsword are not passing the validation
                message: "Failed! Not a valid confirm password. Password must be 8 to 12 characters containing at least one lowercase letter, one numeric digit, and one special character"
            });
        }
    } 
    else 
    {
        return res.status(401).json
        ({
            // This will come when passsword is not passing the validation
            message: "Failed! Not a valid password. Password must be 8 to 12 characters containing at least one lowercase letter, one numeric digit, and one special character"
        });
    }
}