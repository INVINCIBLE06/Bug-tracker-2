const readline = require("readline");
const constants = require('./utils/constants'); // Here we are importing the constants file details and intializing it into the constants variable 
const con = require('./configs/db.config');  // importing the database details
const createtable = require('./createtable'); // Importing the creatable file details and intializing createtable variable with that 

// The below block of code will be able to delete all the table that are inside the database
// The block will create a interface in the terminal 
// There is a question which will ask (do you want to delete the table or not)
// If YES --> Then all the available data inside the table is delete and new tables will be created with admin information only.
// If NO ---> No information will be deleted. But if there is not table. And then also it was selected then it will create the table and enter the admin data. 

// process.stdin --> This is for the input by the user
// process.stdout --> This is for the output for the user

module.exports = async function() 
{
    try
    {
        con.connect(function(error)  // Making connection with the database
        {
            let Tablealreadypresentcheck = `SHOW TABLES`;
            con.query(Tablealreadypresentcheck, (err, resulttc) =>
            {
                if(resulttc != 0)
                {
                    var rl = readline.createInterface(process.stdin, process.stdout);  // This rl variable will create interface in the terminal.
                    // The below one is question
                    rl.question(" #### There is already table present in the database. Do you want to delete them (YES/NO) #### \n ", function (string) 
                    {   
                        // string --> Contains the value entered by the user. It must be YES/NO. 
                        if(string == constants.allow.yes) // If answer is YES
                        {
                            // the below query will downloading all the tables. Note we can dowload all the tables at once in MYSQL                              
                            var delete_query = `DROP TABLE login_incorrect_attempts, otpstores, reports, tickets_activities, users_activities, messages, permissions, modules, tickets, users, roles`;
                            con.query(delete_query, function (error, result) // executing the above query
                            {    
                                // If the deleting all the table is successfully happend, Then this if block code will be executed
                                if(result) 
                                { 
                                    // The below query will delete the insertintousers_activities stored procedure. Note we cannot delete 2 or more STORED PROCEDURE at the same time
                                    var delete_stored_procedure_query = `DROP PROCEDURE insertintousers_activities `;
                                    con.query(delete_stored_procedure_query, function (err, result1) // executing the above query
                                    {                 
                                        if(result1) // If PROCEDURE insertintousers_activities deleted successfully
                                        {
                                            console.log(' #### insertintousers_activities Stored procedure is successfully deleted ####');
                                            // The below query will delete the insertintotickets_activities stored procedure. Note we cannot delete 2 or more STORED PROCEDURE at the same time
                                            var delete_stored_procedure_query2 = `DROP PROCEDURE insertintotickets_activities `;
                                            con.query(delete_stored_procedure_query2, function (err, result2)// executing the above query
                                            {
                                                if(result2) // If PROCEDURE insertintotickets_activities deleted successfully
                                                {
                                                    console.log(' #### insertintotickets_activities Stored procedure is successfully deleted ####');
                                                    // The below query will delete the checkticketsexiparation event. Note we cannot delete 2 or more EVENTS at the same time
                                                    var delete_event = `DROP EVENT checkticketsexiparation `;
                                                    con.query(delete_event, function (err, result3) // executing the above query
                                                    {
                                                        if(result3) // If EVENT checkticketsexiparation deleted successfully
                                                        {
                                                            console.log(' #### checkticketsexiparation event is successfully deleted ####');
                                                            // The below query will delete the insertintoreportswhilelogin stored procedure. Note we cannot delete 2 or more STORED PROCEDURE at the same time
                                                            var delete_stored_procedure_query3 = `DROP PROCEDURE insertintoreportswhilelogin `;
                                                            con.query(delete_stored_procedure_query3, function (err, result4) // executing the above query
                                                            {
                                                                if(result4) // If PROCEDURE insertintoreportswhilelogin deleted successfully
                                                                {
                                                                    console.log(' #### insertintoreportswhilelogin Stored procedure is successfully deleted ####');
                                                                    // The below query will delete the insertintoreportswhilelogout stored procedure. Note we cannot delete 2 or more STORED PROCEDURE at the same time
                                                                    var delete_stored_procedure_query4 = `DROP PROCEDURE insertintoreportswhilelogout `;
                                                                    con.query(delete_stored_procedure_query4, function (err, result5) // executing the above query
                                                                    {
                                                                        if(result5) // If PROCEDURE insertintoreportswhilelogout deleted successfully
                                                                        {
                                                                            console.log(' #### insertintoreportswhilelogout Stored procedure is successfully deleted ####');
                                                                            // The below query will delete the insertintoreportfortotalloggedhours stored procedure. Note we cannot delete 2 or more STORED PROCEDURE at the same time
                                                                            var delete_stored_procedure_query5 = `DROP PROCEDURE insertintoreportfortotalloggedhours`;
                                                                            con.query(delete_stored_procedure_query5, function (err, result6) // executing the above query
                                                                            {
                                                                                if(result6) // If PROCEDURE insertintoreportfortotalloggedhours deleted successfully
                                                                                {
                                                                                    console.log(' #### insertintoreportfortotalloggedhours Stored procedure is successfully deleted ####');
                                                                                    // The below query will delete the myactivitylogs stored procedure. Note we cannot delete 2 or more STORED PROCEDURE at the same time
                                                                                    var delete_stored_procedure_query6 = `DROP PROCEDURE myactivitylogs`;
                                                                                    con.query(delete_stored_procedure_query6, function (err, result7) // executing the above query
                                                                                    {
                                                                                        if(result7) // If PROCEDURE myactivitylogs deleted successfully
                                                                                        {
                                                                                            console.log(' #### myactivitylogs Stored procedure is successfully deleted #### ');
                                                                                            console.log(' #### All stored procedures have been successfully deleted #### ');
                                                                                            console.log(' #### All tables have been successfully deleted #### ');
                                                                                            console.log(' #### All events have been successfully deleted #### ');
                                                                                            rl.close();
                                                                                            console.log('-------------------------------------------------------------------------------------');
                                                                                            var rl2 = readline.createInterface(process.stdin, process.stdout);
                                                                                            rl2.question(" #### Tables and their data both are deleted. Do you want create the table now (YES/NO) #### \n ", function (string2) 
                                                                                            {
                                                                                                if(string2 == constants.allow.yes)
                                                                                                {
                                                                                                    // rl2.close();
                                                                                                    createtable(); // We are calling the createtable variable. Which have all the code for creating the tables. If we will remove or comment this then table will be not created
                                                                                                    return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    console.log(' #### Table are not created. As per your request #### ');
                                                                                                    rl2.close();
                                                                                                    return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines 
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                        else // if any error, while deleting the myactivitylogs STORED PROCEDURE, Then this else block will execute
                                                                                        {
                                                                                            console.log(" #### Error while deleting myactivitylogs Stored PROCEDURE. #### " /**, err */);  
                                                                                            rl.close(); // This will close the interface created by readline.createInterface
                                                                                            return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines
                                                                                        }
                                                                                    });
                                                                                }
                                                                                else // if any error, while deleting the insertintoreportfortotalloggedhours STORED PROCEDURE, Then this else block will execute
                                                                                {
                                                                                    console.log(" #### Error while deleting insertintoreportfortotalloggedhours Stored PROCEDURE. #### " /**, err */);  
                                                                                    rl.close(); // This will close the interface created by readline.createInterface
                                                                                    return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines
                                                                                }
                                                                            });
                                                                        }
                                                                        else // if any error, while deleting the insertintoreportswhilelogout STORED PROCEDURE, Then this else block will execute
                                                                        {
                                                                            console.log(" #### Error while deleting insertintoreportswhilelogout Stored PROCEDURE. #### " /**, err */);  
                                                                            rl.close(); // This will close the interface created by readline.createInterface
                                                                            return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines
                                                                        }
                                                                    });
                                                                }  // if any error, while deleting the insertintoreportswhilelogin STORED PROCEDURE, Then this else block will execute
                                                                else
                                                                {
                                                                    console.log(" #### Error while deleting insertintoreportswhilelogin Stored PROCEDURE. #### " /**, err */);  
                                                                    rl.close(); // This will close the interface created by readline.createInterface
                                                                    return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines
                                                                }
                                                            });
                                                        } // if any error, while deleting the checkticketsexiparation EVENT, Then this else block will execute
                                                        else
                                                        {
                                                            console.log(" #### Error while deleting checkticketexiparation event. #### " /**, err */);  
                                                            rl.close(); // This will close the interface created by readline.createInterface
                                                            return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines
                                                        }
                                                    });
                                                }  // if any error, while deleting the insertintotickets_activities STORED PROCEDURE, Then this else block will execute
                                                else
                                                {
                                                    console.log(" #### Error while deleting insertintoticketlogged stored procedured. #### " /**, err */);  
                                                    rl.close(); // This will close the interface created by readline.createInterface
                                                    return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines
                                                }
                                            });
                                        } // if any error, while deleting the insertintousers_activities STORED PROCEDURE, Then this else block will execute
                                        else
                                        {
                                            console.log(" #### Error while deleting insertintologged stored procedured. #### " /**, err */);  
                                            rl.close(); // This will close the interface created by readline.createInterface
                                            return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines
                                        }
                                    });                    
                                } // If the deleting all the table is  not successfully happened, Then this else block code will be executed, Then this else block will execute
                                else
                                {
                                    console.log(" #### Error while deleting all the tables because no table is present. Table creation will be done by default #### " /**, error.message */);
                                    createtable(); 
                                    rl.close(); // This will close the interface created by readline.createInterface
                                    return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines
                                }
                            });
                        }
                        else if(string == constants.allow.no)
                        {
                            console.log('#### Nothing is deleted. Old data is already present in the database  ####')
                            createtable();  // We are calling the createtable variable. Which have all the code for creating the tables. If we will remove or comment this then table will be not created
                            rl.close(); // This will close the interface created by readline.createInterface
                        }
                        else 
                        {
                            rl.close(); // This will close the interface created by readline.createInterface
                        }                            
                    });
                } 
                else
                {
                    console.log('There are no table present in the database');
                    var rl = readline.createInterface(process.stdin, process.stdout);
                    rl.question(" #### Do you want to create the table (YES/NO) #### \n ", function (string) 
                    {
                        if(string == constants.allow.yes)
                        {
                            createtable();
                        }
                        else
                        {
                            rl.close(); 
                        }
                    });
                }
            });                   
        });
    }
    catch(error)
    {
        console.log("Error occurs in the deletetable file try catch both");
    }
};

        