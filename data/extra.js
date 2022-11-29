const express = require('express');
const hbs  = require('express-handlebars');
app.engine('hbs',hbs({extname: 'hbs'}));
app.set('view engine', 'hbs');
//code to display appropriate heading/title