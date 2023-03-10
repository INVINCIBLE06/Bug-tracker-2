/**\
 * The file contain the constant information or variable value. Which is used every where in the the progrma
 * that is why we have declared it here and used it everywhere.
 * 
 * In any case if we want to change it we can change it from here it will inflected every where.
 * This will useful for us. We don't have to change every time
 * Error in the code will not come when ever we are changing the constant value otherwise we have go and change it every where 
 */


module.exports = 
{
    loggedStatus :
    {
        login : "Login",
        logout : "Logout"
    },

    priority :
    {
        normal : "NORMAL",
        urgent : "URGENT",
        done : "DONE" 
    },

    status :
    {
        open : "OPEN",
        closed : "CLOSED",
        resolved : "RESOLVED",
        working : "WORKING",
        pending : "PENDING",
        active : "ACTIVE",
        inactive : "INACTIVE"
    },

    activity :
    {
        created : "CREATED",
        updated : "UPDATED",
        closed : "CLOSED"
    },

    role :
    {
        admin : "ADMIN",
        engineer : "ENGINEER"
    },

    allow :
    {
        yes : "YES",
        no : "NO"
    },

    module :
    {
        userregistration : "User Registration",
        usersignin : "User Signin",
        updatepassword : "Update Password",
        userprofile : "User Profile",
        alluserprofile : "All User Profile",
        addrole : "Add Role",
        updaterole : "Update Role",
        deleterole : "Delete Role",
        ticketcreate : "Ticket Create",
        updateticket : "Update Ticket",
        ticketassignee : "Ticket Assignee",
        viewallticket : "View All Ticket"
    },

    tickets_expiration_deadline_day : 2,

    event_scheduler_status :
    {
        on : "ON",
        off : "OFF"
    }
};