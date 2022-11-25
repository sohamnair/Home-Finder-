// const owners = require('./data/owners');
// const properties = require('./data/properties');
// const students = require('./data/students');
// const connection = require('./config/mongoConnection');

// const main = async () => {
//   const db = await connection.dbConnection();
// //   await db.dropDatabase();
  
// //   try {
// //     const movie = await owners.createUser("rohanvadi@gmail.com","Qwerty@1234","Sanjan","Vadi","5513284727","M","Hoboken","NJ","24");
// //     console.log(movie);
// //   } catch (e) {
// //     console.log(e);
// //   }

// //   try {
// //     const movie = await students.checkUser("sanjanvadi@gmail.com","Qwerty@1234");
// //     console.log(movie);
// //   } catch (e) {
// //     console.log(e);
// //   }

//     // try {
//     //     const movie = await owners.getAllOwners();
//     //     console.log(movie);
//     // } catch (e) {
//     //     console.log(e);
//     // }

//     // try {
//     //     const movie = await properties.createProperty("226 madison st, Hoboken, NJ, 07030","a beautiful 3 bedroom house","not included","2ab2","Sanjan","sanjanvadi@gmail.com","2000","3","2");
//     //     console.log(movie);
//     // } catch (e) {
//     //     console.log(e);
//     // }

//     // try {
//     //     const movie = await properties.getAllProperties();
//     //     console.log(movie);
//     // } catch (e) {
//     //     console.log(e);
//     // }
 
//   connection.closeConnection();
// }
// main();

// Setup server, session and middleware here.

const express = require('express');
const app = express();
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session')
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(
  session({
    name: 'AuthCookie',
    secret: 'This is a secret',
    saveUninitialized: false,
    resave: false,
    maxAge: 86400000 //1-day
  })
);


// app.use('/', async (req, res, next) => {
//   if (req.session.user) {
//     res.redirect('/protected');
//   }
//   next();
// })

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});