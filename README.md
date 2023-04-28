
# Bug Tracker Application

This project contains the Node.js back-end code for a bug tracker application that enables the creation and management of users, roles, modules, and tickets. Additionally, the application supports two-user chatting functionality.


## Features

`Role Creation`

- In this application, the 'ADMIN' role can be created from the backend.
- Once created, the admin can create additional roles.
- Only the admin has the authority to create roles.
- The admin can perform operations such as deleting, updating, and reading all roles at once.

`Account Creation`

- When a new user is created, their email will be unverified. The user must verify their email before they can use other functionalities.
- After the user enters all the information, it will be inserted into the database.
- All users will be registered as 'ACTIVE' because they are being added by the 'ADMIN' themselves.
- JSON Web Token used for authentication.

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
- In the sixth step, after entering the localhost, you need to specify the port number where you want to run your application.
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
