const message = require('../models/message.model');// importing message module details and assign it to the message variable

// This function is for the reporter message 
exports.ReporterMessage = async(req, res) =>
{
    const messages = await message.reportermessage(req.params.id, req.body.email, req.body.message); // get the id which was entered in the params
    if(messages.length != 0)
    {
        res.send
        ({
            success : true,
            code : 200,
            message : "Reporter message send successfully" 
        });        
    }
    else
    {
        res.send
        ({
            success : false,
            code : 400,
            message : "Error while sending the repoprter message"
        });
    }
};

// This function is for the assignee message 
exports.AssigneeMessage = async(req, res) =>
{
    const messages = await message.assigneemessage(req.params.id, req.body.email, req.body.message);  // get the id which was entered in the params
    if(messages.length != 0)
    {
        res.send
        ({
            success : true,
            code : 200,
            message : "Assignee message send successfully" 
        });        
    }
    else
    {
        res.send
        ({
            success : false,
            code : 400,
            message : "Error while sending the assignee message"
        });
    }
};

// This function is for the admin message 

exports.AdminMessage = async(req, res) =>
{
    const messages = await message.adminmessage(req.params.id, req.body.email, req.body.message); // get the id which was entered in the params
    if(messages.length != 0)
    {
        res.send
        ({
            success : true,
            code : 200,
            message : "Admin send successfully" 
        });        
    }
    else
    {
        res.send
        ({
            success : false,
            code : 400,
            message : "Error while sending the ADMIN message"
        });
    }
};

// This message is for getting all the message on the particular id

exports.GetAllMessageSendOnParticularTicket = async(req, res, next) => 
{
    let messages = await message.getallmessagesendonparticularticket(req.params.id);  // get the id which was entered in the params
    if(messages)
    {
        return res.status(200).send
            ({
                success : true,
                code : 200,
                message : "All Messages successfully fetched",
                modules : messages
            });
    }
    else
    {
        return res.status(400).send
            ({
                success : false,
                code : 400,
                message : "Error while fetching all message data",
            }); 
    }
};