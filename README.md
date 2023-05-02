
# Bug Tracker Application

This project contains the Node.js back-end code for a bug tracker application that enables the creation and management of users, roles, modules, and tickets. Additionally, the application supports two-user chatting functionality.


## Features

`Role Creation`

- In this application, the 'ADMIN' role will be created from the backend.
- Once created, the admin can create additional roles.
- Only the admin has the authority to create roles.
- The admin can perform operations such as deleting, updating, and reading all roles at once.

`User Registration`

- When a new user is created, their email will be unverified. The user must verify their email before they can use other functionalities.
- After the user enters all the information, it will be inserted into the database.
- All users will be registered as 'ACTIVE' because they are being added by the 'ADMIN' themselves.
- JSON Web Token used for authentication.

`User Sigin`

- When a user logs in, a token is sent in the response.
- We store the login time and logout time of every user.
- So that 'ADMIN' can keep track of all user login and logout times in the database.
- Every user can also get details of their total login time.
- If the user enters the wrong password, we store the count in the database.
- If a user enters the wrong password five times in a row, their account will be blocked for 24 hours.
- We also store the count even if the user has not entered the wrong password five times.

`Ticket Creation`

- When a new ticket is created, an 'ACTIVE' engineer can be assigned the ticket. The person creating the ticket will select the engineer by their email.
- On new ticket creation, a notification email is sent assigned engineer. 
- Users can get all the tickets connected to their account.
- When a ticket is created, its priority will be set to 'NORMAL'. However, if no work is started on the ticket within 2 days, the priority of that ticket will be changed to 'URGENT'.
- Only an 'ENGINEER' can set a ticket to 'RESOLVED'. Only an 'ADMIN' has the authority to close a ticket.
- Once a ticket is 'CLOSED', it cannot be reopened. 

`Password Reset Or Changing`

- Password changing can happen in a number of ways.
- When a user registers through the 'ADMIN', we also store their security answer.
- To change their password, the user will need to provide their email, security answer, new password, and confirm the new password. If all the information is correct, then the password will be updated.
- Updating a user's password can also be done by providing the user's email in the request parameters. This feature is primarily intended for use in the frontend of the application.
- We can update the password using a reset password link.
- The user ID is required in the parameters to generate the password reset link.
- The link will be sent to the registered email address.
- When the link is used, the user will be prompted to enter a new password and confirm it. This will update the password in the database.
- The link will be valid for a specified number of minutes.
- The password reset link will only work if the email address is verified.

`Email Sending Or Communication`

- We are using email communication in several places.
- The following are the places where we are using email communication:
- For email verification, we send an email to the user.
- For password changing, we send an email to the user.
- When a ticket is assigned to a user, we send an email notification to the user.
- We can send emails from anywhere in the application, as it is a separate file that only requires the recipient's email, subject, and description.

`Message`

- The engineer can initiate communication with the person who created and assigned the ticket.
- Both the engineer and ticket creator can communicate with each other through messages.
- The admin has the ability to view all messages that have been communicated on a particular ticket.

`Module`

- This module is being created for the front-end part.
- Through this, we will manage the dashboard of the front-end for a particular user.
- The module includes permissions given to a particular user by the 'ADMIN'.
- The permissions or authorities are functionalities available for users.

`Other Or Extra Functionalities`

- While creating the ticket, we are also allowing the user to upload a screenshot as a file attachment.
- The supported file formats are .jpg, .png, .docx, and .xls.
- The "ENGINEER" who is assigned the ticket can download the uploaded file attachment.
- We also have the function of OTP verification via email, which we can use if necessary.
- The OTP is stored in the database in hashed format to ensure its security.
- Each OTP can only be used once.
- Email verification and password reset links can also only be used once.
- Passwords are stored in the database in hashed format to ensure their security.
- In the 'app.js' file, there is a line that is commented out (deletetable()). When we uncomment it, the program will prompt us with questions at startup.
- The questions are related to creating tables, functions, events, and stored functions.
- If there are no tables, the program will create them directly if the appropriate code is not commented out. However, it's important to comment out this line when it's not being used, otherwise it will execute every time the program runs.
- You have to create database.

`Database Elements`

- Tables, stored procedures, events, and functions will all be created from the backend.
- The event environment is set to ON, as it is required for our events to work.

## Prerequisite

- Basic knowledge of Node.js.
- Understanding and working knowledge of Promises.
- Understanding and working knowledge of async and await.
- Familiarity with JWT (JSON Web Tokens) would be very useful.
- Since MySQL is used, you should have knowledge of basic MySQL concepts such as installation and running.
- Understanding of MySQL features such as Stored Procedures, Events, and Functions.

## Tech Stack

- Node
- Express
- Mysql

## Dependencies

|npm modules|
|------|
|uuid|
|dotenv|
|mysql2|
|readline|
|bcryptjs|
|nodemon|
|nodemailer|
|jsonwebtoken|
|date-and-time|
|express-fileupload|


