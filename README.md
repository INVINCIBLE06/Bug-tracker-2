CRM application
This project is node.js back-end code for a customer relationship management application that can create users and tickets as well as manage them.


Features
Account creation

When you create a new user (customer or engineeer), an account verification link will be sent to e-mail address provided.
Verification link is valid for a limited time only.
If the user is a customer, the account will autometically be approved on verification.
In case of Engineer, an admin will have to approve the account.
JSON Web Token used for authentication
User can reset forgotten password by getting an email link to reset the password
Users can also update some details like name and password
User search is also available for users with proper authorization
Ticket creation

When a new ticket is created, an engineer with least open tickets is assigned to it. (if available)
On new ticket creation, a notification email is sent to admin, ticket reporter and assigned engineer.
Users can get all the tickets connected to their account.
Ticket details can be updated only by related parties.
Ticket Engineer can only be reassigned by the admin

Dependencies
npm modules
express
mongoose
jsonwebtoken
node-rest-client
dotenv
bcryptjs
REST API paths
User creation

Sign-up
POST /crm/api/v2/auth/signup
Register user with name, userId, email, password and user type.


Sign-in
POST /crm/api/v2/auth/signin
User Sign-in using userId and password.


Account verification
GET /crm/api/v2/auth/verifyemail/:token
Account verification by using the link provided to the registered email address.


Resend verification link
GET /crm/api/v2/auth/resendverificationemail/:token
Resend the verificaion link to email in case the link is not received or has expired.


User operations

Get all users (Query params userType and userStatus supported)
GET /crm/api/v2/users
An admin can get a list of all users. The list can also be filtered by userType and userStatus.


Get user by userId
get /crm/api/v2/users/:id
A user or an admin can get the data of the user.


Update user data
PUT /crm/api/v2/users/:id
A user or an admin can update the data of the user.


Forgot user password
GET /crm/api/v2/users/resetpassword/:id
User can get an email link to reset their forgotten password.


Reset password
PUT /crm/api/v2/users/resetpassword/:token
Updating user password by using the link provided to the registered email address.


Ticket creation and operations

Create new ticket
POST /crm/api/v2/tickets/
Any user can raise a ticket.


Get all tickets (query param status supported)
Get /crm/api/v2/tickets/
A user can get a list of tickets attached to their account. An admin can get a list of all tickets. The list can also be filtred by it's status.


Update ticket
Put /crm/api/v2/tickets/:id
The ticket can be updated by related parties.
