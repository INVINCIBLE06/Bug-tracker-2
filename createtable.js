const con = require('./configs/db.config');  // importing the database details
const init = require('./init'); // importing the init file data and assigninfg it to another variable
const constants = require('./utils/constants'); // Importing the constants file. This file contain the constant details
const readline = require("readline");
const time = require('./models/ticket.model');

module.exports = async function() 
{ 
    try 
    {
        con.connect(function(err) // Making connection with the database
        { // the below query is for the creating the role table
           let ctrQury = `CREATE TABLE roles(id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                          role_name VARCHAR(50),
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP )`;
            con.query(ctrQury,(err, result1) => // executing the above query
            {
                if(result1) // the role table is successfully created, then the if block code will be executed
                {
                    if(result1.length != 0) // the table is successfully created, then the if block code will be executed
                    { // the below query is for the creating the user table
                        console.log(' #### Role table successfully created #### ');
                            let ctrQury2 = `CREATE TABLE users(
                                            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                            name VARCHAR(255) NOT NULL,
                                            email varchar(255),
                                            email_verified ENUM ( '${constants.status.notverified}', '${constants.status.verified}') DEFAULT '${constants.status.notverified}',
                                            mobile varchar(255),
                                            date_of_birth varchar(255),
                                            status ENUM ('${constants.status.active}', '${constants.status.inactive}') DEFAULT '${constants.status.active}',
                                            security_question varchar(255) DEFAULT 'Who is your chilhood hero ?',
                                            security_answer varchar(255),
                                            password varchar(255),
                                            confirm_password varchar(255),
                                            role_Id INT,
                                            FOREIGN KEY (role_Id) REFERENCES roles(id),                                 
                                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                            updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                                            INDEX index1(id)
                                            )`;         
                        con.query(ctrQury2, (err, resultm2) => // executing the above query
                        { 
                            if(resultm2.length != 0) // the user table is successfully created, then the if block code will be executed
                            { // the below query is for the creating the ticket table
                                console.log(' #### User table successfully created #### ');
                                let ctrQury3 = `CREATE TABLE tickets(
                                    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                                    title VARCHAR(255) NOT NULL,
                                    description varchar(255) NOT NULL,
                                    reporter varchar(255) NOT NULL,
                                    assignee varchar(255) NOT NULL,
                                    priority ENUM ('${constants.priority.normal}', '${constants.priority.urgent}') DEFAULT '${constants.priority.normal}',
                                    status ENUM ('${constants.status.open}', '${constants.status.pending}', '${constants.status.closed}', '${constants.status.working}', '${constants.status.resolved}') DEFAULT '${constants.status.open}',
                                    image_name VARCHAR(255),
                                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                    expired_at DATETIME,
                                    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                                    reporter_Id INT,
                                    FOREIGN KEY(reporter_Id) REFERENCES users(id),
                                    assignee_Id INT,
                                    FOREIGN KEY(assignee_Id) REFERENCES users(id),
                                    INDEX index2(id, reporter_Id, assignee_Id)
                                    )`;
                                con.query(ctrQury3, (err, resultm3) => // executing the above query
                                { 
                                    if(resultm3.length != 0) // If the ticket table is successfully created then this if block code
                                    {
                                        console.log(' #### Ticket table successfully created #### ');  // the below query is for the creating the modules table
                                        let ctrQury4 = `CREATE TABLE modules
                                                        (
                                                        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                                        module_name VARCHAR(255) NOT NULL,
                                                        active ENUM ('${constants.allow.yes}', '${constants.allow.no}') DEFAULT '${constants.allow.yes}',
                                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                        updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
                                                        )`;
                                        con.query(ctrQury4, (err, resultm4) => // executing the above query
                                        { // If the modules table is successfully created then this if block code
                                            if(resultm4.length != 0)
                                            {
                                                console.log(' #### Module table successfully created #### '); 
                                                // the below query is for the inserting into the modules table
                                                // The module names are in the constant file. We are importing it from there dureclty. 
                                                let InsQuery = `INSERT INTO modules(module_name,active) VALUES ('${constants.module.userregistration}', '${constants.allow.yes}'), ('${constants.module.usersignin}', '${constants.allow.yes}'), ('${constants.module.updatepassword}', '${constants.allow.yes}'), ('${constants.module.userprofile}', '${constants.allow.yes}'), ('${constants.module.alluserprofile}', '${constants.allow.yes}'),('${constants.module.addrole}', '${constants.allow.yes}'),('${constants.module.updaterole}', '${constants.allow.yes}'),('${constants.module.deleterole}', '${constants.allow.yes}'),('${constants.module.ticketcreate}', '${constants.allow.yes}'),('${constants.module.updateticket}', '${constants.allow.yes}'),('${constants.module.ticketassignee}', '${constants.allow.yes}'),('${constants.module.viewallticket}', '${constants.allow.yes}')`;
                                                con.query(InsQuery, (err, resultm5) => // executing the above query
                                                { 
                                                    if(resultm5.length != 0) // If the modules table is filled correctly and successfully then this if block code
                                                    {
                                                        console.log(' #### Data inserted successfully in the module table #### ');
                                                        // the below query is for the creating the permission table
                                                        let ctrQury5 = `CREATE TABLE permissions(
                                                                        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                                                        user_Id INT,
                                                                        FOREIGN KEY (user_Id) REFERENCES users(id),
                                                                        role_Id INT,
                                                                        FOREIGN KEY (role_Id) REFERENCES roles(id),
                                                                        module_Id INT,
                                                                        FOREIGN KEY (module_Id) REFERENCES modules(id))`;
                                                        con.query(ctrQury5, (err, resultm6) => // executing the above query
                                                        { 
                                                            if(resultm6.length != 0) // If the permission table is successfully created then this if block code
                                                            {
                                                                console.log(' #### Permission table successfully created #### ');
                                                                // the below query is for the creating the messages table
                                                                let ctrQury6 = `CREATE TABLE messages(
                                                                                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                                                                assignee_Id INT NOT NULL,
                                                                                FOREIGN KEY(assignee_Id) REFERENCES users(id),
                                                                                reporter_Id INT NOT NULL,
                                                                                FOREIGN KEY (reporter_Id) REFERENCES users(id),
                                                                                ticket_Id INT NOT NULL,
                                                                                FOREIGN KEY (ticket_Id) REFERENCES tickets(id),
                                                                                message VARCHAR(255) NOT NULL,
                                                                                sender_role VARCHAR(255) NOT NULL,
                                                                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                                                INDEX index3(ticket_id)
                                                                                )`;
                                                                con.query(ctrQury6, (err, resultm7) => // executing the above query
                                                                {
                                                                    if(resultm7.length != 0) // If the messages table is successfully created then this if block code
                                                                    {
                                                                        console.log(' #### Message table successfully created #### ');
                                                                        // the below query is for the creating the users_activities table
                                                                        let ctryQuery7 =   `CREATE TABLE users_activities(
                                                                                            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                                                                                            ip_address VARCHAR(255) NOT NULL,
                                                                                            user_id INT,
                                                                                            FOREIGN KEY(user_id) REFERENCES users(id),
                                                                                            activity ENUM('${constants.loggedStatus.login}', '${constants.loggedStatus.logout}') DEFAULT '${constants.loggedStatus.login}',
                                                                                            description VARCHAR(255),
                                                                                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                                                                                            )`;
                                                                        con.query(ctryQuery7, (err, resultm8) => // executing the above query
                                                                        {
                                                                            if(resultm8.length != 0) // If the users_activities table is successfully created then this if block code
                                                                            {
                                                                                console.log(' #### Logged table successfully created #### ');
                                                                                // the below query is for the creating the tickets_activities table
                                                                                let ctryQuery8 = `CREATE TABLE tickets_activities(
                                                                                                  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                                                                                  ip_address VARCHAR(255) NOT NULL,
                                                                                                  ticket_Id INT,
                                                                                                  FOREIGN KEY(ticket_Id) REFERENCES tickets(id),
                                                                                                  reporter_Id INT,
                                                                                                  FOREIGN KEY(reporter_Id) REFERENCES users(id),
                                                                                                  assignee_Id INT,
                                                                                                  FOREIGN KEY(assignee_Id) REFERENCES users(id),
                                                                                                  activity ENUM ('${constants.activity.created}','${constants.activity.updated}','${constants.activity.closed}'),
                                                                                                  status ENUM ('${constants.status.open}','${constants.status.resolved}','${constants.status.closed}','${constants.status.working}','${constants.status.pending}'),
                                                                                                  priority ENUM('${constants.priority.urgent}', '${constants.priority.normal}', '${constants.priority.open}'),
                                                                                                  description VARCHAR(255),
                                                                                                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                                                                                                  )`;
                                                                                con.query(ctryQuery8, (err, resultm9) => // executing the above query
                                                                                {
                                                                                    if(resultm9.length != 0) // If the tickets_activities table is successfully created then this if block code
                                                                                    {
                                                                                        console.log(' #### Ticket logged table successfully created #### ');
                                                                                         // the below query is for the creating the insertintousers_activities stored procedure
                                                                                        let prcCre = `CREATE PROCEDURE insertintousers_activities(ip_address1 VARCHAR(255), user_id1 INT, activity1 VARCHAR(255), description1 VARCHAR(255))
                                                                                                      BEGIN
                                                                                                      INSERT INTO users_activities(ip_address, user_id, activity, description) VALUES(ip_address1, user_id1, activity1, description1);
                                                                                                      END`;
                                                                                        con.query(prcCre, (err, resultm10) => // executing the above query
                                                                                        {
                                                                                            if(resultm10.length != 0) // If the insertintousers_activities stored procedure is successfully created then this if block code
                                                                                            {
                                                                                                console.log(' #### insertintousers_activities stored procedure successfully created #### ');
                                                                                                // the below query is for the creating the insertintotickets_activities stored procedure
                                                                                                let prcCre2 = `CREATE PROCEDURE insertintotickets_activities(ip_address1 VARCHAR(255), ticket_Id INT, reporter_Id INT, assignee_Id INT, activity1 VARCHAR(255), status VARCHAR(255), priority VARCHAR(255), description1 VARCHAR(255))
                                                                                                               BEGIN
                                                                                                               INSERT INTO tickets_activities(ip_address, ticket_Id, reporter_Id, assignee_Id, activity, status, priority, description) 
                                                                                                               VALUES(ip_address1, ticket_Id, reporter_Id, assignee_Id, activity1, status, priority, description1);
                                                                                                               END`;
                                                                                                con.query(prcCre2, (err, resultm11) => // executing the above query
                                                                                                {
                                                                                                    if(resultm11.length != 0) // If the insertintotickets_activities stored procedure is successfully created then this if block code
                                                                                                    {
                                                                                                        console.log(' #### insertintotickets_activities stored procedure successfully created #### ');
                                                                                                        // the below query is for the creating the checkticketsexiparation event
                                                                                                        let eventCre1 = `CREATE EVENT checkticketsexiparation
                                                                                                                         ON SCHEDULE EVERY 5 SECOND
                                                                                                                         ON COMPLETION PRESERVE
                                                                                                                         DO
                                                                                                                         BEGIN
                                                                                                                         UPDATE tickets t SET t.priority = '${constants.priority.urgent}'
                                                                                                                         WHERE (SELECT DATEDIFF(tickets.created_at, tickets.expired_at)) > '${constants.day_or_minutes_protection_policy_numbers.tickets_expiration_deadline_day}' 
                                                                                                                         AND t.priority = '${constants.priority.normal}' 
                                                                                                                         AND t.status = '${constants.status.open}'
                                                                                                                         OR t.status = '${constants.status.pending}'
                                                                                                                         OR t.status = '${constants.status.working} '; 
                                                                                                                         END`
                                                                                                        con.query(eventCre1, (err, resultm12) => // executing the above query
                                                                                                        {
                                                                                                            if(resultm12.length != 0) // If the checkticketsexiparation event is successfully created then this if block code
                                                                                                            {
                                                                                                                console.log(' #### checkticketexiparation event is successfully created ####'); 
                                                                                                                // the below query is for the creating the reports table                                                                                                            
                                                                                                                let ctryQuery9 = `  CREATE TABLE reports(
                                                                                                                                    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                                                                                                                                    user_id INT,
                                                                                                                                    FOREIGN KEY (user_id) REFERENCES users(id),
                                                                                                                                    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                    logout_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP ,
                                                                                                                                    total_hours TIME DEFAULT NULL)`;
                                                                                                                con.query(ctryQuery9, (err, resultm13) => // executing the above query
                                                                                                                {
                                                                                                                    if(resultm13.length != 0) // If the reports table is successfully created then this if block code
                                                                                                                    {
                                                                                                                        console.log(" #### results table created successfully ####");
                                                                                                                        // the below query is for the creating the insertintoreportswhilelogin stored procedure
                                                                                                                        let prcCre3 = ` CREATE PROCEDURE insertintoreportswhilelogin(user_id INT)
                                                                                                                                        BEGIN
                                                                                                                                        INSERT INTO reports(user_id) VALUES(user_id); 
                                                                                                                                        END`;
                                                                                                                        con.query(prcCre3, (err, resultm14) => // executing the above query
                                                                                                                        {                                                                                                                            
                                                                                                                            if(resultm14.length != 0) // If the insertintoreportswhilelogin stored procedure is successfully created then this if block code
                                                                                                                            {
                                                                                                                                console.log(" #### insertintoreportswhilelogin stored procedure created successfully ####");
                                                                                                                                // the below query is for the creating the insertintoreportswhilelogout stored procedure
                                                                                                                                let prcCre4 =  `CREATE PROCEDURE insertintoreportswhilelogout(user_id INT)
                                                                                                                                                BEGIN
                                                                                                                                                UPDATE reports rs SET rs.logout_time = CURRENT_TIME() 
                                                                                                                                                WHERE rs.login_time IS NOT NULL
                                                                                                                                                AND rs.user_id = user_id
                                                                                                                                                AND rs.logout_time IS NULL;
                                                                                                                                                END`;
                                                                                                                                con.query(prcCre4, (err, resultm15) => // executing the above query
                                                                                                                                {
                                                                                                                                    if(resultm15.length != 0) // If the insertintoreportswhilelogout stored procedure is successfully created then this if block code
                                                                                                                                    {
                                                                                                                                        console.log(" #### insertintoreportswhilelogout stored procedure created successfully ####");
                                                                                                                                        // the below query is for the creating the insertintoreportfortotalloggedhours stored procedure
                                                                                                                                        let prcCre5 = ` CREATE PROCEDURE insertintoreportfortotalloggedhours(user_Id INT)
                                                                                                                                                        BEGIN
                                                                                                                                                        UPDATE reports rs 
                                                                                                                                                        SET rs.total_hours = TIME(TIMEDIFF(rs.logout_time, rs.login_time))
                                                                                                                                                        WHERE rs.user_id = user_Id
                                                                                                                                                        AND rs.login_time IS NOT NULL
                                                                                                                                                        AND rs.logout_time IS NOT NULL;
                                                                                                                                                        END`;
                                                                                                                                        con.query(prcCre5, (err, resultm16) => // executing the above query
                                                                                                                                        {
                                                                                                                                            if(resultm16.length != 0) // If the insertintoreportfortotalloggedhours stored procedure is successfully created then this if block code
                                                                                                                                            {
                                                                                                                                                console.log(" #### insertintoreportfortotalloggedhours stored procedure created successfully ####");
                                                                                                                                                // the below query is for the creating the myactivitylogs stored procedure
                                                                                                                                                let prcCre6 =  `CREATE PROCEDURE myactivitylogs(user_Id INT)
                                                                                                                                                                BEGIN
                                                                                                                                                                SELECT * FROM reports r WHERE r.user_id = user_Id;
                                                                                                                                                                END `;
                                                                                                                                                con.query(prcCre6, (err, resultm16) => // executing the above query
                                                                                                                                                {
                                                                                                                                                    if(resultm16.length != 0) // If the myactivitylogs stored procedure is successfully created then this if block code
                                                                                                                                                    {
                                                                                                                                                        console.log(" #### myactivitylogs stored procedure created successfully ####");
                                                                                                                                                        // The below query is for enabling the event scheduler to ON status
                                                                                                                                                        let seteventOn = `SET GLOBAL event_scheduler = '${constants.event_scheduler_status.on}' `;
                                                                                                                                                        con.query(seteventOn, (err, resultm17) => // executing the above query
                                                                                                                                                        {
                                                                                                                                                            if(resultm17.length != 0) // If the scheduler is successfully enabled then this if block of code 
                                                                                                                                                            {
                                                                                                                                                                console.log(' #### Event scheduler status have been set to ON. It is required. Otherwise our event will not work #### ');
                                                                                                                                                                let ctryQuery9 = `  CREATE TABLE otpstores(
                                                                                                                                                                                    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                                                                                                                                                                                    user_Id INT,
                                                                                                                                                                                    FOREIGN KEY (user_id) REFERENCES users(id),
                                                                                                                                                                                    otp VARCHAR(255) NOT NULL,
                                                                                                                                                                                    status ENUM('${constants.status.active}', '${constants.status.inactive}') DEFAULT '${constants.status.active}',
                                                                                                                                                                                    expired_at DATETIME DEFAULT NULL,
                                                                                                                                                                                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                                                                    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP )`;
                                                                                                                                                                con.query(ctryQuery9, (err, resultm18) =>
                                                                                                                                                                {
                                                                                                                                                                    if(resultm18.length != 0)
                                                                                                                                                                    {
                                                                                                                                                                        console.log(" #### otpstores table created successfully ####");
                                                                                                                                                                        let ctryQuery10 = ` CREATE TABLE login_incorrect_attempts(
                                                                                                                                                                                            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                                                                                                                                                                                            user_Id INT,
                                                                                                                                                                                            FOREIGN KEY (user_id) REFERENCES users(id),
                                                                                                                                                                                            incorrect_count INT,
                                                                                                                                                                                            status ENUM('${constants.status.active}', '${constants.status.inactive}') DEFAULT '${constants.status.active}',
                                                                                                                                                                                            last_attempt DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                                                                            blocked_till DATETIME DEFAULT NULL,
                                                                                                                                                                                            updated_at DATETIME DEFAULT NULL
                                                                                                                                                                                            )`;
                                                                                                                                                                        con.query(ctryQuery10, (err, resultm19) =>
                                                                                                                                                                        {
                                                                                                                                                                            if(resultm19.length != 0)
                                                                                                                                                                            {
                                                                                                                                                                                console.log(" #### login_incorrect_attempts table created successfully ####");
                                                                                                                                                                                let eventCre2 = `   CREATE EVENT unblockuserfromlogin
                                                                                                                                                                                                    ON SCHEDULE EVERY 1 MINUTE
                                                                                                                                                                                                    ON COMPLETION PRESERVE
                                                                                                                                                                                                    DO
                                                                                                                                                                                                    BEGIN
                                                                                                                                                                                                    UPDATE login_incorrect_attempts l
                                                                                                                                                                                                    SET l.status = '${constants.status.inactive}',
                                                                                                                                                                                                    l.updated_at = '${time.nowd()}'
                                                                                                                                                                                                    WHERE TIMEDIFF('${time.nowd()}', l.blocked_till) > TIME('00:00:00')
                                                                                                                                                                                                    AND l.status = '${constants.status.active}'
                                                                                                                                                                                                    AND l.updated_at IS NULL
                                                                                                                                                                                                    AND l.incorrect_count = '${constants.day_or_minutes_protection_policy_numbers.number_of_incorrect_password_attempt}';
                                                                                                                                                                                                    END `; 
                                                                                                                                                                                con.query(eventCre2, (err, result20) =>
                                                                                                                                                                                {
                                                                                                                                                                                    if(result20.length != 0)
                                                                                                                                                                                    {
                                                                                                                                                                                        console.log(" #### unblockuserfromlogin event created successfully #### ");
                                                                                                                                                                                        let eventCre3 = `   CREATE EVENT OTPisexpired
                                                                                                                                                                                                            ON SCHEDULE EVERY 1 SECOND
                                                                                                                                                                                                            ON COMPLETION PRESERVE
                                                                                                                                                                                                            DO
                                                                                                                                                                                                            BEGIN
                                                                                                                                                                                                            UPDATE otpstores ot
                                                                                                                                                                                                            SET ot.status = '${constants.status.inactive}'
                                                                                                                                                                                                            WHERE ot.status = '${constants.status.active}'
                                                                                                                                                                                                            AND TIMEDIFF(NOW(), ot.expired_at) > TIME('00:00:00');
                                                                                                                                                                                                            END `;
                                                                                                                                                                                        con.query(eventCre3, (err, result21) =>
                                                                                                                                                                                        {
                                                                                                                                                                                            if(result21.length != 0)
                                                                                                                                                                                            {
                                                                                                                                                                                                console.log(' #### OTPisexpired event created successfully #### ')
                                                                                                                                                                                                console.log(' #### All Stored procedured are created #### ');
                                                                                                                                                                                                console.log(' #### All Events are created #### ');
                                                                                                                                                                                                console.log(' #### All tables are created #### ');
                                                                                                                                                                                                console.log('-------------------------------------------------------------------------------------');
                                                                                                                                                                                                var rl3 = readline.createInterface(process.stdin, process.stdout);
                                                                                                                                                                                                rl3.question(" #### Tables are created successfully. Do you want to enter the data into the table (YES/NO) #### \n ", function (string3) 
                                                                                                                                                                                                {
                                                                                                                                                                                                    if((string3.toLocaleUpperCase()) == constants.allow.yes)
                                                                                                                                                                                                    {
                                                                                                                                                                                                        init(); // We are calling the createtable variable. Which have all the code for creating the tables. If we will remove or comment this then table will be not created
                                                                                                                                                                                                        rl3.close();
                                                                                                                                                                                                        return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines                                                                                                                                                                       
                                                                                                                                                                                                    }
                                                                                                                                                                                                    else
                                                                                                                                                                                                    {
                                                                                                                                                                                                        console.log(' #### Data is not inserted into the database. As per your request #### ');
                                                                                                                                                                                                        rl3.close();
                                                                                                                                                                                                        return; // If the code will come here then the compiler will come out of the function direclty from here without executing the next lines 
                                                                                                                                                                                                    }
                                                                                                                                                                                                });
                                                                                                                                                                                            }
                                                                                                                                                                                            else
                                                                                                                                                                                            {
                                                                                                                                                                                                return console.log(' #### Error happen while creating the OTPisexpired event #### ', err.message);                                                                                                                                                                                                
                                                                                                                                                                                            }
                                                                                                                                                                                        });
                                                                                                                                                                                    }
                                                                                                                                                                                    else
                                                                                                                                                                                    {
                                                                                                                                                                                        return console.log(" #### Error while creating unblockuserfromlogin event #### ");
                                                                                                                                                                                    }
                                                                                                                                                                                });
                                                                                                                                                                            }
                                                                                                                                                                            else
                                                                                                                                                                            {
                                                                                                                                                                                return console.log(' #### Error happen while creating the login_incorrect_attempts table #### ', err.message);
                                                                                                                                                                            }
                                                                                                                                                                        });
                                                                                                                                                                    }
                                                                                                                                                                    else
                                                                                                                                                                    {
                                                                                                                                                                        return console.log(' #### Error happen while creating the otpstores table #### ', err.message);
                                                                                                                                                                    }
                                                                                                                                                                });
                                                                                                                                                            }
                                                                                                                                                            else // If any error occured while enabling the EVENT SCHEDULER to ON then this else block of code will be executed 
                                                                                                                                                            { // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                                                                                                                return console.log(' #### Error occured while setting the event scheduler status to ON #### ', err.message);
                                                                                                                                                            }
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                    else // If any error occured while creating this myactivitylog stored procedure then this else block code will be executed
                                                                                                                                                    {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                                                                                                        return console.log(' #### Error happen while creating the myactivitylog stored procedure #### ', err.message);
                                                                                                                                                    }
                                                                                                                                                });                                                                                                                                                
                                                                                                                                            }
                                                                                                                                            else // If any error occured while creating this insertintoreportfortotalloggedhours stored procedure then this else block code will be executed
                                                                                                                                            {      // The program will print this statment and exit from here directly. The further lines are not executed                                                                                                                                           
                                                                                                                                                return console.log(" #### Error happen while creating the insertintoreportfortotalloggedhourse stored procedure #### ", err.message);
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                    }
                                                                                                                                    else // If any error occured while creating this insertintoreportswhilelogout stored procedure then this else block code will be executed
                                                                                                                                    {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                                                                                        return console.log(" #### Error happen while creating the insertintoreportswhilelogout stored procedure #### ", err.message);
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            }
                                                                                                                            else // If any error occured while creating this insertintoreportswhilelogin stored procedure then this else block code will be executed
                                                                                                                            {       // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                                                                                return console.log(" #### Error happen while creating the insertintoreportswhilelogin stored procedure #### ", err.message);
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                    else // If any error occured while creating this result table then this else block code will be executed
                                                                                                                    {       // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                                                                        return console.log("#### Error happen while creating the result table #### ", err.message);
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                            else // If any error occured while creating this checkticketexiparation event then this else block code will be executed
                                                                                                            {       // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                                                                return console.log(" #### Error happen while creating the checkticketexiparation event #### ", err.message);
                                                                                                            }
                                                                                                        });                                                                                                        
                                                                                                    }
                                                                                                    else // If any error occured while creating this insertintoticketlogged stored procedure then this else block code will be executed
                                                                                                    {       // The program will print this statment and exit from here directly. The further lines are not executed     
                                                                                                        return console.log(" #### Error happen while creating the insertintoticketlogged procedure #### ", err.message);
                                                                                                    }                                                                                                        
                                                                                                }); 
                                                                                            }
                                                                                            else // If any error occured while creating this insertintologged stored procedure then this else block code will be executed
                                                                                            {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                                                return console.log(" #### Error happen while creating the insertintologged procedure #### ", err);  
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                    else // If any error occured while creating the users_activities table then this else block code will be executed
                                                                                    {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                                        return console.log(" #### Error happen while creating the users_activities table #### ", err.message);  
                                                                                    }
                                                                                });
                                                                            }
                                                                            else // If any error occured while creating the users_activities table then this else block code will be executed
                                                                            {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                                return console.log(" #### Error happen while creating the users_activities table #### ", err);
                                                                            }
                                                                        });
                                                                    }
                                                                    else // If any error occured while creating the message table then this else block code will be executed
                                                                    {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                        return console.log(" #### Error happen while creating the message table #### ", err);
                                                                    }
                                                                });
                                                            }
                                                            else // If any error occured while creating the permission table then this else block code will be executed
                                                            {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                                                return console.log(" #### Error happen while creating the permission table #### ", err);
                                                            }
                                                        });
                                                    }
                                                    else // If any error occured while inserting the data into the module table then this else block code will be executed
                                                    {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                                        return console.log(" #### Error occur while inserting the data into the module table #### ", err);   
                                                    }
                                                });
                                            }
                                            else // If any error occured while creating the module table then this else block code will be executed
                                            {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                                return console.log(" #### Error happen while creating the module table #### ", err);
                                            }
                                        });
                                    }
                                    else // If any error occured while creating the ticket table then this else block code will be executed
                                    {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                        return console.log(" #### Error happen while creating the ticket table #### ", err);
                                    }
                                });
                            }
                            else // If any error occured while creating the user table then this else block code will be executed
                            {   // The program will print this statment and exit from here directly. The further lines are not executed 
                                return console.log(" #### Error happen while creating the user table #### ", err);
                            }
                        });
                    }
                    else // If any error occured while creating the role table then this else block code will be executed
                    {   // The program will print this statment and exit from here directly. The further lines are not executed 
                        return console.log(" #### Error happen while creating the role table #### ", err);
                    }
                }
                else // When the controller comes to the file and user table is already present then this statement will be printed.
                {   // The program will print this statment and exit from here directly. The further lines are not executed 
                    return console.log(' #### Table is already present #### ');
                }
            });          
        });        
    } 
    catch(error) 
    { // Catch statement of try block. If any error occured then this catch block directly executed. Usually it is done for sending message to front end or user. 
        return console.log(" #### Error while creating the table ####", error);        
    }
};