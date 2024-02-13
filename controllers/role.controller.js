const role = require('../models/role.model');  //importing the role module and assign it to role variable 

// The below function is used for adding the role
exports.AddNewRoloe = async(req, res, next)=>
{
    let roles = await role.addOneRole(req.body.role_name); // Taking the role name from the body
    if(roles)
    {
        // res.send('New role Added Successfully');
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "Role added sucessfully",
            // data : roles
        });
    }
    else
    {
        // res.send('New role added Failed');
        return res.status(400).send
        ({
            success : false,
            code : 400,
            message : "Error in adding new role",
            // data : role
        });
    }
}

//The below function used for updating the role name 
exports.updateRolename = async(req, res, next)=>
{
    // taking the rolename and new rolename from the body
    let roles = await role.updateOneRole(req.body.role_name, req.body.new_rolename);
    if(roles)
    {
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "Updated Successfully",
        });
    }
    else
    {
        return res.status(400).send
        ({
            success : false,
            code : 400,
            message : "Update request failed",
        });
    }
};

// Deleting the role on the basis of the role name
exports.deleteRole = async(req, res, next)=>
{
    let roles = await role.deleteOneRole(req.body.role_name);
    if(roles)
    {
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "Deleted Successfully",
        });
    }
    else
    {
        return res.status(400).send
        ({
            success : true,
            code : 400,
            message : "Failed",
        });
    }
};

// This route will give us all the role
exports.getallrole = async(req, res, next) => 
{
    let roles = await role.getallrole();
    if(roles)
    {
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "Role data successfully fetched",
            roles: roles
        });
    }
    else
    {
        return res.status(400).send
        ({
            success : false,
            code : 400,
            message : "Error while fetching role data",
        }); 
    }
};