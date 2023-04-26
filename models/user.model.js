const con = require('../configs/db.config'); // importing the database detail and assigning the con variable 
const constants = require('../utils/constants');
const time = require('../models/ticket.model');
const linkOrOtp = require('../utils/generatecodeorlink');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');  // importing the bcryptjs library

module.exports = class user
{
    constructor(){}

    // static addOne(name, author, price, adminid)
    // the below code is for creating or registering the user.
    
    static async addOne(name, email, mobile, date_of_birth, status, security_answer, password, confirm_password, role, module)
    { 
        try 
        {
            return await new Promise((resolve, reject)=>
            {      
                // the below for loop is adding the module id user id and role id in the permission table          
                for(let i = 0 ; i < module.length; i++)
                { 
                    // the below query is for  checking whehther the module names are correct or no
                    let selMQuery = `SELECT m.id FROM modules m WHERE m.module_name = '${module[i]}'`;
                    con.query(selMQuery, [module[i]], (err, resultma)=> // executing the above query
                    {
                        var module_id = [];
                        if(resultma.length != 0) // if there is module name available that was entered by the user, then this if block code will be executed
                        {
                            module_id[i] = resultma; // assigning the result variable data to a module array variable          
                            // the below query is just for checking whether that rolename is available or not that was entered by the user.
                            let selQuery = `SELECT * FROM roles r WHERE r.role_name = '${role}'`;
                            con.query(selQuery, [role], (err, result)=> // executing the above query
                            {
                                if(result.length != 0) // if the role is available then if block
                                {
                                    if(i == 0)
                                    {
                                        // the below insert query is for inserting into the user table. All the values are entered by the user in the req body
                                        let insQuery = `INSERT INTO users(name, email, mobile, date_of_birth, status, security_answer, password, confirm_password, role_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ${result[0].id})`;
                                        con.query(insQuery, [name, email, mobile, date_of_birth, status, security_answer, password, confirm_password], (err, result1)=> // executing the above query
                                        {
                                            if(result1.length != 0) // if the insert query is successfuly executed
                                            { 
                                                // finding the user on the basis of email that ws entered by the req email 
                                                let selFPEQuery = `SELECT * FROM users u WHERE u.email = '${email}'`;
                                                con.query(selFPEQuery, [email], (err, resultFPE)=> // executing the above query
                                                {
                                                    if(resultFPE.length != 0) // if we found the user based on the email then this if block code will be executed
                                                    {
                                                        // the below insert query is for inserting into the permission table.
                                                        let InsPQuery = `INSERT INTO permissions (user_Id, role_Id, module_Id) VALUES (${resultFPE[0].id},${result[0].id},${resultma[0].id})`;
                                                        con.query(InsPQuery, (err, resultPI) => // executing the above query
                                                        {
                                                            if(resultPI.length != 0) // if we inserted the data into the permission table, then this if block code will be executed 
                                                            {
                                                                //console.log("First into the permission table");
                                                                resolve('true'); // result sent back to the controller. From where it is called
                                                            }
                                                            else // IF any error encountered while inserting the data into the permission table
                                                            {
                                                                console.log("Error while entering the data into the Permission table for the first Time:- ", err);
                                                            }
                                                        });
                                                    }
                                                    else // if we did not found the user based on the email then this else block code will be executed
                                                    {
                                                        console.log("Error while searching for the user id after it's entered into the datbase for the first iteration");
                                                    }
                                                });                                                           
                                            }
                                            else // if we encounter any error while entering the data in the user 
                                            {
                                                console.log('Error while insert the user to the database')
                                                reject(err); // error will send back to the controller. From where it is called
                                            }                                
                                        });
                                        i = i + 1; // updating the i variable
                                    }
                                    else if(i <= module.length) // checking the i variable value is less than module length
                                    {
                                        // finding the user on the basis of email that ws entered by the req email 
                                        let selAPESQuery = `SELECT * FROM users u WHERE u.email = '${email}'`;
                                        con.query(selAPESQuery, [email], (err, resultAPES)=> // executing the above query
                                        {
                                            if(resultAPES != 0) // if we got the user we will go inside the if block code
                                            { 
                                                // the below insert query is for inserting into the permission table.
                                                let InsAPQuery = `INSERT INTO permissions (user_Id, role_Id, module_Id) VALUES (${resultAPES[0].id},${result[0].id},${resultma[0].id})`
                                                con.query(InsAPQuery, (err, resultAP) => // executing the above query
                                                {
                                                    if(resultAP.length != 0 ) // if we inserted the data into the permission table, then this if block code will be executed 
                                                    {
                                                        // console.log(`"${resultma[0].id}" time into the permission table`)
                                                        resolve('true'); // result sent back to the controller. From where it is called
                                                    }
                                                    else // IF any error encountered while inserting the data into the permission table
                                                    {
                                                        console.log(`Error while entering the data into the Permission table for the "${resultma[0].id}" iteration :- `, err);
                                                    }
                                                });
                                            }
                                            else // if we did not found the user based on the email then this else block code will be executed
                                            {
                                                console.log(`Error While serching the userId after it entered into the databse for the "${resultma[0].id}" :-`, err);
                                            }
                                        });
                                        i = i + 1; // updating the i variable
                                    }                                                                        
                                } 
                                else // if any encountered while searching for the rolename entered by the user
                                {
                                    console.log("This role is not available")
                                    reject(err); // error will send back to the controller. From where it is called                            
                                }
                            });
                        }
                    });
                }  
            });
        } 
        catch (error) 
        {
            console.log("Error While Signuping the user", error);                
        }
    }
// The below function is for forgot password.
    static async forPas(email, security_answer, password, confirm_password) // The values which we are taking from the user email, security_answer, password, and confirm_password
    {
        try 
        {
        return await new Promise((resolve, reject)=>
        { // finding the user on the basis of email that was entered by the user in req body  
            let selQuery = `SELECT * FROM users u WHERE u.email = '${email}' `;
                con.query(selQuery, [email], (err, result)=> // executing the above query
                {
                    if(result.length > 0) // if we got the user then if block code
                    { // finding the security answer on the basis of email that was entered by the user in req body 
                        let selQuery = `SELECT * FROM users u WHERE u.security_answer = '${security_answer}' AND u.email = '${result[0].email}'`;
                        con.query(selQuery, [security_answer], (err, result2)=> // executing the above query
                        {                            
                            if(result2.length != 0) // if the security answer and email both matches for same user then this if block code will be executed
                            { // The below query is for updating the user password on the basis of email and secruity answer. Both were already verified before
                                let userDetails = `UPDATE users u SET u.password = '${password}', u.confirm_password = '${confirm_password}' WHERE u.email = '${result2[0].email}' AND u.security_answer = '${result2[0].security_answer}'`;
                                con.query(userDetails, (err, result3)=> // executing the above query
                                {
                                    if(result3.length != 0 ) // If the update query is successfully executed
                                        {
                                            // console.log("Password updated successfully");
                                            resolve('true'); // result sent back to the controller. From where it is called
                                        }
                                        else // if any error encourted while updating the password
                                        {
                                            console.log("Error while updating the password")
                                            reject(err); // error will send back to the controller. From where it is called 
                                        }
                                });
                            }
                            else // If security answer is incorrect
                            {
                                console.log("Answer is not correct. Please enter the correct anwer");
                                reject(err); // error will send back to the controller. From where it is called 
                            } 
                        });                            
                    } // any kind of err encountered while searching the user
                    else
                    {
                        console.log("No user is present or incorrect email is submitted", err);
                        reject(err); // error will send back to the controller. From where it is called 
                    }
                });
        });
    } 
    catch(error) 
        {
          console.log("Error while updating the user password", error);   
        }
    }

    // The below function will give us back all the registered users in the database
    static getAll()
    {
        return new Promise((resolve, reject)=>
        { // The below query will give us all the users
            let selQuery = `SELECT u.id AS uID, u.name, u.email, u.mobile, u.status, r.role_name FROM users u, roles r WHERE u.role_Id = r.id;`;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result) // if we successfully fetched all the user, then this if block code will be executed
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // any encountered while fetching users details
                {
                    reject(err); // error will send back to the controller. From where it is called 
                }
            });
        });
    };

    // The below function will retunr us the details of the single user. We will need to enter the email in the request body

    static getoneemaildetails(email) // assigning the email variable with the email in the request
    {
        return new Promise((resolve, reject)=>
        { // the below query will return us all the details of the user who email will matched with the email entered in the body
            let selQuery = `SELECT * FROM users u WHERE u.email = '${email}'`;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result) // if we successfully fetched user detail, then this if block code will be executed
                {
                    resolve(result); // result sent back to the controller. From where it is called
                } 
                else // any error encountered while fetching user detail
                {
                    reject(err); // error will send back to the controller. From where it is called 
                }
            });
        });
    };

    // this function will check the security answer for the email id entered in the params
    static checksecurityanswerwithemailinparams(email, security_answer) // taking the security answer from the req body and email from req params and assign them to security_answer and email
    {
        return new Promise((resolve, reject) => 
        { // the below query will return us all the details of the user who will have email  and secuirty_answer matched
            let selQuery = `SELECT * FROM users u WHERE u.email = '${email}' AND u.security_answer = '${security_answer}' `;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result.length != 0) // If we got the user then this if block code will execute
                {
                    resolve(result); // if result > 0, then it is sent back to the controller. From where it is called                                  
                }
                else // otherwise this else code will be executed
                {
                    resolve(result); // if result = 0, then it is sent back to the controller. From where it is called 
                }
            });            
        });
    };
    // this function will be updating the password on the bassis of email entered in the params.
    static updatepasswordonthebasisofemailinparams(email, password, confirm_password)  // taking the password and confirm passsword from the user in the req body and assigning it to confirm password and password variable respectively. 
    {
        return new Promise((resolve, reject) => 
        { // The below query will going to update password and cofirmpassword for the user whose email got matched with the user email present in the params
            let UpdateQuery = `UPDATE users u SET u.password ='${password}', u.confirm_password ='${confirm_password}' WHERE u.email = '${email}' `;
            con.query(UpdateQuery, (err, result)=> // executing the above query
            {
                if(result.length != 0)  // If update query is successfully executed then if block code is executed
                { 
                    resolve('true'); // result sent back to the controller. From where it is called
                }
                else // If update query is not successfully executed then else block code is executed
                {
                    reject(err); // error will send back to the controller. From where it is called 
                }
            });
        });
    };
    // the below function will give us all the active engineer present in the database.
    // There are two types of status one is active and another one is inactive
    static getallactiveengineer()
    {
        return new Promise((resolve, reject)=>
        {// the below code will give us all the active engineer
            let selQuery = `SELECT u.id AS User_id, u.email AS Engineer_email FROM users u, roles r WHERE u.status = '${constants.status.active}' AND r.role_name = '${constants.role.engineer}' AND u.role_Id = r.id;`;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result) // If we successfully get all the active engineer then this if block code will execute
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // any error encountered while fetching the details of all the active users
                {
                    reject(err); // error will send back to the controller. From where it is called 
                }
            });
        });
    };    
    // The below code will be used for updating the user status (ACTIVE, INACTIVE);;
    static updateuserstatus(id) // This will be done on the basis of user id in the paramas
    {
        return new Promise((resolve, reject) =>
        {
            try 
            { // the below code will give us the user detail who have that same userid
                let SelUserId = `SELECT * FROM users u WHERE u.id = '${id}' `;
                con.query(SelUserId, (err, result) => // executing the above query
                {
                    if(result.length) // If we successfully found the user detail. Then this if block code
                    { // Below condition is checking the status of the user is active before going into the if block code
                        if(result[0].status == constants.status.active) // if status active, then this if block code
                        {
                            console.log(" ### User status changed to INACTIVE ### ");
                            // the below query is for updating the user status from active to inactive on the user id which is present in the params
                            let UpdateQuery = `UPDATE users u SET u.status = '${constants.status.inactive}' WHERE u.id = '${id}' `;
                            con.query(UpdateQuery,(err, result1) => // executing the above query
                            {// After the update query is successfully executed then 
                                if(result1.length != 0) // going inside this if block code
                                {
                                    console.log(`Status of user_id '${id}' is changed to ${constants.status.inactive}`);
                                    // the below select query will giving us the detail of the user after updating in the response. because it is required in the front for changing in th web page 
                                    let SelQuery = `SELECT * FROM users u WHERE u.status = '${constants.status.inactive}' AND u.id = '${id}'`;
                                    con.query(SelQuery, (err, result2) => // executing the above query
                                    {
                                        if(result2.length != 0) // If the select query is after update is running or executed successfully, then this if block code will be executed
                                            {
                                                resolve(result2); // result sent back to the controller. From where it is called
                                            }
                                            else // Any error encountered while executing select query after update query
                                            {
                                                reject(err) // error will send back to the controller. From where it is called 
                                            }
                                    });
                                }
                                else // if any error encountered while updating the user status 
                                {
                                    reject(err); // error will send back to the controller. From where it is called 
                                }                                
                            });
                        }
                        else // if status inactive, then this if block code
                        {
                            console.log(" ### User status changed to ACTIVE ### ");
                            // the below query is for updating the user status from inactive to active on the user id which is present in the params
                            let UpdateQuery = `UPDATE users u SET u.status = '${constants.status.active}' WHERE u.id = '${id}' `;
                            con.query(UpdateQuery,(err, result1) => // executing the above query
                            {
                                if(result1.length != 0)// If the update query is successfully executed. Then this if block code
                                {
                                    console.log(`Status of user_id '${id}' is changed to ${constants.status.active}`);
                                    // the below select query will giving us the detail of the user after updating in the response. because it is required in the front for making changes in th web page
                                    let SelQuery = `SELECT * FROM users u WHERE u.status = '${constants.status.active}' AND u.id = '${id}'`;
                                    con.query(SelQuery, (err, result2) => // executing the above query
                                    {
                                        if(result2.length != 0) // If the select query is after update is running or executed successfully, then this if block code will be executed
                                            {
                                                resolve(result2); // result sent back to the controller. From where it is called
                                            }
                                            else  // Any error encountered while executing select query after update query
                                            {
                                                reject(err) // error will send back to the controller. From where it is called 
                                            }
                                    });
                                }
                                else // if any error encountered while updating the user status
                                {
                                    reject(err); // error will send back to the controller. From where it is called 
                                }
                            });
                        }
                    } // Any error encountered while searching for the users on the basis of user id in the params
                    else
                    {
                        reject(err); // error will send back to the controller. From where it is called 
                    }
                });                
            } 
            catch(err)
            {
                console.log(" ### Internal servor error while updating the user status ### ", err);
                reject(err); // error will send back to the controller. From where it is called 
            }
        });
    };

    
    // The below function will give us back all the registered users in the database
    static getalluserwithouttheloggedone(id)
    {
        return new Promise((resolve, reject)=>
        { // The below query will give us all the users
            let selQuery = `SELECT u.id AS uID, u.name, u.email, u.mobile, u.status, r.role_name FROM users u, roles r WHERE u.role_Id = r.id AND u.id != '${id}' `;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result) // if we successfully fetched all the user, then this if block code will be executed
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // any encountered while fetching users details
                {
                    reject(err); // error will send back to the controller. From where it is called 
                }
            });
        });
    };

    static async checkOTP(id, OTP)
    {
        return new Promise (async (resolve, reject) =>
        {
            try
            {
                let selQuery = `SELECT * FROM otpstores os WHERE os.user_Id = '${id}' AND os.status = '${constants.status.active}' AND os.updated_at IS NULL`;
                con.query(selQuery, async (err , result) =>
                {
                    if(result)
                    {
                        bcrypt.compare(OTP, result[0].otp, (err, result1) =>
                        {
                            if(result1)
                            {
                                console.log("OTP matched");
                                let selQuery = `SELECT * FROM otpstores os WHERE os.user_Id = '${id}' AND os.status = '${constants.status.active}' AND os.updated_at IS NULL`;
                                con.query(selQuery, (err, result2) =>
                                {
                                    if(result2)
                                    {
                                        let UpdateQuery = `UPDATE users u SET u.email_verified = '${constants.status.verified}' WHERE u.id = '${id}' `;
                                        con.query(UpdateQuery, (err, result3) =>
                                        {
                                            if(result3)
                                            {
                                                console.log(`Email updated from '${constants.status.notverified}' to '${constants.status.verified}'`);
                                                resolve('true'); 
                                            }    
                                            else
                                            {
                                                console.log(`Error while updating email from '${constants.status.notverified}' to '${constants.status.verified}'`, err)
                                                resolve('err');
                                            }                             
                                        });
                                    }
                                    else
                                    {
                                        console.log('Error while fetching the active OTP after it is matched', err)
                                        resolve('expired-OTP')
                                    }
                                });                          
                            }
                            else
                            {
                                console.log("OTP is not matched", err);
                                resolve('wrong-OTP') 
                            }
                        });
                    }
                    else
                    {
                        console.log('Error while fetching the active OTP', err);
                        resolve('err');
                    }
                });
            }
            catch(err)
            {
                console.log(`Error while validating the OTP`, err);                
            }
        });
    };

    static async sendOTPcodetoemail(id, email)
    {
        return new Promise(async (resolve, reject)=>
        {
            try 
            {
                var OTP = linkOrOtp.GenerateSixDigitOTPcode();
                console.log(`The OTP is ${OTP}`);
                let result = await sendEmail.SendGeneratedOTPCode(email, OTP);
                if(result)
                {
                    // console.log('Email sent successfully'); // You can return a response or perform any other action here
                    let InsQuery = `INSERT INTO otpstores(user_id, otp, expired_at) VALUES ('${id}', '${bcrypt.hashSync((OTP.toString()), 8)}', '${time.convertDatePickerTimeToMySQLTime(time.minutesAdd(constants.day_or_minutes_protection_policy_numbers.number_of_minutes_after_OTP_will_blocked))}' )`;
                    con.query(InsQuery, (err, result) =>
                    {
                        if(result.length != 0)
                        { 
                            // console.log('OTP stored successfully'); // You can return a response or perform any other action here
                            resolve(true)                            
                        }
                        else
                        {
                            console.log('OTP not stored', err.message); // You can return a response or perform any other action here
                            reject(err)
                        }
                    });
                }
                else
                {
                    console.log('Email not sent'); // You can return a response or perform any other action here
                    reject(err)
                }        
            } 
            catch(error)
            {
                console.error('Error sending email:', error); // You can handle the error and return an appropriate response or perform any other action here
            }            
        });        
    };


