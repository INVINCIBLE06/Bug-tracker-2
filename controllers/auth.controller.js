const user = require('../models/user.model'); // Importing the user model details and intializing it into user varibale 
const bcrypt = require('bcryptjs');  // importing the bcryptjs libraruy
const con = require('../configs/db.config'); // importing the database details
const constants = require('../utils/constants'); // importing the constants file details
/**
 * Below function is used for add or registering the nes user
 */
exports.AddNewUser = async(req, res, next)=>
{
    let users = await user.addOne(req.body.name, req.body.email, req.body.mobile, req.body.date_of_birth, req.body.status, req.body.security_answer, bcrypt.hashSync(req.body.password,8), bcrypt.hashSync(req.body.confirm_password, 8), req.body.role, req.body.module);
    if(users) // if user added then below if code will be executed other wisee else part
    {
        // res.send('New user Added Successfully');
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Signup Successfully",
            })
    }
    else
    {   // if user added then below if code will be executed other wisee else part
        return res.status(400).send
            ({
                success : true,
                code : 400,
                message : "Signup failed ! Role is not available",
            }) 
    }
};

/**
 * Below function is used for user signin after checking the emailid and password
 */
exports.signin = (req, res) => 
{ // The below query will give check user based on the email id submitted
    const { email, password } = req.body
    con.query(`SELECT u.id AS User_Id, u.password, u.name, u.email, u.mobile, u.status, r.id AS Role_Id, r.role_name FROM users u, roles r WHERE u.email = '${email}' AND u.role_Id = r.id`, (err, result) =>
    { // if the user is available then this if block code will be executed 
        if(result.length != 0) 
        { // The below query will give us the role id of that particular user whose email id is entered in the email
            let AgainDoCheck = `SELECT u.id AS idu, r.id AS roleid FROM users u, roles r WHERE u.role_Id = r.id`;
            con.query(AgainDoCheck, (err, resultADC) => // executing the above query
            { // If the query is successfully executed then this if block code is executed
                if(resultADC.length != 0) 
                { // the below query is getting the module id and module name. The checking can be done with user id and roleid
                    let MidName = `SELECT m.id, m.module_name FROM permissions p, modules m WHERE p.user_Id = '${result[0].User_Id}' AND p.role_Id = '${result[0].Role_Id}' AND p.module_Id = m.id`;
                    con.query(MidName, (err, resultMID) => // executing the above query  
                    {// the below code is for compare the password enterted by the user from the password available in the database for that particular email and entered
                        bcrypt.compare(password, result[0].password, (err, result2) => // executing the above query 
                        { // The above line is comparing the password available in the db with the password entered bu the user
                          if(result2) // If it is correct then it will inside the if loop
                            {
                                if(result[0].status == constants.status.inactive) // After password is correct then we are checking whether that user is a ACTIVE user or INACTIVE user
                                { // If inactive user then they will not be able to get the dashboard
                                    return res.send
                                    ({ // This message will be displayed 
                                        success : false,
                                        code : 400,
                                        message : "Soory You cannot login as per now. You have blocked by the Admin",
                                        role : result[0].role_name, // Role name of the user
                                        status : result[0].status // status of the name
                                    });
                                }
                                else // After password is correct then we are checking whether that user is a ACTIVE user or INACTIVE user
                                {   // If active user then they will get the dashboard
                                    // the below query is for call the stored procedure. That procedure will be used to enter the ip_address, user_id, login type, browser description into users_activities
                                    let StrCallQuery = `CALL insertintousers_activities('svdv4854', '${result[0].User_Id}', '${constants.loggedStatus.login}', 'This is just of checking purpose for logout')`;
                                    con.query(StrCallQuery, (err, resultlg) => // executing the above query
                                    { // if the procedured executed successfully then this if block code is executed
                                        if(resultlg.length != 0)
                                        {
                                            console.log(`Data entered of the user whose id is '${result[0].User_Id}' into the users_activities table at the time of login`);
                                            let StrCallQuery2 = `CALL insertintoreportswhilelogin('${result[0].User_Id}') `; // this query will call the store procedure that will enter the login time in the user report table keeping the user activity data
                                            con.query(StrCallQuery2, (err, resultlgg) => // executing the above query
                                            { // if the procedured executed successfully then this if block code is executed
                                                if(resultlgg.length != 0)
                                                {
                                                    console.log(` #### Data entered into the report table while login for the user_id '${result[0].User_Id}' #### `);
                                                    console.log(` #### User with id '${result[0].User_Id}' logged in successfully #### `);
                                                    return res.status(200).send
                                                    ({ // This message will be displayed 
                                                        success : true,
                                                        code : 200,
                                                        message : "Signin Successfully",
                                                        // date : 
                                                        //         {
                                                        //             users : result, 
                                                        //             module : resultMID
                                                        //         }
                                                    });
                                                }
                                                else // if the procedured executed unsuccessfully then this else block code is executed
                                                {
                                                    console.log(`Error happen while entering the user id '${result[0].User_Id}' data at the time login in the report table for calculating total logged hours `, err.message);
                                                }
                                            });                                            
                                        }
                                        else // if the procedured executed unsuccessfully then this if block code is executed
                                        {
                                            console.log(`Error happen while entering the user id '${result[0].User_Id}' data into users_activities table at the time of login`, err.message);
                                        }
                                    });
                                }                                                        
                            } 
                            else 
                            {   
                                console.log("Passsword is not correct", err);
                                // If password is incorrect then this code will get
                                return res.status(400).send
                                ({
                                    success : false,
                                    code : 400,
                                    message : "Signin faied ! Password is incorrect",
                                });
                            }
                        });
                    });
                }
            });            
        }
        else
        {   // If the email is not correct. Then this lines of code will get execute
            console.log(` #### Email is not correct ####`, err); 
            return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Unauthorised user ! Email id is not registered with us",
            });
        }   
    });
}; 

