const con = require("../configs/db.config");  // importing the database details
const constants = require('../utils/constants'); // Importing the constants file. This file contain the constant details
const time = require('../models/ticket.model')

module.exports = class operations
{
    static insertincorrectpasswordcount(id)
    {
        return new Promise((resolve, reject) =>
        {
            let selQuery = `SELECT * FROM login_incorrect_attempts l WHERE l.user_Id = '${id}' AND l.status = '${constants.status.active}' `;
            con.query(selQuery, (err, result) =>
            {
                if(result.length == 0)
                {
                    let insQuery = `INSERT INTO login_incorrect_attempts(user_Id, incorrect_count, last_attempt) VALUES('${id}' , 1 , '${time.nowd()}')`;
                    con.query(insQuery, (err, result1) =>
                    {
                        if(result1.length != 0)
                        {
                             console.log(" #### Data Entered into the login_incorrect_attempts table for the first time #### ");
                        }
                        else
                        {
                            console.log(" #### Error happen while entering the data into the login_incorrect_attempts table for the first time #### ", err.message);
                        }
                    })
                }
                else if(result[0].incorrect_count >= 1 && result[0].incorrect_count <= ((constants.password_protection_policy_numbers.number_of_incorrect_password_attempt - 1) - 1))
                {
                    let upQuery = `UPDATE login_incorrect_attempts l SET l.incorrect_count = '${(result[0].incorrect_count) + 1}', l.last_attempt = '${time.nowd()}' WHERE l.user_Id = '${id}'`;
                    con.query(upQuery, (err, result1) =>
                    {
                        if(result1.length != 0)
                        {
                            console.log(` #### Data updated in the login_incorrect_attempts table for the ${(result[0].incorrect_count) + 1}th time #### `);
                        }
                        else
                        {
                            console.log(` #### Error happen while updating the data updated in the login_incorrect_attempts table for the ${(result[0].incorrect_count) + 1}th time ####  `, err.message);
                        }
                    });
                }
                else if(result[0].incorrect_count == (constants.password_protection_policy_numbers.number_of_incorrect_password_attempt - 1))
                {
                    let upQuery = `UPDATE login_incorrect_attempts l SET l.last_attempt = '${time.nowd()}' , l.blocked_till = '${time.convertDatePickerTimeToMySQLTime(time.DAYADD(constants.password_protection_policy_numbers.user_blocked_for_days))}' , l.incorrect_count = '${(result[0].incorrect_count) + 1}' WHERE l.user_Id = '${id}'`;
                    con.query(upQuery, (err, result1) =>
                    {
                        if(result1.length != 0)
                        {
                            console.log(` #### Data updated in the login_incorrect_attempts table for the ${(result[0].incorrect_count) + 1}th time #### `);
                        }
                        else
                        {
                            console.log(` #### Error happen while updating the data updated in the login_incorrect_attempts table for the ${(result[0].incorrect_count) + 1}th time ####  `, err.message);
                        }
                    });
                }
                else
                {
                    console.log(" #### Error happen while entering into the login_incorrect_attempts table #### ", err);
                }
            });
        });
    };

};