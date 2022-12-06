// Setup server, session and middleware here.

const express = require('express');
const app = express();
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session')
const cookieParser = require('cookie-parser');

const rateLimit = require("express-rate-limit");
require("dotenv/config");

const static = express.static(__dirname + '/public');
app.use('/public', static);


//more than 1 api call should not pass within 10 sec
// const limiter = rateLimit({
//     windowMs: 1000,
//     max: 10,
// });

// Apply to all requests
// app.use(limiter);
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