## Installation

- This app requires Node.js v18+ to run.

- Install the dependencies and devDependencies and start the server

- Before starting the server please ensure Mysql server is locally installed and running on the default port

- One more thing we have to add the '.env' file. 

```bash
  cd Bug-tracker-2
  npm install
  npm run dev  
```
## Environment Variables (.env)

To run this project, you will need to add a .env file to the root directory of the project. This file should contain any necessary environment variables, such as database credentials or API keys. To create the .env file, simply create a new file in the root directory of the project and name it .env. Then add the required environment variables with their corresponding values. We store sensitive information in this file.

`Database and PORT details`

- Please enter the port number where you want to run your application.
- In the sixth step, after entering the localhost, you need to specify the port number and databse name. Where you want to run your application.
- These six steps describe how to connect to the database and run the application :

```bash
  1. db - 'Database name'
  2. DBPASSWORD - 'Database password'
  3. USER_ROOT - 'User name'
  4. USER_HOST - 'Host'
  5. PORT - 'Port number where you want to make this application'
  6. APP_URL - 'http://localhost:(PORTNUMBER)' 
```
`First Admin Details`

- The following seven steps describe how to add the first admin details from the backend:
    - Step 1: Enter the admin email.
    - Step 2: Enter the admin name.
    - Step 3: Enter the admin mobile number.
    - Step 4: Enter the admin date of birth.
    - Step 5: Enter the admin security answer, which will be used for password change.
    - Step 6: Enter the admin password.
    - Step 7: Confirm the admin password.

```bash
1. adminemail - 'Admin email id'
2. adminname - 'Admin name'
3. adminmobile - 'Admin mobile number'
4. admindateofbirth - 'Admin date of birth'
5. adminanswer - 'Admin security answer. This will be useful for password reset'
6. adminpassword - 'Admin password'
7. adminconfirmpassword - 'Admin confirmpassword
```

`Application Password`

- Since we are enabling our software to send emails, we are using SMTP.
- To use SMTP, we need to create an application in an email service provider and obtain an ID and password. This will be required to send emails directly from our server.

```bash
1. app_email - 'Application email from where STMP application created'
2. app_password - 'Application password, it will given by google when you create SMTP application'
```

## Rest endpoints

>**User**

- **User-Registration**<br/>
`POST bugtracker/api/add/new/user`<br/>
Register user with name, email, mobile, date_of_birth, security_answer, password, confirm_password, role, and module.<br/>

- **Sign-In**<br/>
`POST bugtracker/api/login/exist/user`<br/>
User Sign-in using userId and password.<br/>

- **Sign-Out**<br/>
`POST bugtracker/api/logout/exist/user/:id`<br/>
User Sign-out using userId in Params. We are doing this to store the logout and total log time in the database. <br/>

- **Activity**<br/>
`GET bugtracker/api/user/activity/log/:id`<br/>
This route will give the total activity by a particular user. Whose Id is in the params. Activity consist of login, logout, total time.<br/>

- **Get All Users**<br/>
`GET bugtracker/api/get/all/user`<br/>
This route will give details of all the users available in the database.<br/>

- **Get Single Users**<br/>
`GET bugtracker/api/get/one/user`<br/>
This route will give the details of one particular users. We need to enter email in the body. <br/>

- **Check Security Answer**<br/>
`GET bugtracker/api/check/security/:email`<br/>
This route will check the security answer. We need to enter security answer in the body and email in the params.<br/>

- **Get All Active Engineer**<br/>
`GET bugtracker/api/get/all/active/engineer`<br/>
This route will give details of all the active engineer available in the database.<br/>

- **Updating User Status**<br/>
`PUT bugtracker/api/update/user/status/:id`<br/>
This route will be used for updating the status of users from active to inactive or viceversa.<br/>

- **All User Detail Without The Logged One**<br/>
`GET bugtracker/api/get/all/user/not/logged/one/:id `<br/>
This route will give us all the users details except the user whose user_Id is in the params. This will be usefull when there are more than one ADMIN user. So one ADMIN cannot change other ADMIN data.<br/>

>**Email And OTP**

- **Check Or Validating OTP**<br/>
`POST bugtracker/api/validate/otp/:id `<br/>
This route will be used for checking the OTP. The user need to enter OTP in the body and user_Id in the params.<br/>

- **For Generating And Sending Registered Email**<br/>
`POST bugtracker/api/user/send/otp `<br/>
This route will be used for generating six digit unique code and send it to the email. The user needs to enter the email first in the body. <br/>

- **For Generating Password Reset Link**<br/>
`GET bugtracker/api/get/reset/password/link/:id `<br/>
This route will be used for generating password reset link. We need to enter user_Id in the params. <br/>

- **For Generating Email Verification Link**<br/>
`GET /bugtracker/api/email/verfication/link/:id `<br/>
This route will be used for generating email verification link. We need to enter user_Id in the params. <br/>

