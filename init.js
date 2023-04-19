
/**
* This file has the code entering the admin data and admin role from the backend.
* Table must be created already. If it is not created then it will throuw error
*/
const bcrypt = require('bcryptjs'); // Impirting the bcryptjs library afte installing it
const con = require('./configs/db.config'); // Importing the con variable
const constants = require('./utils/constants'); // Importing the constant details which are there in the constants file in the utils folder

module.exports = async function() 
{
        // making the connection with the database
        con.connect(function(err)
        {
            /**
             * Searching whether the admin role is already available. If available then it will not enter
             * the data ewxits from here
             */
            con.query(`SELECT * FROM roles WHERE roles.role_name = '${constants.role.admin}'`, function (err, result)  // Executing the above query
            {
                if(result.length != 0) // if the admin role is already present then this if block code
                {
                    console.log(" #### Admin role is already available #### ");
                }
                else    
                {
                /**
                * Searching whether the admin role is already available. If not available then it will enter
                * the data from this lines of code
                */
                    new Promise((resolve, reject)=>
                    {// the below query is for inserting the role table
                        let insQuery = `INSERT INTO roles(role_name) VALUES ('${constants.role.admin}')`;
                        con.query(insQuery, (err, result1)=> // Executing the above query
                        {
                            if(result1) // if inserion happend correctly then if block
                            {
                                console.log(' #### Admin role entered successfully #### ')
                                resolve('true');
                            }
                            else // if error happend then else block
                            {
                                console.log(" #### Error while entereing the admin data #### ")
                                reject(err);
                            }
                        });
                    });
                }
            });

        /**
        * Searching whether the admin user data is already available. If available then it will not enter
        * the data exits from 
        */      
        con.query(`SELECT * FROM users WHERE users.email = '${process.env.adminemail}'`, function (err, result)  // Executing the above query
        {
            if(result.length != 0) // if the admin data is already available in the table then if block code will be executed
            {
                console.log(" #### Admin data is already available #### ")
            }
            else // if the admin data is not there then this else block code. And the data will be entered in the table
            {
                /**
                * Searching whether the admin user data is already available. If not available then 
                * it will enter the data from this lines of code 
                */
                new Promise((resolve, reject)=>
                { // the below query is for checking whether the admin role available in the table or not. Becuase the roles are in different table
                    con.query(`SELECT * FROM roles WHERE roles.role_name = '${constants.role.admin}'`, function (err, result) // Executing the above query
                    { // if thr role is available then this if block code will be executed
                        if(result.length != 0)
                        { // The below query will be used to enter the admin data to the user table. The admin data is in the env file.
                            let insQuery = `INSERT INTO users(name, email, email_verified , mobile, date_of_birth, status, security_answer, password, confirm_password, role_id) VALUES ('${process.env.adminname}', '${process.env.adminemail}', '${constants.status.verified}', '${process.env.adminmobile}', '${process.env.admindateofbirth}', '${constants.status.active}', '${process.env.adminanswer}', '${bcrypt.hashSync(process.env.adminpassword, 8)}', '${bcrypt.hashSync(process.env.adminconfirmpassword, 8)}', '${result[0].id}')`;
                            con.query(insQuery, (err, result)=> // Executing the above query
                            {
                                if(result) // If the data is successfully entered. The data must be there in the environment file. Otherwise it will through an error
                                {
                                    console.log(' #### Admin data entered successfully #### ')
                                    resolve('true');
                                }
                                else
                                { // Any kind of error happpen while entereing the data into the table from the backend
                                    console.log(" #### Error while entereing the admin data #### ")
                                    reject(err); 
                                }
                            });
                        } // Any 
                        else
                        { // If the admin role is not present in the table then this block of code will be executed
                            console.log(" #### Admin role is not available in the table while entering the admin data from the backend #### ")
                            reject(err);
                        }
                    });
                });  
            }
        });
        /**
         * The below block of code contains the query entering the data into the modules tabel
         */
        // Module names are the permission that are given to particular user. At the time user registeration
        // The below query is for getting the module id and module name from the module table 
        con.query(`SELECT m.id AS mID, m.module_name AS ModuleName FROM modules m; `, function(err, resultm1)
        {
            if(resultm1.length == 0) // If the module table is not filled with module name. then this if block code will be executed.
            {
                console.log(" #### The Module Table is empty #### ", err);
            }
            else // If the module names are already present in the module name then this else code will be executed
            { 
                new Promise((resolve, reject) =>
                { // The below fetching the roleId and rolename from the roles table. Where rolename is admin. 
                    let selQuery = `SELECT r.id AS rID, r.role_name AS RoleName FROM roles r WHERE r.role_name = '${constants.role.admin}'`;
                    con.query(selQuery, (err, resultm2) => // Executing the above query
                    {
                        if(resultm2.length == 0) // the admin role is not available in the table then if block
                        { // Usually this code will never used because all the thing are corelated to each other. But it return for safety.
                            console.log(' #### Admin Role is not available in the table #### ', err);
                        }
                        else
                        {   // if the admin data is there then this else block code will be executed.
                            // The below query will return us back the user id from the user table. We putting the admin email for having the email. The first admin data entered from the backend. And that user detail is in the env file. 
                            // the user data have been entered from the above function. And at that time user id is creating and that particular id we are fetching here.
                            let selQuery = `SELECT u.id AS uId FROM users u WHERE u.email = '${process.env.adminemail}'`;
                            con.query(selQuery, (err, resultm3) => // Executing the above query
                            { 
                                if(resultm3.length == 0) // IF the userid is not successfully fetched. then this if block code will be executed
                                {
                                    console.log(' #### Admin data is not available in the table #### ', err);
                                }
                                else
                                { // if the user id available and we fetched it as well successfully then this else block code
                                    // the below for loop if for having the number of modules. Becuase we have to the data into permission table that number of time. 
                                    // The permission have 3 id's
                                    // moduleId, roleId, userId. 
                                    for( let i = 0 ; i < resultm1.length ; i++ ) 
                                    { 
                                        // the below query is for checking whether there are any module id already present in the permission.
                                        // Please keep in mind this is first time the data is being entered into the data base. So the data must the empty.
                                        let selQuery = `SELECT * FROM permissions p WHERE p.module_Id = ${resultm1[i].mID}`;
                                        con.query(selQuery, (err, resultm4) => // Executing the above query
                                        {
                                            if(resultm4.length != 0) // If module if present then this if block code will be executed.
                                            { 
                                                // This block will never be executed. But it is written just for checking. This file only will only be executed at the timw when the server is started and data base is empty if there is any kind of data present in the data then code will not be executed.
                                                console.log(' #### Data is alredy present in permission table #### ', err);
                                            }
                                            else
                                            { 
                                                // When the permission table is empty then this else block code
                                                // Keep in mind that the permission table consist of 3 id only
                                                // moduleId - which will be used for giving or providing the permission 
                                                // roleId - which will be used for having the rolename
                                                // userId - which will be used for having the user details
                                                // the permission have the details of user and their respeotice permission or authorities
                                                // the below query is for inserting the permission table
                                                let InsQuery = `INSERT INTO permissions (user_Id, role_Id, module_Id) VALUES (${resultm3[0].uId}, ${resultm2[0].rID}, ${resultm1[i].mID} )`;
                                                con.query(InsQuery, (err, resultm5) => // Executing the above query
                                                {
                                                    if(resultm5.length == 0) // If any error occurs while inserting the data then this if block of code is executed
                                                    {
                                                        console.log(" #### Error occured while entereing the data in the permission table from the backend #### ", err);
                                                    }
                                                    else // If the inserting happend successfully then this else block of code is executed 
                                                    { 
                                                        // Please not that this line will be printed on the basis of number of modules entered while registering or module length. 
                                                        console.log(' #### Data entered successfully in the permission table #### ')
                                                        resolve('true');
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });
    });
};