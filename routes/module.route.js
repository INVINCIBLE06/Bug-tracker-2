const modulecontroller = require('../controllers/module.controller');  // importing the module controller details
const duplicatecheck = require("../middlewares/duplicate.middleware"); // importing the duplicated middleware details
const tokenVerification = require('../middlewares/token.verification'); 

module.exports = function(app)
{
    /** 
    * the below route will add new module. it will first check that the same module is not availble in the database
    */
    app.post('/add/new/module', tokenVerification.IsAdminTokenVerification, duplicatecheck.duplicateModuleName, modulecontroller.AddNewModule);
    // Below route is uised for changing the module name or updating the module name 
    app.put('/update/module/name', tokenVerification.IsAdminTokenVerification, duplicatecheck.duplicateUpdateModuleName, modulecontroller.updateModulename);
    // This route will give all the active module in the db
    app.get('/all/active/module', tokenVerification.IsAdminTokenVerification, modulecontroller.GetAllActiveModule);
    // This route will be used for deleting the module
    app.delete('/delete/module', tokenVerification.IsAdminTokenVerification, modulecontroller.DeleteModule);
    // This route will be used for updating the status from active to inactive or inactive to active
    app.put('/update/module/status', tokenVerification.IsAdminTokenVerification, modulecontroller.UpdateModuleActiveStatus);
}