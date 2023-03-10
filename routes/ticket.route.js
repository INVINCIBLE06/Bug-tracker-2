const ticketcontroller = require('../controllers/ticket.controller'); // importing the ticket controller details
const verifyparams = require('../middlewares/verifyparams')// Importing the middlware for the validation of body and params data


module.exports = function(app)
{
    // the below route will be used to create the ticker
    app.post('/create/ticket/new', ticketcontroller.AddNewTicket);    
    // through the below ticket we will get all the ticket available in the database
    app.get('/get/all/ticket', ticketcontroller.getalltickets);
    // The below route will give all the expired ticket data
    app.get('/get/all/expired/ticket', ticketcontroller.GetExpiredTicket);
    // the below route will give all the which were asssignn to a particular enginee on the basisi of params
    app.get('/get/all/assigned/ticket/:assignee', verifyparams.CheckAssigneeEmailIsCorrectInParams, ticketcontroller.GetAssignedTicket);
    // the below route will give all the ticket which were created by a particular user on the basis of email id in the params
    app.get('/get/all/created/ticket/:reporter', verifyparams.CheckReporterEmailIdIsCorrectInParams, ticketcontroller.GetCreatedTicket);
    // The below will be updating the ticket status on basis of the ticket_id enterd in the params. it will also check whether the ticket id is correct or not 
    app.put('/started/working/ticket/:id', verifyparams.TicketIdIsCorrectInParams, ticketcontroller.EngineerStartedWorkignOnTheTicket);
    // The below route will be fetching all the resolved tickets
    app.get('/get/all/resolved/ticket', ticketcontroller.GetAllResolvedTicket);
    // The below route is for the admin. It will be use for changing the status of the ticket from resolved to closed. It will be done by the ticket id in the params
    app.get('/changed/ticket/closed/:id', verifyparams.TicketIdIsCorrectInParams, ticketcontroller.AdminWillChangeTheTicketStatusToClose);
    // The below route will give us back all the tickets where work is not started and there priority is already set to URGENT
    app.get('/notstatrtedworking/priority/urgent/ticket', ticketcontroller.PrioritySetToUrgentbutWorkNotStarted);
    // The below route will return us back all the urgent priority ticket
    app.get('/urgent/priority/tickets', ticketcontroller.GetAllUrgentPriorityTicket);
    // The below route will give us back the particular ticket report
    app.get('/ticket/report/:id', verifyparams.UserIdIsCorrectInParams, ticketcontroller.ParticularUserTicketActivityReport);
    // The below route will give us back all the ticket report
    app.get('/all/ticket/report', ticketcontroller.AllTicketActivityReport);
    // The below route is for downloading the attachment
    app.get('/file-download/:id', verifyparams.TicketIdIsCorrectInParams, ticketcontroller.DownloadAttachment);
}; 