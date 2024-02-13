const date = require('date-and-time'); // importing the date-and-time library and assigning it to the date variables
const { v4 : uuidv4 } = require('uuid'); // import uuid module for generating unique identifier 
const con = require('../configs/db.config');  // importing the database details
const constants = require('../utils/constants'); // Here we are importing the constants file details and intializing it into the constants variable
const sendEmail = require('../utils/sendEmail');

const main = class ticket
{
    // constructor(){}
    // the below code is for creating the ticket.  
        
    static async addnewticket(title, description, reporter, assignee, created_at, updated_at, expired_at, files)
    {
        try
        {
            return await new Promise(async (resolve, reject)=>
            { 
                // the below line of query will be finding the user in the database or that that user is active or inactive. Because only the active user can create the ticket. The person who is creating the ticket there email is in the reporter variable.
                let selRQuery = `SELECT * FROM users u WHERE u.email = '${reporter}' AND u.status = '${constants.status.active}' `; // reporter = ticket creator email and process.env.adminstatus = active
                con.query(selRQuery, [reporter], (err, result1) => // executing the above query
                {
                    if(result1.length != 0) // if that reporter email is found then this if block of code will be executed
                    { // the below line has the query. For finding the assignee email or engineer email in the database.
                        let selAQuery = `SELECT u.id AS idu, r.id AS roleid FROM users u, roles r WHERE u.role_Id = r.id AND u.status = '${constants.status.active}' AND r.role_name = '${constants.role.engineer}' AND u.email = '${assignee}' `;
                        con.query(selAQuery, [assignee], (err, result2) => // executing the above query
                        {
                            if(result2.length != 0) // if that assignee or engineer email is found then this if block of code will be executed
                            { 
                                if(reporter == assignee) // Here we are checking. Whether reporter and assignee email are same
                                { // because any one cannot assign it to themself
                                    console.log("You cannot assignee yourself");
                                    reject(err); // error will send back to the controller. From where it is called
                                }
                                else // If both email is different. And all the other conditions are successfully passed then this else block of code will be executed
                                {   // the below line of query will be used to insert  into the ticket table 
                                    let file = files.file;
                                    // console.log(file);
                                    let fileExtension = file.name.split('.').pop().toLowerCase(); // get the file extension
                                    if (['doc', 'jpeg', 'xlsx', 'png'].includes(fileExtension)) 
                                    {
                                        let filename = uuidv4() + '_' + file.name; // generate unique identifier and append to the file name
                                        console.log(filename);
                                        file.mv('./attachments/' +filename, (err) =>
                                        {
                                            if(err)
                                            {
                                                console.log("Error happen while storing the upload file in the attachments folder", err);
                                            }
                                            else
                                            {
                                                let insQuery = `INSERT INTO tickets(title, description, reporter, assignee, image_name, created_at, updated_at, expired_at, reporter_Id, assignee_Id) VALUES (?,?,?,?,?,?,?,?, '${result1[0].id}', '${result2[0].idu}')`;
                                                con.query(insQuery, [title, description, reporter, assignee, filename, (nowd()), updated_at, (DAYADD(2))], async (err, result3)=>
                                                // exceuting the above query. All the values are entered by the user in the response
                                                { 
                                                    if(result3.length != 0) // If ticket successfully created
                                                    {
                                                        let body = `This is to notify that "${result1[0].name}" with user_Id "${result1[0].id}" has created a ticket with the title "${title}" and description "${description}". Please review and resolve it at the earliest.`;
                                                        let notify = await sendEmail.SendGeneratedValue(assignee, constants.subject.tan, body)
                                                        if(notify)
                                                        {
                                                            let selticId = `SELECT t.id AS ticid FROM tickets t WHERE t.title = '${title}' AND t.description = '${description}' AND t.reporter = '${reporter}' AND t.assignee = '${assignee}' AND  t.created_at = '${nowd()}'`;
                                                            con.query(selticId, (err, result4) =>
                                                            {      
                                                                if(result4.length == 0)
                                                                {
                                                                    console.log('Error happened while fetching the ticket id', err);
                                                                }
                                                                else
                                                                {
                                                                    console.log('File upload');
                                                                    let insintotLogg = `CALL insertintotickets_activities('sdssvs', '${result4[0].ticid}', '${result1[0].id}', '${result2[0].idu}', '${constants.activity.created}', '${constants.status.open}', '${constants.priority.normal}', 'This is just for the checking purpose')`;
                                                                    con.query(insintotLogg, (err, result5) =>
                                                                    {
                                                                        if(result5.length == 0)
                                                                        {
                                                                            console.log("Error happen while inserting the data into the ticket logged", err.message)
                                                                        }
                                                                        else
                                                                        {
                                                                            resolve('true'); // result sent back to the controller. From where it is called
                                                                            console.log(`Data entered into the "ticket_logged" table while creating the ticket id '${result4[0].ticid}' .`);
                                                                            console.log("Ticket created successfully");
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                        else
                                                        {
                                                            console.log("Error while notifing the assignee that a ticket is being assigned", err.message);
                                                            reject(err);
                                                        }
                                                    }
                                                    else // encountered any kind of error while creating the ticket
                                                    {   
                                                        console.log("Error while creating the ticket", err.message);
                                                        reject(err); // error will send back to the controller. From where it is called
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else
                                    {
                                        console.log(`Invalid file type. Allowed types are .doc, .jpeg, .xlsx`);  
                                        reject(err);
                                    }
                                }
                            }
                            else // If ticket assignee email is not found. Then this else block of code is executed
                            {
                                console.log("Assignee must be a active engineer only", err)
                                reject(err); // error will send back to the controller. From where it is called
                            }
                        });
                    }
                    else // If ticket creator email is not found. Then this else block of code is executed
                    {
                        console.log("Reporter email id is not correct or it will be a inactive user", err);
                        reject(err); // error will send back to the controller. From where it is called
                    }
                });
            });
        }
        catch(error)
        {
            // console.log("This email is not registered with us", error);
        }
    };
    
    // From this block of code we will get all the ticket that are available in the ticket table 
    static getalltic()
    {
        return new Promise((resolve, reject)=>
        {   // the below code will give us all the data available in the ticket table
            let selQuery = `SELECT * FROM tickets`;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result)// if successfully fetched all the ticket
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // or encountered some error while finding all the details in the ticket
                {
                    reject(err); // error will send back to the controller. From where it is called
                }
            });
        });
    };
    
    // From this block of code we will get all the resolved tickets that are available in the ticket table 
    static getallresolvedticket()
    {
        return new Promise((resolve, reject)=>
        {   // the below code will give us all the ticket resolved data available in the ticket table
            let selQuery = `SELECT * FROM tickets t WHERE t.status = '${constants.status.resolved}'`;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result) // if successfully fetched all the resolved ticket
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // or encountered some error while fetching all the resolved ticket in the ticket table
                {
                    reject(err); // error will send back to the controller. From where it is called
                }
            });
        });
    };

    // the below function will give us all the ticet that are assigned to a particular engineer. We need assignee email in params
    static getassignedticket(assignee) // getting the assignee email in assignee variabel
    {
        return new Promise((resolve, reject) =>
        {
            try
            { // the below query is checking whetrher that user is a regietered user and engineer
                let selID = `SELECT * FROM users u WHERE u.email = '${assignee}'`;
                con.query(selID, (err, result1) => // executing the above query 
                {                    
                    if(result1.length != 0) // if there is result
                    { // the below query will give us the engineer information along with all the ticket assigned to that engineer
                        let selQuery = `SELECT u.id as user_Id , u.name, u.email, r.role_name, t.id as ticket_Id, t.title, t.description, t.status, t.created_at, t.updated_at, t.reporter, t.priority 
                                        FROM tickets t, roles r, users u 
                                        WHERE u.id = '${result1[0].id}'
                                        AND u.role_Id = r.id
                                        AND u.id = t.assignee_Id`;
                        con.query(selQuery, (err, result)=>  // executing the above query 
                        { 
                            if(result.length != 0) // if we suucessfully fetched the engineer details
                            {
                                resolve(result); // if result > 0, then it is sent back to the controller. From where it is called 
                            }
                            else
                            {
                                resolve(result); // if result = 0, then it is sent back to the controller. From where it is called   
                            }
                        });
                    } // any error encounter while fetching ticket assigned to a particular engineer
                    else
                    {
                        console.log(" ^^^ Error While finding the Email id of the assignee which was submitted in the params ^^^ ", err);
                    }
                });
            }
            catch(err)
            {
                console.log(" %%% Internal Server error while fetchingthe assigned ticket to a engineer in the ticket model %%%", err);
                // reject(err);
            }
        });
    };
    
    // the below function will give us all the ticket created by the particular user. User can be any one. We will just need the email of that user in the params
    static getcreatedticket(reporter) // The user email enteredin the params are now in the reporter variable
    {
        return new Promise((resolve, reject) =>
        {
            try
            { //the belowquery will find whether that reporter ius genuine one or not 
                let selID = `SELECT * FROM users u WHERE u.email = '${reporter}'`;
                con.query(selID, (err, result1) => // executing the above query 
                {                    
                    if(result1.length != 0)// if there is result
                    { // the below query will give us the user information along with all the ticket created by that user.
                        let selQuery = `SELECT u.id AS Reporter_Id , 
                                        u.name AS Reporter_Name, 
                                        u.email AS Reporter_email,
                                        r.role_name AS Reporter_RoleName, 
                                        t.id AS ticket_Id, t.title, t.description, t.status, t.created_at, t.updated_at, t.assignee, t.priority 
                                        FROM tickets t, roles r, users u 
                                        WHERE u.id = '${result1[0].id}'
                                        AND u.role_Id = r.id
                                        AND u.id = t.reporter_Id`;
                        con.query(selQuery, (err, result)=> // executing the above query
                        {
                            if(result.length != 0) // if we suucessfully fetched the engineer details
                            {
                                resolve(result); // if result > 0, then it is sent back to the controller. From where it is called 
                            }
                            else
                            {
                                resolve(result); // if result = 0, then it is sent back to the controller. From where it is called 
                            }
                        });
                    }// any error encounter while fetching ticket created by a particular user
                    else
                    {
                        console.log(" ^^^ Error While finding the Email id of the reporter which was submitted in the params ^^^ ", err);
                    }
               });
            }
            catch(err)
            {
                console.log(" %%% Internal Server error while fetchingthe assigned ticket to a engineer in the ticket model %%%", err);
                reject(err); // error will send back to the controller. From where it is called
            }
        });
    };

    // The below function is for updating the ticket status. From Open -> Pending -> Working -> Resolved. Closed can only be done by the admins. All this happens on the ticket id
    static engineerstartedworkignontheticket(id, message) // we will get the ticket id through the params and message for storing the remarks in the req body
    {
        return new Promise((resolve, reject) =>
        {
            try 
            { // the below query is to find the ticket present or not on the basis of id entered in the params. 
                let selID = `SELECT * FROM tickets t WHERE t.id = '${id}'`;
                con.query(selID, (err, resultU) => // executing the above query 
                {
                    if(resultU.length != 0) // if ticket available then if block
                    {
                        // resolve('true');
                        if(resultU[0].status == constants.status.open) // if ticket status is open. The it will updated to Pending status 
                        {
                                console.log(" ### Ticket status is changed to pending ###");
                                // the below query is for updating the ticket based on the id and open status
                                let UpdateQuery = `UPDATE tickets t SET t.status ='${constants.status.pending}'WHERE t.id = '${id}' `;
                                con.query(UpdateQuery, (err, result1) => // executing the above query 
                                {
                                    if(result1.length != 0) // if ticket updated then if block
                                    { // the below line is for insewrting into the message table bevause we are also storing the a remark. 
                                        let InsQuery = `INSERT INTO messages(assignee_Id, reporter_Id, ticket_Id ,message, sender_role) VALUES ('${resultU[0].assignee_Id}', '${resultU[0].reporter_Id}', '${id}', '${message}' , '${constants.role.engineer}')`;
                                        con.query(InsQuery, (err, result2) => // executing the above query 
                                        {
                                            if(result2.length != 0) // if data inserted into the message table then if block code executed
                                            {
                                                console.log(" ### Data Entered in the message table for pending status ###");
                                                console.log(`Status of ticket id '${id}' is changed to ${constants.status.pending}`);
                                                // the below query is to display the ticket data in the response because update query doesn't give the whole data. It is done on the basis of ticket id entered in the params .
                                                let SelQuery = `SELECT * FROM tickets t WHERE t.status = '${constants.status.pending}' AND t.id = '${id}' `;
                                                con.query(SelQuery, (err, resultS) => // executing the above query 
                                                {
                                                    if(resultS.length != 0) // if ticket available then if block
                                                    {
                                                        let insintotLogg = `CALL insertintotickets_activities('sdssvs', '${id}', '${resultU[0].reporter_Id}', '${resultU[0].assignee_Id}', '${constants.activity.updated}', '${constants.status.pending}', '${constants.priority.normal}', 'This is just for the checking purpose')`;
                                                        con.query(insintotLogg, (err, result5) =>
                                                        {
                                                            if(result5.length == 0)
                                                            {
                                                                console.log("Error happen while inserting the data into the ticket logged", err.message)
                                                            }
                                                            else
                                                            {
                                                                console.log(`Data entered into the "ticket_logged" table while changing the status of ticket id '${id}' to '${constants.status.pending}'.`);
                                                                resolve(resultS); // result sent back to the controller. From where it is called
                                                            }
                                                        });                                            
                                                    }
                                                    else
                                                    {
                                                        reject(err); // err sent back to the controller. From where it is called
                                                    }
                                                });
                                            } // error encountered while enetereding the data into the message table
                                            else
                                            {
                                                reject(err) // err sent back to the controller. From where it is called
                                            }
                                        });
                                    }
                                    else // Error encountered while updating the ticket status from open to pending
                                    {
                                        reject(err); // err sent back to the controller. From where it is called
                                    }
                                });
                        }
                        else if(resultU[0].status == constants.status.pending)  // if ticket status is pending. The it will updated to working status 
                        {
                            console.log(" ### Ticket status is changed to working ###");
                            // the below query is for updating the ticket based on the id and PENDING status
                            let UpdateQuery = `UPDATE tickets t SET t.status ='${constants.status.working}'WHERE t.id = '${id}' `;
                            con.query(UpdateQuery, (err, result) => // executing the above query 
                            {
                                if(result.length != 0) // if ticket updated then if block
                                { // the below line is for inserting into the message table because we are also storing the a remark. 
                                    let InsQuery = `INSERT INTO messages (assignee_Id, reporter_Id, ticket_Id , message, sender_role) VALUES ( '${resultU[0].assignee_Id}', '${resultU[0].reporter_Id}', '${id}', '${message}', '${constants.role.engineer}')`;
                                    con.query(InsQuery, (err, result2) => // executing the above query
                                    {
                                        if(result2.length != 0) // if data inserted into the message table then if block code executed
                                        {
                                            console.log(" ### Data Entered in the message table for working Status ###");
                                            console.log(`Status of ticket id '${id}' is changed to ${constants.status.working}`);
                                            // the below query is to display the ticket data in the response because update query doesn't give the whole data. It is done on the basis of ticket id entered in the params .
                                            let SelQuery = `SELECT * FROM tickets t WHERE t.status = '${constants.status.working}' AND t.id = '${id}' `;
                                            con.query(SelQuery, (err, resultS) =>// executing the above query 
                                            {
                                                if(resultS.length != 0) // if ticket available then if block
                                                {
                                                    let insintotLogg = `CALL insertintotickets_activities('sdssvs', '${id}', '${resultU[0].reporter_Id}', '${resultU[0].assignee_Id}', '${constants.activity.updated}', '${constants.status.working}', '${constants.priority.normal}', 'This is just for the checking purpose')`;
                                                    con.query(insintotLogg, (err, result5) =>
                                                    {
                                                        if(result5.length == 0)
                                                        {
                                                            console.log("Error happen while inserting the data into the ticket logged", err.message)
                                                        }
                                                        else
                                                        {
                                                            console.log(`Data entered into the "ticket_logged" table while updating the status of ticket id '${id}' to '${constants.status.working}'.`);                                                                                
                                                            resolve(resultS); // result sent back to the controller. From where it is called
                                                        }
                                                    });
                                                }
                                                else 
                                                {
                                                    reject(err);  // err sent back to the controller. From where it is called
                                                }
                                            });
                                        } // error encountered while enetereding the data into the message table
                                        else 
                                        {
                                            reject(err);  // err sent back to the controller. From where it is called
                                        }
                                    });                                                                       
                                } // Error encountered while updating the ticket status from pending to working
                                else
                                {
                                    reject(err);  // err sent back to the controller. From where it is called
                                }
                            });
                        }
                        else if(resultU[0].status == constants.status.working) // if ticket status is working. The it will updated to resolved status 
                        {
                            console.log(" ### Ticket status is changed to resolved ###");
                            // the below query is for updating the ticket based on the id and working status
                            let UpdateQuery = `UPDATE tickets t SET t.status = '${constants.status.resolved}' WHERE t.id = '${id}' `;
                            con.query(UpdateQuery, (err, result) =>// executing the above query 
                            { 
                                if(result.length != 0)  // if ticket updated then if block
                                { // the below line is for inserting into the message table because we are also storing the a remark. 
                                    let InsQuery = `INSERT INTO messages (assignee_Id, reporter_Id, ticket_Id , message, sender_role) VALUES ( '${resultU[0].assignee_Id}', '${resultU[0].reporter_Id}', '${id}', '${message}', '${constants.role.engineer}')`;
                                    con.query(InsQuery, (err, result2) =>// executing the above query 
                                    {
                                        if(result2.length != 0) // if data inserted into the message table then if block code executed
                                        {
                                            console.log(" ### Data Entered in the message table for Resolved Status ###");
                                            console.log(`Status of ticket id '${id}' is changed to ${constants.status.resolved}`);
                                            // the below query is to display the ticket data in the response because update query doesn't give the whole data. It is done on the basis of ticket id entered in the params .
                                            let SelQuery = `SELECT * FROM tickets t WHERE t.status = '${constants.status.resolved}' AND t.id = '${id}' `;
                                            con.query(SelQuery, (err, resultS) =>// executing the above query 
                                            {
                                                if(resultS.length != 0) // if ticket available then if block
                                                {
                                                    let insintotLogg = `CALL insertintotickets_activities('sdssvs', '${id}', '${resultU[0].reporter_Id}', '${resultU[0].assignee_Id}', '${constants.activity.updated}', '${constants.status.resolved}', '${constants.priority.normal}', 'This is just for the checking purpose')`;
                                                    con.query(insintotLogg, (err, result5) =>
                                                    {
                                                        if(result5.length == 0)
                                                        {
                                                            console.log("Error happen while inserting the data into the ticket logged", err.message)
                                                        }
                                                        else
                                                        {
                                                            console.log(`Data entered into the "ticket_logged" table while updating the status of ticket id '${id}' to '${constants.status.resolved}'.`);
                                                            resolve(resultS); // result sent back to the controller. From where it is called
                                                        }
                                                    });
                                                }
                                                else
                                                {
                                                    reject(err); // err sent back to the controller. From where it is called
                                                }
                                            });
                                        } // error encountered while enetereding the data into the message table
                                        else
                                        {
                                            reject(err); // err sent back to the controller. From where it is called
                                        }
                                    });
                                } // Error encountered while updating the ticket status from working to resolved
                                else
                                {
                                    reject(err);// err sent back to the controller. From where it is called
                                }
                            });
                        }
                        else if(resultU[0].status == constants.status.resolved) // if the ticket status is resolved. 
                        {
                            console.log(" ### Only Admin can close the ticket ###");
                             // the below query is to display the ticket data in the response because update query doesn't give the whole data. It is done on the basis of ticket id entered in the params .
                            let SelQuery = `SELECT * FROM tickets t WHERE t.status = '${constants.status.resolved}' AND t.id = '${id}' `;
                            con.query(SelQuery, (err, resultS) => // executing the above query
                            {
                                if(resultS.length != 0) // if ticket available then if block
                                {
                                    resolve(resultS); // result sent back to the controller. From where it is called
                                }
                                else
                                {
                                    reject(err); // err sent back to the controller. From where it is called
                                }
                            });
                        }
                    }
                    else
                    {
                        reject(err); // err sent back to the controller. From where it is called
                    }                
                });                
            }
            catch(err)
            {
                console.log(" ### Internal servor error while updating the ticket ### ", err);
                reject(err);   // err sent back to the controller. From where it is called              
            }        
        });
    };
    
    // the below function is for updating the ticket status from RESOLVED ---> CLOSED. Note :- This can only be done by the ADMIN users and this is done on the basis of ticket id 
    static adminwillchangetheticketstatustoclose(id, message) // we are getting the ticket id from the params and message from the req body
    {
        return new Promise((resolve, reject) =>
        {
            try
            { // the below query is for getting the ticket on basis of ticket id and resolved status
                let selID = `SELECT * FROM tickets t WHERE t.id = '${id}' AND t.status = '${constants.status.resolved}'`;
                con.query(selID, (err, resultU) => // executing the above query
                { // again cheking whether that ticket is resolved because we can hit the same ticket id more than one time but only once the status will be updated
                    if(resultU.length != 0 && resultU[0].status == constants.status.resolved)
                    { // // the below query is for updating the ticket based on the id and resolved status
                        let UpdateQuery = `UPDATE tickets t SET t.status ='${constants.status.closed}' WHERE t.id = '${id}' `;
                        con.query(UpdateQuery, (err, result1) => // executing the above query
                        {
                            if(result1.length != 0) // if ticket updated then if block
                            { // the        below line is for inserting into the message table because we are also storing the a remark. 
                                let InsQuery = `INSERT INTO messages(assignee_Id, reporter_Id, ticket_Id ,message, sender_role) VALUES ( '${resultU[0].assignee_Id}', '${resultU[0].reporter_Id}', '${id}', '${message}', '${constants.role.admin}')`;
                                con.query(InsQuery, (err, result2) => // executing the above query
                                {
                                    if(result2.length != 0)  // if data inserted into the message table then if block code executed
                                        {
                                            console.log(" ### Data Entered in the message table for closed Status ###");
                                            console.log(`Status of ticket id '${id}' is changed to ${constants.status.closed} by the admin`);
                                            // the below query is to display the ticket data in the response because update query doesn't give the whole data. It is done on the basis of ticket id entered in the params .
                                            let SelQuery = `SELECT * FROM tickets t WHERE t.status = '${constants.status.closed}' AND t.id = '${id}' `;
                                            con.query(SelQuery, (err, resultS) => // executing the above query
                                            {
                                                if(resultS.length != 0) // if ticket available then if block
                                                {
                                                    let insintotLogg = `CALL insertintotickets_activities('sdssvs', '${id}', '${resultS[0].reporter_Id}', '${resultS[0].assignee_Id}', '${constants.activity.closed}', '${constants.status.closed}', '${constants.priority.done}', 'This is just for the checking purpose')`;
                                                    con.query(insintotLogg, (err, result5) =>
                                                    {
                                                        if(result5.length == 0)
                                                        {
                                                            console.log("Error happen while inserting the data into the ticket logged", err.message)
                                                        }
                                                        else
                                                        {
                                                            console.log(`Data entered into the "ticket_logged" table while closing the ticket id '${id}' .`);
                                                            console.log("Ticket created successfully");
                                                            resolve(resultS);  // result sent back to the controller. From where it is called
                                                        }
                                                    });                                                    
                                                }
                                                else
                                                {
                                                    reject(err); // err sent back to the controller. From where it is called
                                                }
                                            });
                                        }  // error encountered while enetereding the data into the message table
                                        else
                                        {
                                            reject(err); // err sent back to the controller. From where it is called
                                        }
                                });
                            } // Error encountered while updating the ticket status from working to resolved
                            else
                            {
                                reject(err); // err sent back to the controller. From where it is called
                            }
                        });                        
                    }
                    else
                    {
                        resolve(resultU);  // result sent back to the controller. From where it is called
                    }
                });                
            }
            catch(error)
            {
                console.log(" ### Error while setting the ticket to closed ### ", error);
                reject(err); // err sent back to the controller. From where it is called                       
            }
        });
    };

    static priorityspetourgentbutworknotstarted()
    {
        return new Promise((resolve, reject)=>
        {   // the below code will give us all the ticket resolved data available in the ticket table
            let selQuery = `SELECT * FROM tickets t WHERE t.priority = '${constants.priority.urgent}' AND t.status = '${constants.status.open}' OR t.status = '${constants.status.pending}'`;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result) // if successfully fetched all the resolved ticket
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // or encountered some error while fetching all the resolved ticket in the ticket table
                {
                    reject(err); // error will send back to the controller. From where it is called
                }
            });
        });
    };

    static getallurgentpriorityticket()
    {
        return new Promise((resolve, reject)=>
        {   // the below code will give us all the ticket resolved data available in the ticket table
            let selQuery = `SELECT * FROM tickets t WHERE t.priority = '${constants.priority.urgent}'`;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result) // if successfully fetched all the resolved ticket
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // or encountered some error while fetching all the resolved ticket in the ticket table
                {
                    reject(err); // error will send back to the controller. From where it is called
                }
            });
        });
    };

    static particularuserticketactivityreport(id)
    {
        return new Promise((resolve, reject)=>
        {  // the below query is for getting all the ticket activity of those ticket which was created by the particular user. The user will be determined by the userId which was entered in the params
            let selQuery = `SELECT 
                            t.id AS Ticket_id,
                            t.title AS Ticket_title,
                            t.description AS Ticket_description,
                            t.reporter_Id AS Reporter_Id,
                            u.name AS Reporter_name,
                            u.email AS Reporter_email,
                            t.assignee_Id AS Assignee_Id,
                            (SELECT u.name FROM users u WHERE u.id = t.assignee_Id) AS Assignee_name,
                            (SELECT u.email FROM users u WHERE u.id = t.assignee_Id)AS Assignee_email,
                            t.status AS Activity_name,
                            t.priority AS Priority,
                            t.created_at AS Activity_createdtime,
                            t.updated_at AS Activity_closedtime,
                            TIME(TIMEDIFF(t.updated_at, t.created_at)) AS Total_time,
                            (SELECT CASE WHEN  COUNT(m.id) IS NULL THEN 0 ELSE COUNT(m.message) END FROM messages m WHERE t.id = m.ticket_Id AND t.reporter_Id = m.reporter_Id AND t.assignee_Id = m.assignee_Id
                            ) AS Total_Message
                            FROM tickets t, users u
                            WHERE t.reporter_Id = u.id
                            AND u.id = '${id}'
                            GROUP BY t.id`;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result) // if successfully fetched all the resolved ticket
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // or encountered some error while fetching all the resolved ticket in the ticket table
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
            });            
        });        
    };

    static allticketactivityreport()
    {
        return new Promise((resolve, reject)=>
        {
            // the below will give us the ticket activity.
                let selQuery = `SELECT 
                                t.id AS Ticket_id,
                                t.title AS Ticket_title,
                                t.description AS Ticket_description,
                                t.reporter_Id AS Reporter_Id,
                                u.name AS Reporter_name,
                                u.email AS Reporter_email,
                                t.assignee_Id AS Assignee_Id,
                                (SELECT u.name FROM users u WHERE u.id = t.assignee_Id) AS Assignee_name,
                                (SELECT u.email FROM users u WHERE u.id = t.assignee_Id)AS Assignee_email,
                                t.status AS Activity_name,
                                t.priority AS Priority,
                                t.created_at AS Activity_createdtime,
                                t.updated_at AS Activity_closedtime,
                                TIME(TIMEDIFF(t.updated_at, t.created_at)) AS Total_time,
                                (SELECT CASE WHEN  COUNT(m.id) IS NULL THEN 0 
                                ELSE COUNT(m.message) 
                                END FROM messages m 
                                WHERE t.id = m.ticket_Id 
                                AND t.reporter_Id = m.reporter_Id 
                                AND t.assignee_Id = m.assignee_Id
                                ) AS Total_Message
                                FROM tickets t, users u
                                GROUP BY t.id`;
            con.query(selQuery, (err, result)=> // executing the above query
            {
                if(result) // if successfully fetched all the resolved ticket
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // or encountered some error while fetching all the resolved ticket in the ticket table
                {
                    resolve(result); // error will send back to the controller. From where it is called
                }
            });
        });
    };

    static downloadattachment(id, res)
    {
        return new Promise((resolve, reject)=>
        {
            try
            {
                // The below query will give us the image name of the attachment which was there in the databse for the ticket id entered in the params.
                let selQuery = ` SELECT t.image_name FROM tickets t WHERE t.id = '${id}' `; 
                con.query(selQuery, (err, result) => // executing the above query
                {
                    // console.log(result);
                    // console.log(id);
                    if(err) // IF any kind error came while fetching the attachment name
                    {
                        console.log('Error occurred while fetching the attachment name on the basis of ticket ID in the params', err);
                        resolve(500);
                    }
                    else
                    {
                        // console.log(result[0].image_name);
                        let filename = result[0].image_name; // Initializng the attachment name to filename variable
                        // console.log(filename);
                        let extname = path.extname(filename); // get the file extension
                        let basename = path.basename(filename, extname); // remove the extension from the filename
                        // __dirnam ---> This will give the path till the current file
                        // '..' --> The first (.) will take from this file. The Second (.) will take us from the controller folder. This file is inside the controller folder
                        // 'attachments' ---> The folder name were all the attachment is being stored. 
                        // The path is will take us inside the attachment folder
                        const attachmentFolder = path.join(__dirname, '..', 'attachments');  // The attachmentFolder will have the path where all the attachment have been stored at the time ticket creation 
                        const file = path.join(attachmentFolder, `${filename}`); // The code will join the path and filename which we have to download
                        //  console.log(file); 
                        // The below fs.access is used to check whether we can access the file or not
                        fs.access(file, fs.constants.F_OK, (err) => 
                        {
                            if(err) // if any came at the time of check the accessibilty of the file or file is not available
                            { 
                                // This block of code will be executed
                                console.error(`${file} does not exist`);
                                resolve(404);
                            }
                            else
                            {
                                // if file is present
                                console.log(`${file} exists`);
                                res.download(file, (err) =>  // this will used to download
                                {
                                    if (err)
                                    {
                                        console.error('Error occurred while downloading file', err);
                                        resolve(500);
                                    }
                                    else
                                    {
                                        resolve(true);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            catch(error)
            {
                console.error('An error occurred', error);
                reject(500);
            }
        });
    }

};


// The below arrow function is used for adding data in expired date column. The expired date column have the 2 days plus date of ticekt created date
const DAYADD = (plus) =>
{
    const now = new Date(); // here we fetching the current date and assigning it to the now variable
    const value = date.addDays(now, plus); // adding 2 days in the now variable. which has the current date
    return value; // Return the new 2 days add value
};

const minutesAdd = (plus) =>
{
    const now = new Date();
    return new Date(now.getTime() + plus * 60000);
}

const nowd = () => {
    const date_ob = new Date();
    const day = ("0" + date_ob.getDate()).slice(-2);
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();
    const date = year + "-" + month + "-" + day;
    const hours = date_ob.getHours();
    const minutes = ("0" + date_ob.getMinutes()).slice(-2); // Pad minutes with leading zero
    const seconds = ("0" + date_ob.getSeconds()).slice(-2); // Pad seconds with leading zero
    const dateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return dateTime;
};

const convertDatePickerTimeToMySQLTime = (str) =>
{
    var month, day, year, hours, minutes, seconds;
    var date = new Date(str),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    hours = ("0" + date.getHours()).slice(-2);
    minutes = ("0" + date.getMinutes()).slice(-2);
    seconds = ("0" + date.getSeconds()).slice(-2);
    var mySQLDate = [date.getFullYear(), month, day].join("-");
    var mySQLTime = [hours, minutes, seconds].join(":");
    return [mySQLDate, mySQLTime].join(" ");
};

const convertUnixTimeIntoSimpleFormat = (value) =>
{
    const expDate = convertDatePickerTimeToMySQLTime(new Date(value * 1000).toLocaleString());
    return expDate;
}

const timeexportfunction = 
{
    DAYADD,
    nowd,
    minutesAdd,
    convertDatePickerTimeToMySQLTime,
    convertUnixTimeIntoSimpleFormat,
    main
}

module.exports = timeexportfunction;