const ticket = require("../models/ticket.model"); // Taking the tikcet model and assigning it to the ticket variable
const constants = require('../utils/constants'); // Importing the constatnt file details and intiliazing it into the constant variable
const con = require('../configs/db.config'); // importing the database details
const fs = require('fs'); // Importing the fs library. Intialing it into the fs variable 
const path = require('path'); // Importing the path library. Intialing it into the path variable 

/**
 * The below function is written for the ticket or bug creation and assignment
 */

exports.AddNewTicket = async(req, res, next)=>
{
    let tickets = await ticket.main.addnewticket(req.body.title, req.body.description, req.body.reporter, req.body.assignee, req.body.created_at, req.body.updated_at, req.body.expired_at, req.files);
    if(tickets)
    {
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "New ticket created successfully",
        });
    }
    else
    {
        return res.status(400).send
        ({
            success : false,
            code : 400,
            message : "You cannot assign youself",
        });
    }
};

/**
 * Checking the connection part is work or not
 * This is the code of that part
 * it is user to ticket
 */

exports.GetAllTic = async(req, res, next) => 
{
    let tickets = await ticket.main.getalltic();
    if(tickets)
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Ticket data successfully fetched",
                ticket : tickets
            });
    }
    else
    {
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Error while fetching ticket data",
            }) ;
    }
};


// The below function is used for getting the assigned ticket to a engineer.Because the engineer are only getting the ticket assigned
exports.GetAssignedTicket = async(req, res, next) => 
{
    let tickets = await ticket.main.getassignedticket(req.params.assignee) // On the basis of assignee or engineer email id in the params
    if(tickets.length != 0)
    {
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "All assigned tickets are fetched successfully",
            data : tickets
        });
    }
    else
    {
        return res.status(400).send
        ({
            success : true,
            code : 400,
            message : "No ticket are there for you"
        });
    }    
};

// Below fucntion is for getting all the tickets which was created by that particular user

exports.GetCreatedTicket = async(req, res, next) =>
{
    let tickets = await ticket.main.getcreatedticket(req.params.reporter); // On the basis of reporter email id in the params
    if(tickets.length != 0)
    {
        return res.status(200).send
        ({
            success : true,
            code : 200,
            message : "All created tickets are fetched successfully",
            data : tickets
        });
    }
    else
    {
        return res.status(400).send
        ({
            success : true,
            code : 400,
            message : "No ticket are there for you"
        });
    } 

};


/**
 * Below code has the code updatation of the ticket on the basis of the ticket id
 */

exports.EngineerStartedWorkignOnTheTicket = async(req, res, next) =>
{
    // Here will take message for user in the body and ticket id in the params for the updation. Message is required for updating the ticket
    let tickets = await ticket.main.engineerstartedworkignontheticket(req.params.id, req.body.message);  
    // console.log(tickets)
    if(tickets[0].status == constants.status.pending)
    {
        return res.send
        ({
            success : "true",
            code : 200,
            message : "Our team have not working. Ticket status changed to PENDING",
            data : tickets
        });
    }
    else if(tickets[0].status == constants.status.working)
    {
        return res.send
        ({
            success : "true",
            code : 200,
            message : "Our team have started working on ticket. Ticket status changed to WORKING",
            data : tickets
        });
    }
    else if(tickets[0].status == constants.status.resolved)
    {
        return res.send
        ({
            success : "true",
            code : 200,
            message : "Ticket have been resolved by the engineer. Ticket status have changed to RESOLVED. Now only ADMIN can close it",
            data : tickets
        });
    }
    else
    {
        return res.send
        ({
            success : "false",
            code : 400,
            message : "Work is not started on this ticket. It will done soon",
            data : tickets
        });
    }
};

// Below function will return us all the tickets which are having status as resolved

exports.GetAllResolvedTicket = async(req, res, next) => 
{
    let tickets = await ticket.main.getallresolvedticket();
    if(tickets)
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Resolved Ticket data successfully fetched",
                data : tickets
            })
    }
    else
    {
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Error while fetching resolved ticket data",
            }) 
    }
};