- **Verifying User Email Through Link**<br/>
`GET /bugtracker/api/emailVerfication/:token `<br/>
This route will be used for verifying our email.<br/>

>**Password Updation**

- **Password Update 1**<br/>
`PUT bugtracker/api/forgot/pass/new/pass`<br/>
This route will be for updating password. We need to enter email, security answer(Question - Who is you childhood hero ?), password, confirm password.<br/>

- **Update Password 2**<br/>
`PUT bugtracker/api/update/password/:email`<br/>
This route will be updating the password. Basically this is made for the front end. It was like first we will check only email, after that email security answer, if both true then update password. We need to enter email in params. Whose password have to be changed. Password and confirm password in the body.<br/>

- **Updating Password 3**<br/>
`GET /bugtracker/api/Passwordreset/:token `<br/>
This route will be used for updating our password. We need to add password and confirm password in params.<br/>

>**Ticket**

- **Creation**<br/>
`POST bugtracker/api/create/ticket/new `<br/>
This route is intended for creating new tickets.<br/>

- **Fetching All Ticket**<br/>
`GET bugtracker/api/get/all/ticket `<br/>
This route is intended for retrieving all tickets from the database.<br/>

- **Fetching All Assigned Ticket**<br/>
`GET bugtracker/api/get/all/assigned/ticket/:assignee `<br/>
This route will be be for engineer basically. This route will give us all the tickets. Which is assigned to a particular user. We have to give the user email id in the params.<br/>

- **Fetching All Reported Ticket**<br/>
`GET bugtracker/api/get/all/created/ticket/:reporter `<br/>
This route is intended for all users and will provide us with all tickets created by a specific user. The user's email address should be provided as a parameter.<br/>

- **Changing Ticket Status**<br/>
`PUT bugtracker/api/started/working/ticket/:id `<br/>
This route is intended for updating the status of tickets. To utilize this route, the ticket ID should be provided as a parameter. By default, when a ticket is created, its status is set to "OPEN". When an ENGINEER begins working on the ticket, the status can be updated to "WORKING". The final status update an ENGINEER can make is "RESOLVED". Only an ADMIN has the authority to close a ticket.<br/>

- **Fetching All Resolved Ticket**<br/>
`GET bugtracker/api/get/all/resolved/ticket `<br/>
This route is intended for retrieving all resolved tickets.<br/>

- **Changing Ticket Status To Closed**<br/>
`GET bugtracker/api/changed/ticket/closed/:id`<br/>
This route is intended for updating the status of a ticket to "CLOSED". Only an ADMIN has the authority to CLOSE a ticket, and this route should be utilized for that purpose.<br/>

- **Fetching Ticket Where Working Is Not Started**<br/>
`GET bugtracker/api/notstatrtedworking/priority/urgent/ticket`<br/>
This route is intended for retrieving tickets that are still in "OPEN" status with a priority level of "NORMAL". By default, when a ticket is created, its priority level is set to "NORMAL". However, if no work has been started on a particular ticket, the priority level will be updated to "URGENT".<br/>

- **Fetching All Urgent Priority Ticket**<br/>
`GET bugtracker/api/urgent/priority/tickets `<br/>
This route is intended for retrieving all URGENT priority level tickets.<br/>

- **Fetching Detail Report Of a Particlular Ticket**<br/>
`GET bugtracker/api/ticket/report/:id `<br/>
This route is intended for retrieving a specific ticket report. To utilize this route, the ticket ID should be provided as a parameter.<br/>

- **Fetching Detail Report Of All Ticket**<br/>
`GET bugtracker/api/all/ticket/report` </br>
This route is intended for retrieving all tickets report.<br/>

- **Downloading The Attachment**<br/>
`GET bugtracker/api/file-download/:id`</br>
This route is intended for downloading the attachement of a ticket.<br/>


>**Role**

- **Creation**<br/>
`POST bugtracker/api/add/new/role `<br/>
This route will be used for creating the roles<br/>

- **Updation**<br/>
`PUT bugtracker/api/update/role/name `<br/>
This route will be used for updating the role <br/>

- **Delete**<br/>
`DELETE bugtracker/api/delete/role `<br/>
This route will be used for deleting the role <br/>

- **Get All**<br/>
`GET bugtracker/api/all/role `<br/>
This route will be used for fetching all the roles from the database <br/>

>**Module**

- **Creation**<br/>
`GET bugtracker/api/add/new/module `<br/>
This route will be used for creating the module<br/>

- **Updation**<br/>
`PUT bugtracker/api/update/module/name `<br/>
This route will be used for updating the module <br/>

- **Delete**<br/>
`DELETE bugtracker/api/delete/module `<br/>
This route will be used for deleting the module <br/>

- **Get All**<br/>
`GET bugtracker/api/all/active/module `<br/>
This route will be used for fetching all the modules from the database <br/>

- **Updating the Module Status**<br/>
`PUT bugtracker/api/update/module/status `<br/>
This route will be used for updating the status of modules. <br/>
