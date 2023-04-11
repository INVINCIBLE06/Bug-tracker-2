// This file is designed for doing the email validations with the use of email-validator library
// we have used middleware for validation of user input data in that validation there is a check for email
// Which is performed in this file


module.exports.emailvalidation = async (req, res, next) => 
{
    const email = await req.body.email // Assigning the user entered email to email variable
    // console.log(req.body)

    //checking
    if (isvalidEmail(email)) // Here the checking of the email value is done
    {
        next();  // If correct then next()
    } 
    else 
    {
        res.status(401).json
        ({
            message: "Invalid email"   // Or error message
        });
    }
};



const isvalidEmail = (email) => 
{
    const regex = (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?$/);    
    if (regex.test(email)) 
    {
        const domain = email.split('@')[1]; // get domain name after '@' symbol
        const domainParts = domain.split('.'); // split domain name by '.' separator
        //console.log(domainParts); // output: ['gmail', 'com', 'com']
        if(domainParts[1] === domainParts[2])
            {
                console.log('Both the domain names are same. It is not a valid email');
            }
            else
            {
                console.log('Valid Email');
            }
    } 
    else
    {
        console.log('Invalid Email');
    }
};