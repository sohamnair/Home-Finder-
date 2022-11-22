const owners = require('./data/owners');
const properties = require('./data/properties');
const students = require('./data/students');
const connection = require('./config/mongoConnection');

const main = async () => {
  const db = await connection.dbConnection();
//   await db.dropDatabase();
  
//   try {
//     const movie = await owners.createUser("rohanvadi@gmail.com","Qwerty@1234","Sanjan","Vadi","5513284727","M","Hoboken","NJ","24");
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }

//   try {
//     const movie = await students.checkUser("sanjanvadi@gmail.com","Qwerty@1234");
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }

    // try {
    //     const movie = await owners.getAllOwners();
    //     console.log(movie);
    // } catch (e) {
    //     console.log(e);
    // }

    // try {
    //     const movie = await properties.createProperty("226 madison st, Hoboken, NJ, 07030","a beautiful 3 bedroom house","not included","2ab2","Sanjan","sanjanvadi@gmail.com","2000","3","2");
    //     console.log(movie);
    // } catch (e) {
    //     console.log(e);
    // }

    // try {
    //     const movie = await properties.getAllProperties();
    //     console.log(movie);
    // } catch (e) {
    //     console.log(e);
    // }
 
  connection.closeConnection();
}
main();