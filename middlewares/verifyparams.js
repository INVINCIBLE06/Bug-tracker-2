const con = require("../configs/db.config"); // importing the database details

/**
 * This file is basically designed for the checking of the data entered in the params. 
 */

/**
 * the below function will check the assignee email or we can say the enginee email.
 * WE will have enginee email in the params. it will authticated from here
 */

const CheckAssigneeEmailIsCorrectInParams = async(req, res, next) =>
{
    try
    {
        const email = req.params.assignee // assigning the email variable with the email entered in the params
        con.connect(function(err)
        { // Through the below query we will check the emial availabe in the params are present in the db
            con.query(`SELECT * FROM users u WHERE u.email = '${email}'`, function(err, result)
            {
                if(result.length == 0)
                { // if yes then it will give this message
                    res.send
                    ({
                        success : "False",
                        code : 400,
                        message : "You have entered a wrong email in the params"
                    });
                }
                else
                { // if no then it will go to the next function
                    next();
                }
            });
        });
    }
    catch(err)
    {
        console.log("#### Internal Server error while finding the params email #### ");
        res.send
        ({
            success : "false",
            code : 500,
            message : "Internal Servor error wrong email in the params"
        })
    }

};
/**
 * The below function will check the reporter or ticket creator email.
 * We will have reporter email in the params. it will authticated from here
 */
const CheckReporterEmailIdIsCorrectInParams = async (req, res, next) =>
{
    try
    {
        const email = req.params.reporter;  // assigning the email variable with the email entered in the params
        con.connect(function(err)
        {  // Through the below query we will check the emial availabe in the params are present in the db      
            con.query(`SELECT * FROM users u WHERE u.email = '${email}'`, function(err, result)
            {                
                if(result.length == 0)
                { // if yes then it will give this message
                    return res.send
                    ({
                        success : "False",
                        code : 400,
                        message : "You have entered a wrong email in the params"
                    });
                }
                else
                { // if no then it will go to the next function
                    next();
                }
            });
        });
    }
    catch
    {
        console.log("### Internal server error while finding the reporter email which was submitted us in the params ### ");
        res.send
        ({
            success : false,
            code : 500,
            message : "Internal Server error wrong email in the params"

        });
    }
};
/**
 * The below function will check the ticket id.
 * We will have ticket id in the params. it will authticated from here
 */
const TicketIdIsCorrectInParams = async (req, res, next) =>
{
    try 
    {
        const id = req.params.id; // assigning the id variable with the id entered in the params
        con.connect(function(err)
        {// Through the below query we will check the id availabe in the params is present in the db or not
            con.query(`SELECT * FROM tickets t WHERE t.id = '${id}'`, function(err, result)
            {
                if(result.length == 0)
                { // if yes then it will give this message
                    return res.send
                    ({
                        success : "false",
                        code : 400,
                        message : "You have entered a wrong ticket id in the params"
                    });
                }
                else
                {// if no then it will go to the next function
                    next();
                }
            });
        });        
    } 
    catch(error)
    {
        console.log(" ### Internal server error while finding the ticket details on the basics ticket id entered in the params ###")        
        res.send
        ({
            success : false,
            code : 500,
            message : "Internal Server error ticket id is not correct"

        });
    }
};
/**
 * The below function will check Email id. 
 * We will have Email id in the params. it will authticated from here
 */
const VerifyEmailForSecurityAnswerOnPathParams = async (req, res, next) =>
{
    try
    {
        const email = req.params.email; // assigning the email variable with the email entered in the params
        con.connect(function(err)
        { // Through the below query we will check the emial availabe in the params are present in the db          
            con.query(`SELECT * FROM users u WHERE u.email = '${email}' `, function(err, result)
            {                
                if(result.length == 0)
                { // if yes then it will give this message
                    return res.send
                    ({
                        success : "False",
                        code : 400,
                        message : "You have entered a wrong email in the params"
                    });
                }
                else
                { // if no then it will go to the next function
                    next();
                }
            });
        });

    }
    catch(err)
    {
        console.log(" ### Internal server error while finding security answer on the basis of params entered in it ### ")        
        res.send
        ({
            success : false,
            code : 500,
            message : "Internal Server error ticket id is not correct which was entered in the params"
        });
    }
};
/**
 * The below function will check the user id.
 * We will have user id in the params. it will authticated from here
 */

const UserIdIsCorrectInParams = async(req, res, next) =>
{
    try 
    {
        const id = req.params.id; // assigning the id variable with the user id entered in the params
        con.connect(function(err)
        {// Through the below query we will check the user id availabe in the params is present in the db or not
            con.query(`SELECT * FROM users u WHERE u.id = '${id}' `, function(err, result)
            {
                if(result.length == 0)
                {// if yes then it will give this message
                    return res.send
                    ({
                        success : "false",
                        code : 400,
                        message : "You have entered a wrong user_id in the params"
                    });
                }
                else
                {// if no then it will go to the next function
                    next();
                }
            });
        });        
    }
    catch(err)
    {
        console.log(" ### Internal server error while finding the user details on the basis of user id entered in the params ###");
        res.send
        ({
            success : false,
            code : 500,
            message : "Internal Server error user id is not correct which was entered in the params"
        });
    }

};


/**
 * Assigning all the function details to one variable. Through this below code
 */
const paramscheck = 
{
    CheckAssigneeEmailIsCorrectInParams,
    CheckReporterEmailIdIsCorrectInParams,
    TicketIdIsCorrectInParams,
    VerifyEmailForSecurityAnswerOnPathParams,
    UserIdIsCorrectInParams
}


module.exports = paramscheck ; // And export the variable which have all the function and we can use it anywhere in our programm