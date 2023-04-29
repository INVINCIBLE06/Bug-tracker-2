
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
|nodemon|
|bcryptjs|
|readline|
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

>**User creation**

- **User-Registration**<br/>
`POST bugtracker/api/add/new/user`<br/>
Register user with name, email, mobile, date_of_birth, security_answer, password, confirm_password, role, and module.<br/><br/>
- **Sign-In**<br/>
`POST bugtracker/api/login/exist/user`<br/>
User Sign-in using userId and password.<br/>
- **Sign-Out**<br/>
`POST bugtracker/api/logout/exist/user/:id`<br/>
User Sign-out using userId in Params. We are doing this to store the logout and total log time in the database. <br/><br/>
- **Activity**<br/>
`GET bugtracker/api/user/activity/log/:id`<br/>
This route will give the total activity by a particular user. Whose Id is in the params. Activity consist of login, logout, total time.<br/><br/>
<br/><br/>

- **Password Update 1**<br/>
`PUT bugtracker/api/forgot/pass/new/pass`<br/>
This route will be for updating password. We need to enter email, security answer(Question - Who is you childhood hero ?), password, confirm password.<br/><br/>
<br/><br/>

- **Get All Users**<br/>
`GET bugtracker/api/get/all/user`<br/>
This route will give details of all the users available in the database.<br/><br/>
<br/><br/>

- **Get Single Users**<br/>
`GET bugtracker/api/get/one/user`<br/>
This route will give the details of one particular users. We need to enter email in the body. <br/><br/>
<br/><br/>

- **Check Security Answer**<br/>
`GET bugtracker/api/check/security/:email`<br/>
This route will check the security answer. We need to enter security answer in the body and email in the params.<br/><br/>
<br/><br/>

- **Update Password 2**<br/>
`PUT bugtracker/api/update/password/:email`<br/>
This route will be updating the password. Basically this is made for the front end. It was like first we will check only email, after that email security answer, if eboth true then update password. We need to enter email in params. Whose password have to be changed. Password and confirm password in the body.<br/><br/>
<br/><br/>

- **Get All Active Engineer**<br/>
`GET bugtracker/api/get/all/active/engineer`<br/>
This route will give details of all the active engineer available in the database.<br/><br/>
<br/><br/>

- **Updating User Status**<br/>
`PUT bugtracker/api/update/user/status/:id`<br/>
This route will be used for updating the status of users from active to inactive or viceversa.<br/><br/>
<br/><br/>

- **All User Detail Without The Logged One**<br/>
`GET bugtracker/api/get/all/user/not/logged/one/:id `<br/>
This route will give us all the users details except the user whose user_Id is in the params. This will be usefull when there are more than one ADMIN user. So one ADMIN cannot change other ADMIN data.<br/><br/>
<br/><br/>

- **Check Or Validating OTP**<br/>
`POST bugtracker/api/validate/otp/:id `<br/>
This route will be used for checking the OTP. The user need to enter OTP in the body and user_Id in the params.<br/><br/>
<br/><br/>

- **For Generating And Sending Registered Email**<br/>
`POST bugtracker/api/user/send/otp `<br/>
This route will be used for generating six digit unique code and send it to the email. The user needs to enter the email first in the body. <br/><br/>
<br/><br/>

- **For Generating Password Reset Link**<br/>
`GET bugtracker/api/get/reset/password/link/:id `<br/>
This route will be used for generating password reset link. We need to enter user_Id in the params. <br/><br/>
<br/><br/>

- **For Generating Email Verification Link**<br/>
`GET /bugtracker/api/email/verfication/link/:id `<br/>
This route will be used for generating email verification link. We need to enter user_Id in the params. <br/><br/>
<br/><br/>

- **Verifying User Email Through Link**<br/>
`GET /bugtracker/api/emailVerfication/:token `<br/>
This route will be used for verifying our email.<br/><br/>
<br/><br/>

- **Updating Password 3**<br/>
`GET /bugtracker/api/Passwordreset/:token `<br/>
This route will be used for updating our password. We need to add password and confirm password in params. <br/><br/>
<br/><br/>