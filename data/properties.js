const mongoCollections = require('../config/mongoCollections');
const properties = mongoCollections.properties;
const owners = mongoCollections.owners;
const validate = require("../helpers");
const ownerData = require("./owners");
const { ObjectId } = require("mongodb");
const cloudinary = require('../config/cloudinary');
require("dotenv/config");



const createProperty = async (images,address, description, laundry, rent, listedBy, emailId, area, bed, bath) => {
    validate.validateProperty(address,description,laundry,rent,listedBy,emailId,area,bed,bath);

    //covert base64 encoded image to respective URL, these URL can be used to display images
    let imageBuffer=[];
    let result;
    for(let i=0;i<images.length;i++){
        result = await cloudinary.uploader.upload(images[i],{
            //uploaded images are stored in sanjan's cloudinary account under uploads folder
            folder: "uploads",
            //width and crop to alter image size, not needed right now, will uncomment if needed in future
            // width:300,
            // crop:"scale"
        });
        imageBuffer.push({
            _id: new ObjectId(),
            url: result.secure_url
        })
    };
    
    address=address.trim()
    description=description.trim()
    laundry=laundry.trim()
    rent=rent.trim()
    listedBy=listedBy.trim()
    emailId=emailId.trim()
    area=area.trim()
    bed=bed.trim()
    bath=bath.trim()

    rent=Number(rent);
    area=Number(area);
    bed=Number(bed);
    bath=Number(bath);

    let current = new Date();
    let dateListed = (current.getMonth()+1)+"/"+current.getDate()+"/"+current.getFullYear();

    const newProperty={
        images:imageBuffer,
        address:address,
        description:description,
        laundry:laundry,
        dateListed:dateListed,
        rent:rent,
        listedBy:listedBy,
        emailId:emailId,
        area:area,
        bed:bed,
        bath:bath,
        comments:[]
    }
    const propertyCollection = await properties();
    const insertInfo = await propertyCollection.insertOne(newProperty);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Error : Could not add property';

    let newId = insertInfo.insertedId.toString();

    //add property to owner's property array

    const ownerCollection = await owners();
    newId = ObjectId(newId);
    const updatedInfo = await ownerCollection.updateOne(
        {emailId: emailId},
        {$addToSet: {properties:newId}}
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'Error : could not add property to owner collection';
    }
    
    return newId
}

const getAllProperties = async () => {
    const propertyCollection = await properties();
    const propertyList = await propertyCollection.find({}).toArray();
    if (!propertyList) throw 'Internal server error, could not get all properties';
    return propertyList;
}


const getAllPropertiesByUser = async (idArray) => {
    const propertyCollection = await properties();
    const propertyList = await propertyCollection.find({}).toArray();
    if (!propertyList) throw 'Internal server error, could not get all properties';
    let ansList = [];
    
    for(let i = 0; i<idArray.length; i++) {
        idArray[i] = idArray[i].toString();
    }

    for(let i = 0; i<propertyList.length; i++) {
        if(idArray.includes(propertyList[i]._id.toString())) ansList.push(propertyList[i]);
    }
    return ansList;
}


const getPropertyById = async (id) => {
    id = validate.checkId(id);
    const propertyCollection = await properties();
    const propertyList = await propertyCollection.find({}).toArray();
    if (!propertyList) throw 'Error : Could not get all properties';
    let obj = {};
    let flag = false;
    for(let i = 0; i<propertyList.length; i++) {
        if(propertyList[i]._id.toString() == id) {
            obj = propertyList[i];
            flag = true;
            break;
        }
    }

    if(!flag) throw "No property with this ID found";

    return obj;
}

const removeProperty = async (id) => {
    validate.checkId(id);
    const propertyCollection = await properties();
    const deletionInfo = await propertyCollection.deleteOne({_id: ObjectID(id)});

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete property with id of ${id}`;
    }
  }

const createComment = async (id, comment) => {
    id = validate.checkId(id);

    comment = validate.checkComment(comment);
    const propertyCollection = await properties();
    let newUpdate = {
        _id: new ObjectId(),
        comment
    }
    const updatedInfo = await propertyCollection.updateOne(
        {_id: ObjectId(id)},
        {$addToSet: {comments: newUpdate}}
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'Error : could not add property to owner collection';
    }
}


module.exports={
    createProperty,
    getAllProperties,
    getPropertyById,
    getAllPropertiesByUser,
    createComment,
    removeProperty
}