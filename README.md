# GROUPOMANIA #

## GENERAL INFOS ##

Repo for the seventh and last project on the OpenClassroom's Web Developper course.  
The project is to create from scratch a social media app for internal use in a company.  
Fonctionnalities to be deployed are sharing and reacting/commenting to gifs, with 9GAG as an inspiration, and to articles, with Reddit as an inspiration.  
To apply what was taught in the course, I used Express for the backend, VueJS for the frontend, and MySQL for my database.  

## RESOURCES ##

These are some of the ressources I used to build this app:  

* OpenClassrooms course on buildind an Express server using MongoDB (https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb)
* OpenClassrooms course on building a VueJS web app (https://openclassrooms.com/fr/courses/6390311-creez-une-application-web-avec-vue-js)
* This blog post on using MySQL with Express (https://www.bezkoder.com/node-js-rest-api-express-mysql/)
* This W3Schools documentation on using MySQL in Node.js (https://www.w3schools.com/nodejs/nodejs_mysql.asp)
* I used code shared on this page to add a functionality to my router Vue (https://www.digitalocean.com/community/tutorials/vuejs-vue-router-modify-head)

## TECHNOLOGIES ##

* MySQL: version 8.0.27 (https://dev.mysql.com/downloads/installer/)
* NodeJS: version 6.14.15 (https://nodejs.org/en/)
* Express: version 4.17.1 (https://expressjs.com/fr/)
* Multer: version 1.4.3 (https://github.com/expressjs/multer)
* JsonWebToken: version 8.5.1 (https://github.com/auth0/node-jsonwebtoken)
* Bcrypt: version 5.0.1 (https://github.com/kelektiv/node.bcrypt.js)
* Dotenv: version 10.0.0 (https://github.com/motdotla/dotenv)
* CookieParser: version 1.4.6 (http://expressjs.com/en/resources/middleware/cookie-parser.html)
* Helmet: version 4.6.0 (https://helmetjs.github.io/)
* @fortawesome/vue-fontawesome: version 3.0.0-5 (https://www.npmjs.com/package/@fortawesome/vue-fontawesome)

If you want the app to reload automatically when you make changes to the backend, you can use:  
* Nodemon: version 2.0.15 (https://github.com/remy/nodemon)  

On Windows, these installations require to use PowerShell in administrator mode.  

## INSTALLATION ##

Before running the app, you need to set up your database.  
First you need to create your database, let's call it "groupomania", with `CREATE DATABASE groupomania;` and then `USE groupomania;`.  
Then, download the file "database.sql" and update your database with `mysql -u root -p groupomania < your/path/to/the/file/database.sql` or `\source your/path/to/the/file/database.sql`.  

As both the backend and the frontend of the app can run independently from each other and need to be running at the same time for the app to function as intended, I'll treat the backend part and the frontend part separately. 

But first, you need to clone this repo with `git clone https://github.com/TelliMouse/EstelleMaillet_6_25102021.git`

Be aware that you'll need a dotenv file to be able to run this app.  

### BACKEND ###

Go to the backend directory `cd backend`.  
Run `npm install`.  
Run either `node server` or `nodemon server` if you've chosen to use nodemon.  

The backend is now running.  

Use `Ctrl+C` in the terminal to stop the local server.  

### FRONTEND ###

Go to the frontend directory `cd frontend/groupomania`.  
Run `npm install`.  
Run `npm run serve` 

The frontend is now running.  

Use `Ctrl+C` in the terminal to stop the local server.  

You're all set, you can now open the app in your browser.