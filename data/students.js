const mongoCollections = require('../config/mongoCollections');
const students = mongoCollections.students;
const validate = require("../helpers");
const bcrypt = require('bcryptjs');
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
    const studentCollection = await students();
    const user = await studentCollection.findOne({
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
      favourites:[]
    }
    const insertInfo = await studentCollection.insertOne(newUser);
      if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Error : Could not add owner';
      }
    return newUser;
  };

  const checkUser = async (emailId, password) => {

    validate.validateUser(emailId,password);
    emailId=emailId.trim().toLowerCase();
    password=password.trim();
    const studentCollection = await students();
    const user = await studentCollection.findOne({
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

const getAllStudent = async () => {
    const studentCollection = await students();
    const studentList = await studentCollection.find({}).toArray();
    if (!studentList) throw 'Error : Could not get all students';
    return studentList;
};

const getStudentByEmail = async (emailId) => {
  validate.validateEmail(emailId);
  emailId=emailId.trim().toLowerCase();
  const studentCollection = await students();
  const student = await studentCollection.findOne({
    emailId: emailId
  });
  return student;
}

const updateStudentDetails = async (emailId, password, firstName, lastName, contact, gender, city, state, age) => {
  // we are using emailid to uniquely identify a user to use that while updating user data
}

module.exports = {
    checkUser,
    createUser,
    getAllStudent,
    getStudentByEmail,
    updateStudentDetails
}


//Things left to do
// student should be able to edit his details
// student should be able to delete his account
// student should be able to add property to favourites