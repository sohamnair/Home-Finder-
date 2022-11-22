const mongoCollections = require('../config/mongoCollections');
const students = mongoCollections.students;
const validate = require("../helpers");
const bcrypt = require('bcryptjs');
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
    const studentCollection = await students();
    const user = await studentCollection.findOne({
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
      favourites:[]
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
    const studentCollection = await students();
    const user = await studentCollection.findOne({
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

const getAllStudent = async () => {
    const studentCollection = await students();
    const studentList = await studentCollection.find({}).toArray();
    if (!studentList) throw 'Error : Could not get all students';
    return studentList;
};

module.exports={
    checkUser,
    createUser,
    getAllStudent
}


//Things left to do
// student should be able to edit his details
// student should be able to delete his account
// student should be able to add property to favourites