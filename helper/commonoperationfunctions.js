const con = require("../configs/db.config");  // importing the database details
const constants = require('../utils/constants'); // Importing the constants file. This file contain the constant details
const time = require('../models/ticket.model')
const fetch = require('./commonfetchingfunction')

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

                        if(result1.length != 0 )
                        {
                             console.log(" #### Data Entered into the login_incorrect_attempts table for the first time #### ");
                        }
                        else
                        {
                            console.log(" #### Error happen while entering the data into the login_incorrect_attempts table for the first time #### ", err.message);
                        }
                    })
                }
                else if(result[0].incorrect_count >= 1 && result[0].incorrect_count <= ((constants.day_or_minutes_protection_policy_numbers.number_of_incorrect_password_attempt - 1) - 1) && result[0].status === constants.status.active)
                {
                    let upQuery = `UPDATE login_incorrect_attempts l SET l.incorrect_count = '${(result[0].incorrect_count) + 1}', l.last_attempt = '${time.nowd()}' WHERE l.user_Id = '${id}' AND l.status = '${constants.status.active}' `;
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
                else if(result[0].incorrect_count == (constants.day_or_minutes_protection_policy_numbers.number_of_incorrect_password_attempt - 1) && result[0].status === constants.status.active )
                {
                    let upQuery = `UPDATE login_incorrect_attempts l SET l.last_attempt = '${time.nowd()}' , l.blocked_till = '${time.convertDatePickerTimeToMySQLTime(time.DAYADD(constants.day_or_minutes_protection_policy_numbers.user_blocked_for_days))}' , l.incorrect_count = '${(result[0].incorrect_count) + 1}' WHERE l.user_Id = '${id}' AND l.status = '${constants.status.active}'`;
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

    static async updateStatusaftercorrectpasswordentered(id)
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let CheckWhetherIncorrectPasswordEnteredOrNot =  await fetch.GetTheCountOfIncorrectPasswordEventHappend(id);
                
                if(CheckWhetherIncorrectPasswordEnteredOrNot.length != 0)
                {
                    let upQuery = `UPDATE login_incorrect_attempts l SET l.status = '${constants.status.inactive}', l.updated_at = '${time.nowd()}' WHERE l.blocked_till IS NULL AND l.user_Id = '${id}' AND l.status = '${constants.status.active}' `;
                    con.query(upQuery, (err, result1) =>
                    {
                        if(result1.length != 0)
                        {
                            console.log(` #### Since the user have entered correct password after incorrect. It is updated in the table #### `);
                            resolve(result1)
                        }
                        else
                        {
                            console.log(` #### Error happen while updating the data in the login_incorrect_attempts. When user entered the correect password  ####  `, err.message);
                            reject(err)
                        }
                    });
                }
                else if(CheckWhetherIncorrectPasswordEnteredOrNot.length == 0)
                {
                    console.log(` #### Since the user haven't attempted any incorrect entry of password. So no change can be made in the table #### `);
                    resolve(true);
                }
                else
                {
                    console.log("Not present");
                    resolve(false)
                }
            }
            catch(error)
            {
                console.log(" #### Error happen while checking whether there is any ongoing streak of entering incorrect password in going on for any knid of user #### ")
            }            
        });
    }





};