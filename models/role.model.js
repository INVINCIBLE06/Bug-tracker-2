const con = require('../configs/db.config');  // importing the database details


module.exports = class role
{ 
    constructor(){}
    // static addOne(name, author, price, adminid)
    static async addOneRole(role_name)  // here we are getting the rolename. Which was entered by the user in the req body
    { // This function is written for adding the role in the database
        return await new Promise((resolve, reject)=>
        { // the below query is for adding the role into the databse
            let insQuery = `INSERT INTO roles(role_name) VALUES (?)`;
                con.query(insQuery, [role_name.toLocaleUpperCase()], (err, result)=> // executing the above query
                {
                    if(result) // if succesffull
                        {
                            resolve('true'); // result sent back to the controller. From where it is called
                        }
                    else // or some error
                        {
                            reject(err); // error will send back to the controller. From where it is called
                        }
                });
        });
    }

    // The below line of code will be used for updating the role
    static updateOneRole(role_name, new_rolename) // we getting the rolename and new rolename in the parameters
    {
        return new Promise((resolve, reject)=>
        {  // the below line of code is for seleting the rolename which was desired for getting updated
            let selQuery = `SELECT * FROM roles r WHERE r.role_name = ?`;
                con.query(selQuery, [role_name.toLocaleUpperCase()], (err, result)=> // Executing the above lines of codes
                {
                    if(result.length > 0) // if succesfully found that role name.
                    { // then this below update query will be execute
                        let userDetails = `UPDATE roles r SET r.role_name = '${new_rolename.toLocaleUpperCase()}' WHERE r.role_name = '${role_name}'`;
                            con.query(userDetails, (err, result)=> // eexecuting the above query
                            {
                                if(result) // if succesfully 
                                {
                                    resolve('true'); // result sent back to the controller. From where it is called
                                }
                                else // or encountered some error
                                {
                                    reject(err); // error will send back to the controller. From where it is called
                                }
                            });
                    }
                    else // if didn't find that role name then this else block code is executed
                    {
                        reject(err); // error will send back to the controller. From where it is called
                    }
                });
        });
    }

// the below lines of code will be executed for deleting the rolename. we will need rolename for deleting the role
    static deleteOneRole(role_name) // getting the role name in the parameters
    {
        return new Promise((resolve, reject)=>
        {// the below lines of code will be executed for finding the rolename which it is desired to be deleted
            let selQuery = `SELECT * FROM roles r WHERE r.role_name = '${role_name}'`;
                con.query(selQuery, (err, result)=> // executing the above the query
                { // if that rolename is found. then this if block code will be executed
                    if(result.length != 0) // if succesfully found that role name.
                    { // the below lines of code will be used for deleting the rolename on he basis of role name in the req body
                        let updQuery = `DELETE FROM roles WHERE role_name = '${role_name}'`;
                            con.query(updQuery, (err, result)=> // executing the above the query
                            {
                                if(result) // if succesfully 
                                {
                                    resolve('true'); // result sent back to the controller. From where it is called
                                }
                                else // or encountered some error
                                {
                                    reject(err); // error will send back to the controller. From where it is called
                                }
                            });
                    }
                    else // or encountered some error while finding the role name
                    {
                        reject(err); // error will send back to the controller. From where it is called
                    }
                }); 
        });
    } 
 
    // the below line of code will be used to getting all the roles available in the database in the role table.
    static getallrole()
    {
        return new Promise((resolve, reject)=>
        { // the below line of code is used to get all the details in role table
            let selQuery = `SELECT * FROM roles`;
            con.query(selQuery, (err, result)=> // executing the above statement
            {
                if(result) // if successfully fetched all the rolename
                {
                    resolve(result); // result sent back to the controller. From where it is called
                }
                else // or encountered some error while finding all the details in the role name
                {
                    reject(err); // error will send back to the controller. From where it is called
                }
            });
        });
    };
};