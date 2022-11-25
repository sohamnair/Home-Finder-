const mongoCollections = require('../config/mongoCollections');
const owners = mongoCollections.owners;
const validate = require("../helpers");
const bcrypt = require('bcryptjs');
const { properties } = require('../config/mongoCollections');
const saltRounds = 10;

const createUser = async (emailId, password, firstName, lastName, contact, gender, city, state, age) => {
    validate.validateRegistration(emailId,password,firstName,lastName,contact,gender,city,state,age);
    emailId=emailId.trim().toLowerCase();
    password=password.trim();
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
      emailId: emailId
    });
    if(user!=null){
      if(user.emailId.toLowerCase()===emailId.toLowerCase()){
        throw "user with that email already exists";
      }
    }
    let newUser={
      emailId:emailId,
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
    const insertInfo = await ownerCollection.insertOne(newUser);
      if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Error : Could not add owner';
      }
    return newUser;
  };

const checkUser = async (emailId, password) => {

    validate.validateUser(email,password);
    emailId=emailId.trim().toLowerCase();
    password=password.trim();
    const ownerCollection = await owners();
    const user = await ownerCollection.findOne({
      emailId: emailId
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

const getOwnerByEmail = async (email) => {
    validate.validateEmail(email);
    emailId=emailId.trim().toLowerCase();
    const ownerCollection = await owners();
    const owner = await ownerCollection.findOne({
      emailId: emailId
    });
    return owner;
}

const updateOwnerDetails = async (emailId, password, firstName, lastName, contact, gender, city, state, age) => {
    // we are using emailid to uniquely identify a user to use that while updating user data
}

module.exports = {
    checkUser,
    createUser,
    getAllOwners,
    getOwnerByEmail,
    updateOwnerDetails
}

//Things left to do
// owner should be able to edit his details
// owner should be able to delete his account
// owner should be able to edit his properties
// owner should be able to remove a property