// Below function will used for the admin. Because the admin is the only one who can close the ticket after resolved
// Engineer cannot close the ticket. They can just update the status till resolved after that only admin can do it
exports.AdminWillChangeTheTicketStatusToClose = async (req, res) =>
{
    // Taking the message form the req body and ticket id in the params for updating this is made for only the admin. 
    let tickets = await ticket.main.adminwillchangetheticketstatustoclose(req.params.id, req.body.message);
    if(tickets.length != 0)
    {
        return res.send
        ({
            success : true,
            code : 200,
            message : "ADMIN have changed the ticket status to CLOSED",
            data : tickets
        });
    }
    else
    {
        return res.send
        ({
            success : false,
            code : 400,
            message : "Ticket is already closed by the admin. Please open a new ticket for your concerns"
        });
    }    
};

/**
 * The below block of code is used to get all the tickets where the ticket priority is urgent 
 */

exports.GetAllUrgentPriorityTicket = async(req, res) =>
{
    let tickets = await ticket.main.getallurgentpriorityticket();
    if(tickets.length != 0) // If there are ticket available whose priority are URGENT. The below block of code will be executed
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Urgent Ticket data successfully fetched",
                data : tickets
            }); 
    } // If there are no ticket available whose priority is not URGENT. The below block of codee will be exwecuted
    else if(tickets.length == 0)
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Righnow there are no urgent priority tickets available",
                data : tickets
            });
    }
    else // The below of code will be executed when there will be any kind of error occured will fetching the Urgent Priority ticket
    {
        return res.status(400).send
        ({
            success : false,
            code : 400,
            message : "Error while fetching urgent ticket data",
        });
    }
};

/**
 * The below function contain the code for ticket whose status is OPEN or PENDING but the priority is URGENT 
 */

exports.PrioritySetToUrgentbutWorkNotStarted = async(req, res) =>
{
    let tickets = await ticket.main.priorityspetourgentbutworknotstarted();
    if(tickets.length != 0)  // If we have the code successfully executed and we have ticket whose meets the condition then this block of code will be executed
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Urgent Priority Ticket Where Work Not Started Are Sucessfully Fetched",
                data : tickets
            });
    }
    else if(tickets.length == 0) // If we have the code successfully executed and we don't have tickets whose meets the condition then this block of code will be executed
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "Righnow there are no urgent priority tickets available. Where work is not started",
                data : tickets
            });
    }
    else // If we encounter any kind of error while fetching the ticket whose status is OPEN or PENDING but the priority is URGENT 
    {
        return res.status(400).send
        ({
            success : false,
            code : 400,
            message : "Error while fetching urgent ticket data urgent priority ticket",
        });
    }
};

// The below function is for getting the tickets report for the particular who have created it

exports.ParticularUserTicketActivityReport = async (req, res) =>
{
    let tickets = await ticket.main.particularuserticketactivityreport(req.params.id);
    if(tickets != 0)
    {
        return res.send
        ({
            success : true,
            code : 200,
            message : "Successful",
            data : tickets 
        });
    }
    else
    {
        console.log("Error occured while fetching the particular ticket report");
        return res.send
        ({
            success : true,
            code : 200,
            message : "The id which is related to this ticket is closed now",
            data : tickets 
        });
    }
}; 
// The below function is for getting the ticket activity report for all the tickets available in the database 
exports.AllTicketActivityReport = async (req, res) =>
{
    let tickets = await ticket.main.allticketactivityreport();
    if(tickets)
    {
        res.send
        ({
            success : true,
            code : 200,
            message : "All ticket report fetched succesfully",
            data : tickets 
        }); 
    }
    else
    {
        res.send
        ({
            success : false,
            code : 400,
            message : "There are no tickets closed. Report will be available after the ticket is closed",
            data : tickets 
        }); 
    }

};

/**
 * The below function contains the code for dowloading the attachment. The attachment is attached at the time of
 * ticket creation. 
 */
 
exports.DownloadAttachment = async (req, res) => 
{
    let tickets = await ticket.main.downloadattachment(req.params.id, res);
    if(tickets)
    {
        res.status(200).send
        ({
            success : false,
            code : 200,
            message : 'Internal server error',
            file : tickets
        });  

    }
    else if (tickets == 500)
    {
        res.status(500).send
        ({
            success : false,
            code : 500,
            message : 'Internal server error',
        });        
    }
    else if(tickets == 404)
    {
        res.status(404).send
        ({
            success: false,
            code : 404,
            message: 'File not found',
        });
    }

};