// ------------------------------------------------------------------------------------------------------------------------------- // 
    

    static sendresetlinkforchangingthepassword(password, id, email)
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                var token = linkOrOtp.token(password, id, constants.purpose.Passwordreset);
                var link = linkOrOtp.CreateLink(constants.purpose.Passwordreset,token);
                if(link)
                {
                    console.log(`The Link is ${link}`);
                    //console.log(email)
                    var sendLink = await sendEmail.SendGeneratedValue(email, link, constants.purpose.text1pr);
                    console.log(sendLink)
                    if(sendLink)
                    {
                        // console.log(`Link send successfully`);
                        resolve(link);
                    }
                    else
                    {
                        console.log(`Error while sending link`);
                        resolve(error);
                    }
                }
                else
                {
                    console.log('Error While generating the link');
                    resolve(error);
                }      
            } 
            catch(error)
            {
                resolve(error);
            }            
        });
    };

    

    static async resetpasswordthroughlink(id, password, confirm_password) 
    {
        return new Promise (async (resolve, reject) =>
        {
            try 
            {
                let UpdateQuery = `UPDATE users u SET u.password ='${password}', u.confirm_password ='${confirm_password}' WHERE u.id = '${id}' `;
                con.query(UpdateQuery, (err, result) =>
                {
                    if(result.length != 0)  // If update query is successfully executed then if block code is executed
                    { 
                        resolve('true'); // result sent back to the controller. From where it is called
                    }
                    else // If update query is not successfully executed then else block code is executed
                    {
                        reject(err); // error will send back to the controller. From where it is called 
                    }
                }); 
            }
            catch(error)
            {
                reject(err);                                
            }
        });
    };

    static async sendlinkforemailverfication(verification, id, email)  
    {
        return new Promise (async (resolve, reject) =>
        {
            try
            {
                var token = linkOrOtp.token(verification, id, constants.purpose.emailVerfication);
                var link = linkOrOtp.CreateLink(constants.purpose.emailVerfication, token);
                if(link)
                {
                    // console.log(`The Link is ${link}`);
                    var sendLink = await sendEmail.SendGeneratedValue(email, link, constants.purpose.text2ev);
                    if(sendLink)
                    {
                        console.log(`Link send successfully`);
                        resolve(link);
                    }
                    else
                    {
                        console.log(`Error while sending link`);
                        resolve(error);
                    }
                }
                else
                {
                    resolve(error);
                }                
            } 
            catch(error)
            {
                resolve(error);
            }
        });
    };

    static async verifyemailthroughlink(id)
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let UpdateQuery = `UPDATE users u SET u.email_verified = '${constants.status.verified}' WHERE u.id = '${id}' `;
                con.query(UpdateQuery, (err, result) =>
                {
                    // console.log(result)
                    if(result.length != 0)  // If update query is successfully executed then if block code is executed
                    { 
                        resolve(true); // result sent back to the controller. From where it is called
                    }
                    else // If update query is not successfully executed then else block code is executed
                    {
                        reject(err); // error will send back to the controller. From where it is called 
                    }
                });
            }
            catch(error)
            {
                resolve(error);
            }
        });
    };


};

 

 