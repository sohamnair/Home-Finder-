const mongoCollections = require('../config/mongoCollections');
const owners = mongoCollections.owners;
const validate = require("../helpers");
const bcrypt = require('bcryptjs');
const { properties } = require('../config/mongoCollections');
const saltRounds = 10;

const createUser = async (
    email,password,firstName,lastName,contact,gender,city,state,age
  ) => {
    validate.validateRegistration(email,password,firstName,lastName,contact,gender,city,state,age);
    email=email.trim().toLowerCase();
    firstName=firstName.trim();
    lastName=lastName.trim();
    contact=contact.trim();
    gender=gender.trim();
    city=city.trim();
    state=state.trim();
    age=age.trim();
    let hash = await bcrypt.hash(password, saltRounds);
    const ownerCollection = await owners();
    const user = await ownerCollection.findOne({
      email: email
    });
    if(user!=null){
      if(user.email.toLowerCase()===email.toLowerCase()){
        throw "user with that email already exists";
      }
    }
    let newUser={
      email:email,
      hashedPassword:hash,
      firstName:firstName,
      lastName:lastName,
      contact:contact,
      gender:gender,
      city:city,
      state:state,
      age:age,
      properties:[]
    }
    const insertInfo = await userCollection.insertOne(newUser);
      if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Error : Could not add owner';
      }
    return newUser;
  };

const checkUser = async (email, password) => {

    validate.validateUser(email,password);
    email=email.trim().toLowerCase();
    const ownerCollection = await owners();
    const user = await ownerCollection.findOne({
      email: email
    });
    if(user===null){
      throw "Either the email or password is invalid";
    }
    let compare=false;
    compare = await bcrypt.compare(password, user.hashedPassword);
    if(!compare){
      throw "Either the email or password is invalid";
    }
    return user;
  };

const getAllOwners = async () => {
    const ownerCollection = await owners();
    const ownerList = await ownerCollection.find({}).toArray();
    if (!ownerList) throw 'Error : Could not get all owners';
    return ownerList;
};

// const getOwnerByEmail = async(email)=>{
//     validate.validateEmail(email);
//     email=email.trim().toLowerCase();
//     const ownerCollection = await owners();
//     const owner = await ownerCollection.findOne({
//       email: email
//     });
//     return owner;
// }

module.exports={
    checkUser,
    createUser,
    getAllOwners,
    // getOwnerByEmail
}

//Things left to do
// owner should be able to edit his details
// owner should be able to delete his account
// owner should be able to edit his properties
// owner should be able to remove a property