const connection = require('./config/mongoConnection');
const index = require('./data/index');

const main = async () => {
  await connection.dbConnection();
  

  // try {
  //   const owner = await index.owner.createUser("sam123@gmail.com","Sam@123","Sam","Adams","5512468888","M","Hoboken","NJ","39");
  //   console.log(owner);
  // } catch (e) {
  //   console.log(e);
  // }

  try {
    const owner = await index.owner.createUser("sam123@gmail.com","Sam@123","Sam","Adams","5512468888","M","Hoboken","NJ","39");
    console.log(movie);
  } catch (e) {
    console.log(e);
  }

  try {
    const owner = await index.student.createUser("sam123@gmail.com","Sam@123","Sam","Briskoff","4811184222","M","Hoboken","NJ","18");
    console.log(movie);
  } catch (e) {
    console.log(e);
  }

  try {
    const movie = await index.student.checkUser("sam123@gmail.com","Sam@123");
    console.log(movie);
  } catch (e) {
    console.log(e);
  }


  // try {
  //   const movie = await index.owner.getAllOwners();
  //   console.log(movie);
  // } catch (e) {
  //   console.log(e);
  // }

//   try {
//     const movie = await index.owner.getOwnerByEmail("david123@gmail.com");
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }

  // try {
  //   const movie = await index.properties.createProperty("226 madison st, Hoboken, NJ, 07030","a beautiful 4 bedroom house","not included","5000","Sanjan","david123@gmail.com","2000","4","2");
  //   console.log(movie);
  // } catch (e) {
  //   console.log(e);
  // }
  try {
    const movie = await index.properties.createProperty("226 madison st, Hoboken, NJ, 07030","a beautiful 4 bedroom house","not included","5000","Sanjan","david123@gmail.com","2000","4","2");
    console.log(movie);
  } catch (e) {
    console.log(e);
  }
=========
  // try {
  //   const property = await index.properties.createProperty("296 Park Avenue, Hoboken, NJ, 07030","a beautiful 3 bedroom 2 bathroom house","not included","2000","John","john123@gmail.com","1000","3","2");
  //   console.log(property);
  // } catch (e) {
  //   console.log(e);
  // }

//   try {
//     const movie = await index.properties.getAllProperties();
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }

//   try {
//     const movie = await index.properties.getAllPropertiesByUser(["637fd64c205a0ed824d2bcdf", "637fd65d6d4afd11f8aeca70"]);
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }

//   try {
//     const movie = await index.properties.createComment("637fd64c205a0ed824d2bcdf", "Nice house");
//     console.log(movie);
//   } catch (e) {
//     console.log(e);
//   }



// try{
//   const movie = await index.owner.updateOwnerDetails("david123@gmail.com","$2a$10$Ix5wamMAgLUhpJCW72wAWueVQb5cLHIUzVxS6SXPEy0QoA4W4tPqu","David","Numen","5513284727","M","Newport","NJ","24");
//   console.log(movie);
// } catch(e){
//   console.log(e);
// }

// try{
//   const property = await index.owner.editProp("6385ac3d57a7a2280f7022e0","216 washington st, Hoboken, NJ, 07030","a beautiful 4 bedroom house","not included","5000","Maunish","david123@gmail.com","2000","4","2");
//   console.log(property);
// } catch(e){
//   console.log(e);
// }

// try{
//   const owner = await index.student.addFavouriteProperty('sam123@gmail.com', '6398b08ae787cfce64e61566');
//   console.log(owner);

//   const property = await index.owner.deleteProp("6385ac3d57a7a2280f7022e0");
// } catch(e){
//   console.log(e);
// }

// try{
//   const property = await index.owner.deleteProp("6385ac3d57a7a2280f7022e0");
// } catch(e){
//   console.log(e);
// }


  // try {
  //   const prop = await index.properties.getSortedData("4");
  //   console.log(prop);
  // } catch (e) {
  //   console.log(e);
  // }

=========

try{
  const owner = await index.properties.searchProp('washington');
  console.log(owner);
} catch(e){
  console.log(e);
}

// try{
//   const property = await index.properties.deleteImage("639a93e184e7dd280a7ad58f");
//   console.log(property);
// } catch(e){
//   console.log(e);
// }

connection.closeConnection();

}

main();