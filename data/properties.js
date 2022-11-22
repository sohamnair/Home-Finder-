const mongoCollections = require('../config/mongoCollections');
const properties = mongoCollections.properties;
const owners = mongoCollections.owners;
const validate = require("../helpers");
const ownerData = require("./owners");

const createProperty = async (
    address,description,laundry,rent,listedBy,email,area,bed,bath
  )=> {
    validate.validateProperty(address,description,laundry,rent,listedBy,email,area,bed,bath);
    
    address=address.trim()
    description=description.trim()
    laundry=laundry.trim()
    rent=rent.trim()
    listedBy=listedBy.trim()
    email=email.trim()
    area=area.trim()
    bed=bed.trim()
    bath=bath.trim()

    rent=Number(rent);
    area=Number(area);
    bed=Number(bed);
    bath=Number(bath);

    let current = new Date();
    let dateListed = current.getMonth()+1+"/"+current.getDate()+"/"+current.getFullYear();

    const newProperty={
        address:address,
        description:description,
        laundry:laundry,
        dateListed:dateListed,
        rent:rent,
        listedBy:listedBy,
        email:email,
        area:area,
        bed:bed,
        bath:bath,
        comments:[]
    }
    const propertyCollection = await properties();
    const insertInfo = await propertyCollection.insertOne(newProperty);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Error : Could not add property';

    const newId = insertInfo.insertedId.toString();

    //add property to owners property array

    // const ownerDetails = await ownerData.getOwnerByEmail(email);
    const ownerCollection = await owners();
    const updatedInfo = await ownerCollection.updateOne({
        email: email
      }, {
          $addToSet: {properties:newId}
      });
      if (updatedInfo.modifiedCount === 0) {
          throw 'Error : could not add property to owner collection';
      }
    //
    return newId
}

const getAllProperties = async()=>{
    const propertyCollection = await properties();
    const propertyList = await propertyCollection.find({}).toArray();
    if (!propertyList) throw 'Error : Could not get all properties';
    return propertyList;
}

module.exports={
    createProperty,
    getAllProperties
}