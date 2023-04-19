const app  = require('./app'); // Importing app.js varibale  

/**
 * Below code is used for staring our server
 */

app.listen(process.env.PORT, () =>
{
    console.log("My application running successfully on the port number :-", +process.env.PORT);
});  