/**
 * The below query is is logout of the user
 */

exports.SignOut = (req, res) =>
{
    const id = req.params.id  // The user_id is in the params. That Id we are initializing it into the id variable
    // The below query is for calling the store procedure that will enter the ip_address, user_id, login type, browser description into users_activities for logout.
    let StrCallQuery = `CALL insertintousers_activities('svdv48545', '${id}', '${constants.loggedStatus.logout}', 'This is just of checking purpose for logout')`;
    con.query(StrCallQuery, (err, resultlg) => // executing the above query
    { // if the procedured executed successfully then this if block code is executed
        if(resultlg.length != 0)
        {
            console.log(`Data entered into the report table while Logout for the user_id '${id}'`);
            console.log(`Data entered of the user whose id is '${id}' into the logged table at the time of logout`);
            console.log(`user with id '${id}' logged out successfully`);
            // this query will call the stored procedure that will enter the logout time in the user report table keeping the user activity data
            let StrCallQueryOfLogout = `CALL insertintoreportswhilelogout('${id}') `;
            con.query(StrCallQueryOfLogout, (err, resultlgg) => // executing the above query
            {   // if the procedured executed successfully then this if block code is executed         
                if(resultlgg.length != 0)
                {
                    console.log( `### Logout time is entered in the reports table for the '${id}' ###`);
                    // the below query will call the stored procedure for calculating and entereing the total login time into the reports table
                    let StrCallQueryOfLoggedHours = `CALL insertintoreportfortotalloggedhours('${id}') `;
                    con.query(StrCallQueryOfLoggedHours, (err, resultlggg) => // executing the above query
                    {   // if the procedured executed successfully then this if block code is executed
                        if(resultlggg.length != 0)
                        {
                            console.log( `### Logged hours have been calculated and time is entered in the reports table for the '${id}' ###`);
                            return res.send
                            ({
                                success : true,
                                code : 200,
                                message : 'Logout done successfully',        
                            });   
                        }
                        // if the procedured not executed successfully then this else block code is executed
                        else
                        {
                            console.log(` #### Error while calling the stored procedure #### `, err.message);
                            return res.send
                            ({
                                success : true,
                                code : 404,
                                message : 'Error occured while logout',        
                            });
                        }
                    });                           
                } // if the procedured not executed successfully then this else block code is executed
                else
                {
                    console.log(`Error happen while entering the user id '${id}' data at the time of logout in the report table for calculating total logged hours `, err.message);
                }
            });
        } // if the procedured not executed successfully then this else block code is executed
        else
        {
            console.log("Error occurr while entering the data into the users_activities table at the time of logout", err.message)            
        }
    });    
};


/**
 * The below block of code is getting the activity of a particular user based on the user id 
 */

exports.activitylogs = (req, res) =>
{
    const id = req.params.id // intializing the user id entered in the params to id variable
    // The below query will be calling the stored procedured "Strprocedureactitivty" for getting the activity if the user
    let Strprocedureactitivty = `CALL myactivitylogs('${id}')`;
    con.query(Strprocedureactitivty, (err, result) => // executing the above query
    {// if the procedured executed successfully then this if block code is executed
        if(result.length != 0)
        {
            console.log(` ### Myactivity logs for user id '${id}' are as follow :- ### `);
            res.send
            ({
                success : true,
                code : 200,
                message : 'My activity logs are successfully fetched', 
                data : result              
            });
        } // if the procedured not executed successfully then this else block code is executed
        else
        {
            console.log(` ### Error happened while fetching the data of my activity logs for the user id '${id}' ### `, err.message);
            res.send
            ({
                success : false,
                code : 400,
                message : 'There are no logs available.',                 
            });
        }
    });
};