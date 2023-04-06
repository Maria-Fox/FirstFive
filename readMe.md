# The API/ Backend for FirstFive

## Introductory information 

- Thi API is deployed through Heroku and can be interacted with using Insomnia, or another similar service.
-  To view the frontend repo please visit this [repo](https://github.com/Maria-Fox/FirstFive-Frontend).

## Note: App is currently being refactored for readability, performance, and visual improvements. Come back soon for updates!
* Tests are also in the process of being refactored.

## Tech Stack

The backend was built using Express, Node, Sequelize, and JSON web tokens. Passwords and encrypted using BCRYPT.

## Utilizing Routes

- The base URL for requests is: https://firstfive.herokuapp.com

Most routes are private and require a user token. To begin:
POST `/auth/register`

` {
  "username" : "sampleUser",
  "password: "password123",
  "email:" "email@sample.com",
  "bio": "CS student"
}
`

The route will return a valid user token. For all remaining routes please ensure a valid token is in the request header for propper authentication. The login route will also provide a valid token.

## To utilize in development.

To initialize & seed the databases please complete the following:

run the below in your terminal.
```psql < firstFiveDB.sql```

To install the dependencies:
npm i 

To start the server:
nodemon server.js 


