const con = require("../configs/db.config");  // importing the database details
const constants = require('../utils/constants'); // Importing the constants file. This file contain the constant details
const time = require('../models/ticket.model')

module.exports = class fetching
{
    static getUserDetailsByEmailCondition(email)
    {
        return new Promise((resolve, reject) =>
        {
            let selQuery = `SELECT * FROM users u WHERE u.email = '${email}'`;
            con.query(selQuery, (err, result) =>
            {
                if(result.length != 0)
                {
                    // console.log(result)
                    resolve(result)
                }
                else
                {
                    // console.log(err.message)
                    reject(err)
                }
            });             
        });
    };

    static async isUserBlockedFromLoginAfterMaxPasswordAttempts(id)
    {
        return await new Promise((resolve, reject) =>
        {
            let selQuery = `SELECT * FROM login_incorrect_attempts l WHERE l.user_Id = '${id}' AND l.incorrect_count = '${constants.password_protection_policy_numbers.number_of_incorrect_password_attempt}' AND l.blocked_till >= '${time.nowd()}' AND l.status = '${constants.status.active}' `;
            con.query(selQuery, (err, result) =>
            {
                // console.log(result)
                if(result.length != 0)
                {
                    // console.log("Found")
                    resolve(result)
                }
                else
                {
                    // console.log("Not Found")
                    resolve(result);
                }
            });             
        });
    };

    static async GetTheCountOfIncorrectPasswordEventHappend(id)
    {
        return await new Promise((resolve, reject) =>
        {
            let selQuery = `SELECT * FROM login_incorrect_attempts l WHERE l.user_Id = '${id}' AND l.status = '${constants.status.active}' AND l.blocked_till IS NULL`;
            con.query(selQuery, (err, result) => 
            {
                if(result.length == 0)
                {
                    console.log("Not Found")
                    resolve(result);
                }
                else if(result.length != 0)
                {
                    console.log("Found")
                    resolve(result);
                }
                else
                {
                    console.log("Not Found");
                    resolve(result);

                }
            });
        });
    };
};