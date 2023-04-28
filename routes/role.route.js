const rolecontroller = require('../controllers/role.controller');  // importing the details of the role controller
const duplicatecheck = require("../middlewares/duplicate.middleware"); // importing the duplicated middleware details
const tokenVerification = require('../middlewares/token.verification'); 



module.exports = function(app)
{
    /** 
     * the below role will add new role. it eill first check that the same role is not availble in the database
    */
    app.post('bugtracker/api/add/new/role', tokenVerification.IsAdminTokenVerification, duplicatecheck.duplicateRoleName, rolecontroller.AddNewRoloe);
    /**
     * the below role will check and update the role
     */
    app.put('bugtracker/api/update/role/name', tokenVerification.IsAdminTokenVerification, duplicatecheck.duplicateUpdateRoleName, rolecontroller.updateRolename);
    /**
     * the below route will used to delete the role
     */
    app.delete('bugtracker/api/delete/role', tokenVerification.IsAdminTokenVerification, rolecontroller.deleteRole);
    /**
     * the below route will give us all the roles available in the database 
     */
    app.get('bugtracker/api/all/role', tokenVerification.IsAdminTokenVerification, rolecontroller.getallrole);
}