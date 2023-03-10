const modules = require('../models/module.model'); // importing the module details and assing it to the modules variable
// Below route is used for adding the new module
exports.AddNewModule = async(req, res, next)=>
{
    let modules2 = await modules.addOneModule(req.body.module_name, req.body.active); // taking the module name and module status for adding
    if(modules2)
    {
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "Module added sucessfully",
        });
    }
    else
    {
        return res.status(400).send
        ({
            success : false,
            code : 400,
            message : "Error in adding new module",
        });
    }
}

// The below function will give all the active module that are available in the database
exports.GetAllActiveModule = async(req, res, next) => 
{
    let modules2 = await modules.getallactivemodule();
    if(modules2)
    {
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "Module data successfully fetched",
            module : modules2
        });
    }
    else
    {
        return res.status(400).send
        ({
            success : false,
            code : 400,
            message : "Error while fetching Module data",
        }) ;
    }
};



// The below route will be used for updating the module name

exports.updateModulename = async(req, res, next)=>
{
    let modules2 = await modules.updateOneModule(req.body.module_name, req.body.new_modulename);  // Taking the current and new module name for updating the module name 
    if(modules2)
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

// The below function will be used for updating the status of modules
exports.UpdateModuleActiveStatus = async(req, res, next)=>
{
    // Taking the module name and status(active, inactive)
    let modules2 = await modules.ModuleStatusUpdate(req.body.module_name, req.body.active);
    if(modules2)
    {
            return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Status Updated Successfully",
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

// The below route is used for deleting the module on the basis of module name

exports.DeleteModule = async(req, res, next) =>
{
    let modules2 = await modules.deletemodule(req.body.module_name);
    if(modules2)
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
                success : false,
                code : 400,
                message : "Failed",
            });
    }
};