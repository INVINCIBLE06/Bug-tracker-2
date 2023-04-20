const express = require('express');  // importing the express library after installing it.
const app = express(); // assingning the app variable with express variable function
// const bodyParser = require('body-parser'); // Importing bodyParser library after installing it using npm i body-parser 
const upload = require('express-fileupload');
const deletetable = require('./deletetable');
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true })); // through this statement we can used the json data in the form data
// app.use(bodyParser.json()); // through this statement we can used the json data in the json structure
app.use(express.json()); // This line is adding middleware to the app that parses incoming request bodies with JSON payloads. It allows us to access request data sent in JSON format through the `req.body` property in our route handlers.
app.use(upload()); // We are using the upload file which have all the functionalities of

// deletetable();

require("./routes/auth.route")(app); // importing the auth routes data from the route folder
require("./routes/role.route")(app); // importing the role routes data from the route folder
require("./routes/user.route")(app); // importing the user routes data from the route folder
require("./routes/ticket.route")(app); // importing the ticket routes data from the route folder
require("./routes/module.route")(app); // importing the module modules data from the route folder
require("./routes/message.route")(app); // importing the message data from the route folder

module.exports = app; // making the app variable for export
 