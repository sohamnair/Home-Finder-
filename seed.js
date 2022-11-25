const connection = require('./config/mongoConnection');
const index = require('./data/index');

const main = async () => {
  await connection.dbConnection();
  
  try {
    const movie = await index.owner.createUser("david123@gmail.com","David@123","David","Numen","5513284727","M","Hoboken","NJ","24");
    console.log(movie);
  } catch (e) {
    console.log(e);
  }

  // try {
  //   const movie = await index.student.checkUser("sam123@gmail.com","Sam@123");
  //   console.log(movie);
  // } catch (e) {
  //   console.log(e);
  // }

//   try {
//     const movie = await index.owner.getAllOwners();
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }

//   try {
//     const movie = await index.owner.getOwnerByEmail("david123@gmail.com");
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }

  try {
    const movie = await index.properties.createProperty("226 madison st, Hoboken, NJ, 07030","a beautiful 4 bedroom house","not included","5000","Sanjan","david123@gmail.com","2000","4","2");
    console.log(movie);
  } catch (e) {
    console.log(e);
  }

//   try {
//     const movie = await index.properties.getAllProperties();
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }

  // try {
  //   const movie = await index.properties.getAllPropertiesByUser(["637fd64c205a0ed824d2bcdf", "637fd65d6d4afd11f8aeca70"]);
  //   console.log(movie);
  // } catch (e) {
  //   console.log(e);
  // }

//   try {
//     const movie = await index.properties.createComment("637fd64c205a0ed824d2bcdf", "Nice house");
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }

try {
    const movie = await index.student.createUser("sam123@gmail.com","Sam@123","Sam","Briskoff","4811184222","M","Hoboken","NJ","18");
    console.log(movie);
} catch (e) {
    console.log(e);
}

  connection.closeConnection();

}

main();