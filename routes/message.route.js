const messagecontroller = require('../controllers/message.controller'); // Importing the message controller details
const verifyparams = require('../middlewares/verifyparams');  // Importing the middlware for the validation of body and params data
const { emailvalidation } = require("../middlewares/email.middleware"); // importing the email validation

module.exports = function(app)
{
    // This route is for the reporter message side
    app.post('bugtracker/api/add/repo/mess/:id',emailvalidation, verifyparams.TicketIdIsCorrectInParams, messagecontroller.ReporterMessage);
    // This route is for the assignee message side
    app.post('bugtracker/api/add/ass/mess/:id', verifyparams.TicketIdIsCorrectInParams, messagecontroller.AssigneeMessage);
    // This route is for admin message side
    app.post('bugtracker/api/add/admin/mess/:id', verifyparams.TicketIdIsCorrectInParams, messagecontroller.AdminMessage);
    // This route will give all the message based on the particular ticket
    app.get('bugtracker/api/all/mess/:id', verifyparams.TicketIdIsCorrectInParams, messagecontroller.GetAllMessageSendOnParticularTicket)
};

