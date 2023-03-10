const con = require("../configs/db.config");  // importing the database details

/**
 * This file is designed for checking the duplicate values from the inthe database
 * When the user entered the input it will first check in the dstabase it is already availale or not
 * if yes then it will give error or no then it wioll allow the user to registert
*/

/**
 * below function is for checking the duplicte emails. through this no one can able to enter the email 
 * which is already present in the database
 */
const duplicateValueEmail = async (req, res, next) => 
{  
    try
    {    
    con.connect(function(err) 
    {    // This query is for checking the presence of user entered email in the database    
        con.query(`SELECT * FROM users u WHERE u.email = '${req.body.email}'`, function (err, result) 
        {
            if(result.length != 0)
            {
                return res.status(400).send
                ({
                    // if yes then this message
                    message : " This is a already registered email"
                });
            }
            else
            {
                // If not present then it will shift to next
                next();
            }
        });
    }); 
    }catch(err)
    {
        console.log("Error While Checking duplicate email value", err.message)
        res.status(400).send
        ({
            message : "This email is already registered. Please use other email"
        })
    }
};

/**
 * below function is for checking the duplicate contact number. through this one can able to enter the duplicate contact number 
 * which is already present in the database
 */
const duplicateValueMobile = async (req, res, next) => 
{
    try
    {
    const mobile = await req.body.mobile // Assigning the mobile variable with the mobile number entered as a input 
    con.connect(function(err) 
    { // The below query will check the the presence of user entered mobile number in the database
        con.query(`SELECT * FROM users u WHERE u.mobile = '${mobile}'`, function (err, result) 
        {
            if(result.length != 0)
            {
                return res.status(400).send
                ({
                    // If available then this message will be displayed
                    message : " This is a already registered mobile number"
                });
            }
            else
            {
                // if no then, it will direclty jump to the next
                next();
            }
        });
    });
    }catch(err)
    {
        console.log("Error while checking the duplicate mubile", err.message)
        res.status(400).send
        ({
            message : " Please enter different mobile number. It is already registered"
        })
    }
};

/**
 * Below function is for checking the duplicate role name. Through this one no can be able to enter the duplicate role name 
 * which is already present in the database
 */

const duplicateRoleName = async (req, res, next) => 
{
    try
    {
    con.connect(function(err) 
    { // The below query will check the the presence of user entered role_name in the database
        con.query(`SELECT * FROM roles r WHERE r.role_name = '${req.body.role_name}'`, function (err, result) 
        {
            if(result.length != 0)
            {
                return res.status(400).send
                ({// If available then this message will be displayed
                    message : "This role name already exists"
                });
            }
            else
            {// if no then, it will direclty jump to the next
                next();
            }
        });
    });
    }catch(err)
    {
        console.log("Error while checking the duplicate role name", err.message)
        res.status(400).send
        ({
            message : " This role name is already exist"
        })
    }
};
/**
 * Below function is for checking the duplicate role name when the admin want to update any role name. Through this one admin is not able to enter the duplicate role name 
 * which is already present in the database. While updating if that name is already present in the database
 * then it will checked by this middleware function
 */
const duplicateUpdateRoleName = async (req, res, next) => 
{
    try
    {
    con.connect(function(err) 
    {
        con.query(`SELECT * FROM roles r WHERE r.role_name = '${req.body.new_rolename}'`, function (err, result) 
        {// The below query will check the the presence of admin  entered role_name in the database while updating the role name
            if(result.length != 0)
            {
                return res.status(400).send
                ({ // If available then this message will be displayed
                    message : "This new role name already exists"
                });
            }
            else
            {
                if(req.body.role_name == req.body.new_rolename)
                { // if the admin enter name in both feild same then this message will be displayed
                    return res.status(400).send
                    ({
                        message : "This new role is similar to the previous one"
                    });
                }
                else
                { // if both the conditions are coreect then controller comes here and it will jump to next
                    next();
                }
            }
        });
    });
    }catch(err)
    {
        console.log("Error while checking the duplicate role name", err.message)
        res.status(400).send
        ({
            message : " This new role name is already exist"
        });
    }
};

/**
 * Below function is for checking the duplicate module name. Through this one no can be able to enter the duplicate module name
 * which is already present in the database
 */

const duplicateModuleName = async (req, res, next) => 
{
    try
    {
    con.connect(function(err) 
    {
        con.query(`SELECT * FROM modules m WHERE m.module_name = '${req.body.module_name}'`, function (err, result) 
        {// The below query will check the the presence of admin user entered module_name in the database
            if(result.length != 0)
            {
                return res.status(400).send
                ({ // If available then this message will be displayed
                    message : "This module name already exists"
                });
            }
            else
            {// if no then, it will direclty jump to the next
                next();
            }
        });
    });
    }catch(err)
    {
        console.log("Error while creating the duplicate module name", err.message)
        res.status(400).send
        ({
            message : " This module name is already exist"
        })
    }
};

/**
 * Below function is for checking the duplicate module_name when the admin want to update any module_name. Through this one admin is not able to enter the duplicate module_name 
 * which is already present in the database. While updating if that name is already present in the database
 * then it will checked by this middleware function
 */

const duplicateUpdateModuleName = async (req, res, next) => 
{
    try
    {
    con.connect(function(err) 
    {
        con.query(`SELECT * FROM modules m WHERE m.module_name = '${req.body.new_modulename}'`, function (err, result) 
        {// The below query will check the the presence of admin entered module_name in the database while updating the module_name
            if(result.length != 0)
            {
                return res.status(400).send
                ({// If available then this message will be displayed
                    message : "This new module name already exists"
                });
            }
            else
            {
                if(req.body.module_name == req.body.new_modulename)
                {// if the admin enter name in both feild same then this message will be displayed
                    return res.status(400).send
                    ({
                        message : "This new module is similar to the previous one"
                    });
                }
                else
                {// if both the conditions are corect then controller comes here and it will jump to next
                    next();
                }
            }
        });
    });
    }catch(err)
    {
        console.log("Error while checking the duplicate module name", err.message)
        res.status(400).send
        ({
            message : " This new module name is already exist"
        })
    }
};

/**
 * Assigning all the function details to one variable. Through this below code
 */
const validator = 
{
    duplicateValueMobile,
    duplicateValueEmail,
    duplicateRoleName,
    duplicateUpdateRoleName,
    duplicateUpdateModuleName,
    duplicateModuleName,
}

module.exports = validator; // And export tha variable which have all the function and we can use it anywhere in our programm
