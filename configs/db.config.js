const mysql = require('mysql2'); // Importing the mysql2 library functionalities
require('dotenv').config(); // Importing the dotenv library

// this is written for establishing the connection with the database. All the details are in the env file
var con = mysql.createConnection
({
    host : process.env.USER_HOST, // hostname
    user : process.env.USER_ROOT, // username
    password : process.env.DBPASSWORD, // password
    database : process.env.db // database name
});
    
con.connect(function async (err) 
{
    if (err) 
    {
        console.log(" ### Error While connecting with the database ###", err.message);
    }
    else
    {
        console.log("DB Connected !");
    }
});

// Exporting the con variable for using it anywhere in the programm
module.exports = con;