const con = require('../configs/db.config');   // importing the database details

module.exports = class module
{
    constructor(){}

    static addOneModule(module_name, active)  // we are getting module name and status in the request body for creating the module
    {
        return new Promise((resolve, reject)=>
        { // Thorugh the below line we will insert into the module table
            let insQuery = `INSERT INTO modules(module_name, active) VALUES (?, ?)`;
                con.query(insQuery, [module_name.toLocaleUpperCase(), active], (err, result)=>  // execute of the above query
                {
                    if(result) // if result successful then this if code will execute
                        {
                            resolve('true');  // It will return the result to the controller in the module controller for response. If the length of the result is not zero
                        }
                    else
                        {
                            reject(err); // Err statement
                        }
                });
        });
    }

    // This below function will be used for updating the module name
    // We will need modulke name and new module in the requet body.
    static updateOneModule(module_name, new_module_name)  
    {
        return new Promise((resolve, reject)=>
        {// Thorugh the below line we will select the module which has to be updated
            let selQuery = `SELECT * FROM modules WHERE module_name = ?`;
                con.query(selQuery, [module_name.toLocaleUpperCase()], (err, result)=> // execute of the above query
                { // If that module name is available then this if code woll get executed
                    if(result.length > 0)
                    { // The below query will update that module name. And it will change it wiht new name. Which was entered by the user in the nody 
                        let userDetails = `UPDATE modules m SET m.module_name = '${new_module_name.toLocaleUpperCase()}' WHERE m.module_name = '${module_name}'`;
                            con.query(userDetails, (err, result) => // execute of the above query
                            { // If the update is successfully done then this if code will be executed otherise the controller will shift to the else part
                                if(result)
                                {
                                    resolve('true'); // This will go to the module controller update module name code 
                                }
                                else // if not update then this line of code will be executed
                                {
                                    reject(err); // Err statement
                                }
                            })
                    } // Otherwise this else part wiill be execuited  
                    else
                    { // This will be sent to the module controller file in the upadate module function
                        reject(err); // Err statement
                    }
                });
        });
    }

    // This below line of code will give us all the active module name.
    static getallactivemodule()
    {
        return new Promise((resolve, reject) =>
        { // The below line of code will give all the information the module table
            let selQuery = `SELECT * FROM modules`;
            con.query(selQuery, (err, result) => // execute of the above query
            { // If all  fetched then it will go inside the the if code otherwise in the else block
                if(result)
                {
                    resolve(result);  //sending the result to the all  module controller file 
                }
                else
                {
                    reject(err); // Err statement
                }
            });
        });
    };

    // The below line of code will be used to update moddule status. There are two types of status ACTIVE or INACTIVE
    // We need module name and status(INACTIVE or ACTIVE) in the req body
    static ModuleStatusUpdate(module_name, active)
    {
        try 
        {
            return new Promise((resolve, reject)=>
        { // the below line is used to find the module name. Whther if is available in the db or not
            let selQuery = `SELECT * FROM modules WHERE module_name = '${module_name}'`;
                con.query(selQuery, [module_name], (err, result) =>  // execute of the above query
                {
                    // console.log(result[0].active);
                    if(result.length > 0) // If that module name is available then this if block code will be executed
                    { // here we are checking whether the module status is same as the entered status in req body
                        if(result[0].active == active)
                        { // if same, then this lines of code will be executed
                            return console.log("You have selecte the same status. It cannot be update");
                        }
                        else
                        { // when the db status and req body staus is different then this lines of code will be executed
                            if(result[0].active == "YES")  // Here we are checking whether the file is active. That is ACTIVE = YES
                            { // then, this if block code will be executed. The below line of code will be used to update the module status from yes to no
                                let userDetails = `UPDATE modules m SET m.active = '${active}' WHERE m.active = 'YES' AND m.module_name = '${module_name}' `;
                                con.query(userDetails, (err, result1)=> // executing the above lines of code
                                {
                                    if(result1.length != 0) // if it is successfully done  then this if block code will be executed
                                    {
                                        resolve('true'); // sending this result to module controller fucntion. From where this function is called
                                    }
                                    else // if update is not done and some kind of error occur then we execute this else statement
                                    {
                                        reject(err);  // Err statement
                                    }
                                });
                            }
                            else
                            { // Here we are checking whether the file is not active. That is ACTIVE = NO
                                // The below line of code will be used to update the module status from no to yes
                                let userDetails = `UPDATE modules m SET m.active = '${active}' WHERE m.active = 'NO' AND m.module_name = '${module_name}' `;
                                con.query(userDetails, (err, result)=> // executing the above lines of code
                                    {
                                        if(result) // if it is successfully done  then this if block code will be executed
                                        {
                                            resolve('true');  // sending this result to module controller fucntion. From where this function is called
                                        }
                                        else // if update is not done and some kind of error occur then we execute this else statement
                                        {      
                                            reject(err);  // Err statement
                                        }
                                    });
                            }
                        }              
                    }
                });
        });            
        } catch (error) 
        {
            console.log("Internal Server error while updating the active status of the module", error)
            reject(err);            
        }        
    }

// This below line of code will be used for deleting the modue name. We need to pass the module name for deleting the module
    static deletemodule(module_name)  // we are getting the module name 
    {
        try 
        {
            return new Promise((resolve, reject)=>
        {// The below line of code will find whether that module name is available or not with us which is entered in the body by the user
            let selQuery = `SELECT * FROM modules WHERE module_name = ?`;
                con.query(selQuery, [module_name], (err, result)=> // executing the above lines of code
                {
                    if(result.length > 0) // If we get that module name then this if block code will be executed
                    { // The below query is for deleting the module which was entered in the body
                        let updQuery = `DELETE FROM modules WHERE module_name = ?`;
                            con.query(updQuery, [module_name], (err, result)=> // executing the above lines of code
                            {
                                if(result) // if it is successfully done  then this if block code will be executed
                                {
                                    resolve('true'); // sending this result to module controller fucntion. From where this function is called
                                }
                                else  // if delete is not done and some kind of error occur then we execute this else statement
                                {
                                    reject(err);  // Err statement
                                }
                            });
                    }
                }); 
            });            
        } 
        catch (error) 
        {
            console.log("Internal Server error while deleting the module", error)
            reject(err);  
        }
    }
};

