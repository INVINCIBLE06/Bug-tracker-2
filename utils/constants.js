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
        inactive : "INACTIVE",
        verified : "VERIFIED",
        notverified : "NOT-VERIFIED"
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

    day_or_minutes_protection_policy_numbers :
    {
        number_of_incorrect_password_attempt : 5,
        user_blocked_for_days : 1,
        number_of_minutes_after_OTP_will_blocked : 3,
        link_valid_till : 300, // 5 minutes are converted into seconds
        tickets_expiration_deadline_day : 2,
        token_time : 86400, // 24 hours converted into seconds
    },
 
    event_scheduler_status :
    {
        on : "ON",
        off : "OFF"
    },

    purpose :
    {
        Passwordreset : "Passwordreset",
        emailVerfication : "emailVerfication",
        authentication : "authentication",
    },

    subject :
    {
        pr : "Password reset",
        ev : "Email verification",
        tan : "Ticket Assigned Notofication"
    }
};


