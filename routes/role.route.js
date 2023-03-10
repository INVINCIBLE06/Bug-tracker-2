const rolecontroller = require('../controllers/role.controller');  // importing the details of the role controller
const duplicatecheck = require("../middlewares/duplicate.middleware"); // importing the duplicated middleware details

module.exports = function(app)
{
    /** 
     * the below role will add new role. it eill first check that the same role is not availble in the database
    */
    app.post('/add/new/role', duplicatecheck.duplicateRoleName, rolecontroller.AddNewRoloe);
    /**
     * the below role will check and update the role
     */
    app.put('/update/role/name', duplicatecheck.duplicateUpdateRoleName, rolecontroller.updateRolename);
    /**
     * the below route will used to delete the role
     */
    app.delete('/delete/role', rolecontroller.deleteRole);
    /**
     * the below route will give us all the roles available in the database 
     */
    app.get('/all/role', rolecontroller.getallrole);
}