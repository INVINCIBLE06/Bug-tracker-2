const con = require('../configs/db.config');   // importing the database details
const constants = require('../utils/constants');

module.exports = class message
{
    constructor(){}
    
    static reportermessage(id, email, message)  // From here we are sending the message of the person who have created the ticket based on the ticket id
    {
        return new Promise((resolve, reject) =>
        { // the below is finding for the finding the ticket details on the basis of ticket id. Which will be there in the params.
            let selQuery = `SELECT * FROM tickets t WHERE t.id = '${id}'`; 
            con.query(selQuery, (err, result) =>  // execution of searching for ticket.
            {
                if(result.length != 0) // If yes then this controller will go inside this
                { // the below query is just for finding the role name of the user who have created the ticket. Because anyone can create the ticket irrespective of their role
                    let selQuery = `select u.email, r.role_name FROM users u, roles r WHERE u.email = '${email}' AND u.role_Id = r.id`;
                    con.query(selQuery, (err, result2) => // execute of the above query
                    {
                        // console.log(result2) // printing the result of finding the role
                        if(result2.length != 0) // If successful then it will go inside it otherwise it jump to else
                        { // The below route will inserting the data inside the message table
                            let InsQuery = `INSERT INTO messages(assignee_Id, reporter_Id, ticket_Id ,message, sender_role) VALUES ('${result[0].assignee_Id}', '${result[0].reporter_Id}', '${result[0].id}', '${message}', '${result2[0].role_name}')`;
                            con.query(InsQuery, (err, result2) => // execute of the above query
                            {
                                if(result2.length != 0)// If successful then it will go inside it otherwise it jump to else
                                {
                                    resolve(result2);  // It will return the result to the controller in the message controller for response. If the length of the result is not zero
                                }
                                else // If the length of the result is zero
                                {
                                    resolve(result2);  // It will return the result to the controller in the message controller for response.
                                }
                            });                            
                        } // if the role name is not fetched then it come inside the else part throw error
                        else
                        {
                            reject(err); // Error statement
                        }
                    });
                }
                else  // if no ticket is there then it directly come here and throw the error
                { // it will never come here because we are checking the ticket in middlewares. We have written this just for hving the information of the ticket
                    reject(err); // error statment
                }
            });
        });
    };

    static assigneemessage(id, email, message) // From here we are sending the message of the person who got the ticket assigned based on the ticket id
    {
        return new Promise((resolve, reject) =>
        {// the below is finding for the finding the ticket details on the basis of ticket id. Which will be there in the params.
            let selQuery = `SELECT * FROM tickets t WHERE t.id = '${id}' `;
            con.query(selQuery, (err, result) => // execution of searching for ticket.
            {
                if(result.length != 0) // If yes then this controller will go inside this
                { // the below query is just for finding the role name of the user who got ticket assigned. Because there can be morethan one type of user who will get the assigned.
                    let selQuery = `select u.email, r.role_name FROM users u, roles r WHERE u.email = '${email}' AND u.role_Id = r.id`;
                    con.query(selQuery, (err, result2) => // execute of the above query
                    {
                        // console.log(result2) // printing the result of finding the role
                        if(result2.length != 0) // If successful then it will go inside it otherwise it jump to else
                        { // The below route will inserting the data inside the message table
                            let InsQuery = `INSERT INTO messages(assignee_Id, reporter_Id, ticket_Id ,message, sender_role) VALUES ('${result[0].assignee_Id}', '${result[0].reporter_Id}', '${result[0].id}', '${message}', '${result2[0].role_name}')`;
                            con.query(InsQuery, (err, result2) => // execute of the above query
                            {
                                if(result2.length != 0) // If successful then it will go inside it otherwise it jump to else
                                {
                                    resolve(result2);  // It will return the result to the controller in the message controller for response. If the length of the result is not zero
                                }
                                else // If the length of the result is zero
                                {
                                    resolve(result2); // It will return the result to the controller in the message controller for response.
                                }
                            });                            
                        } // if the role name is not fetched then it come inside the else part throw error
                        else
                        {
                            reject(err); // Error statement
                        }
                    });
                }
                else // if no ticket is there then it directly come here and throw the error
                { // it will never come here because we are checking the ticket in middlewares. We have written this just for hving the information of the ticket
                    reject(err);// error statment
                }
            });
        });
    }

    static adminmessage(id, email, message)  // From here we are sending the message of the admin.
    {
        return new Promise((resolve, reject) =>
        { // the below is finding for the finding the ticket details on the basis of ticket id. Which will be there in the params.
            let selQuery = `SELECT * FROM tickets t WHERE t.id = '${id}' `;
            con.query(selQuery, (err, result) => // execution of searching for ticket.
            {
                if(result.length != 0) // If successful then it will go inside it otherwise it jump to else
                {
                     let InsQuery = `INSERT INTO messages(assignee_Id, reporter_Id, ticket_Id ,message, sender_role) VALUES ('${result[0].assignee_Id}', '${result[0].reporter_Id}', '${result[0].id}', '${message}', '${constants.role.admin}')`;
                     con.query(InsQuery, (err, result2) => // execute of the above query
                     {
                                if(result2.length != 0)// If successful then it will go inside it otherwise it jump to else
                                {
                                    resolve(result2); // It will return the result to the controller in the message controller for response. If the length of the result is not zero
                                }
                                else
                                {
                                    reject(err); // Error statement
                                }
                            });                            
                }
                else
                {
                    // if no ticket is there then it directly come here and throw the error
                    // it will never come here because we are checking the ticket in middlewares. We have written this just for having the information of the ticket
                    reject(err); // error statment
                }
            });
        });
    };

    /**
     * Below we are getting all the messages  
     */
    static getallmessagesendonparticularticket(id)
    {
        return new Promise((resolve, reject)=>
        {
            let selQuery = `SELECT * FROM messages m WHERE m.ticket_Id = '${id}' `;
            con.query(selQuery, (err, result)=>
            {
                if(result)
                {
                    resolve(result);  // It will send this result to the message controller
                }
                else
                {
                    reject(err);  // error statment
                }
            });
        });
    };
};