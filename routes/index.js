
const loginAndRegRoute = require('./loginAndReg');
const ownerRoute = require('./owners');
const studentRoute = require('./students');
const propertieRoute = require('./properties');


const constructorMethod = (app) => {
  app.use('/', loginAndRegRoute);
  app.use('/owners', ownerRoute);
  app.use('/students', studentRoute);
  app.use('/properties', propertieRoute);

  app.use('*', (req, res) => {
    return res.status(404).render('./error_page', {title: "Error", error: "Oops! the page you are searching doesn't exist"});
  });
};

module.exports = constructorMethod;