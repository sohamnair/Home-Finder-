const mongoCollections = require('../config/mongoCollections');
const properties = mongoCollections.properties;
const owners = mongoCollections.owners;
const { students } = require('../config/mongoCollections');
const { ObjectId, ServerApiVersion } = require("mongodb");

const validate = require("../helpers");
const index = require('./index');

const cloudinary = require('../config/cloudinary');
const { default: axios } = require('axios');
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
    //distance calulation logic
    let formattedAddress;
    let response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
            address:address,
            key:'AIzaSyD8FReQh61YLuQP68YvmQveuU7dY3LVC9w'
        }
    });
    formattedAddress=response.data.results[0].formatted_address
    addresLat=response.data.results[0].geometry.location.lat;
    addresLng=response.data.results[0].geometry.location.lng;

    const stevensLat = 40.744838;
    const stevensLng = -74.025683;
    let distance = validate.getDistanceFromLatLonInMi(stevensLat,stevensLng,addresLat,addresLng);
    distance=Number(distance.toFixed(2));
    
    const newProperty={
        images:imageBuffer,
        address:formattedAddress,
        description:description,
        laundry:laundry,
        dateListed:dateListed,
        rent:rent,
        listedBy:listedBy,
        emailId:emailId,
        area:area,
        bed:bed,
        bath:bath,
        distance:distance,
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
    validate.validateArray(idArray);
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

const removeProperty = async (id, emailId) => {
    validate.checkId(id);
    validate.validateEmail(emailId);

    const propertyCollection = await properties();
    const deletionInfo = await propertyCollection.deleteOne(
        {_id: ObjectId(id)}
    );

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete property with id of ${id}`;
    }

    emailId=emailId.trim().toLowerCase();
    const ownerCollection = await owners();
    const ownerData = await ownerCollection.findOne({
      emailId: emailId
    });
    
    let ownerPropertyListArr = ownerData.properties;
    for(let i = 0; i<ownerPropertyListArr.length; i++) {
        if(ownerPropertyListArr[i].toString() == id) {
            ownerPropertyListArr.splice(i, 1);
        }
    }

    let ownerUpdateInfo = {
        emailId: ownerData.emailId,
        hashedPassword: ownerData.hashedPassword,
        firstName: ownerData.firstName,
        lastName: ownerData.lastName,
        contact: ownerData.contact,
        gender: ownerData.gender,
        city: ownerData.city,
        state: ownerData.state,
        age: ownerData.age,
        properties: ownerPropertyListArr
    }

    const ownerUpdatedInfo = await ownerCollection.updateOne(
        {emailId: emailId},
        {$set: ownerUpdateInfo}
    );

    if (ownerUpdatedInfo.modifiedCount === 0) {
        throw 'Could not update the owner profile';
    }

    // delete from student favourite list  

    const studentCollection = await students();
    const studentData = await studentCollection.find({}).toArray();
    let emailIdArr, favouritesArr;
    for(let i = 0; i<studentData.length; i++) {
        favouritesArr.push(studentData[i].favourites);
        emailIdArr.push(studentData[i].emailId);
    }
    for(let i = 0; i<favouritesArr.length; i++) {
        for(let j = 0; j<favouritesArr[i].length; j++) {
            if(favouritesArr[i][j].toString() == id) {
                favouritesArr[i][j].splice(j, 1);

                let studentUpdateInfo = {
                    favourites: favouritesArr[i]
                }
            
                const studentUpdatedInfo = await studentCollection.updateOne(
                    {emailId: emailIdArr[i]},
                    {$set: studentUpdateInfo}
                );
            
                if (studentUpdatedInfo.modifiedCount === 0) {
                    throw 'Could not update the owner profile';
                }
            }
        }
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

const getSortedData = async (txt) => {
    let tempData = await getAllProperties();
    let sorted = [];
    if(txt == "1") {
        sorted = tempData.sort(function (a, b) {
            return a.rent - b.rent;
        });
    }
    else if(txt == "2") {
        sorted = tempData.sort(function (a, b) {
            return b.rent - a.rent;
        });
    }
    else if(txt == "3") {
        sorted = tempData.sort(function (a, b) {
            return a.distance - b.distance;
        });
    }
    else if(txt == "4") {
        sorted = tempData.sort(function (a, b) {
            return b.distance -  a.distance;
        });
    }
    else if(txt == "0") {
        sorted = tempData
    }
    return sorted;
}

const searchProp = async (search) => {
    try {
        if (!search) throw new Error('You must provide text to search');    
        if (typeof search !== 'string') throw new TypeError('search must be a string');

        let Prop = search.toLowerCase();
        const propertyCollection = await properties();
        const searchPropresults = await propertyCollection.find({address: { $regex: Prop } }, {description: { $regex: Prop } }).toArray();
        //console.log(searchPropresults);
        return searchPropresults;
    } catch (err) {
        throw err;
    }
}

module.exports={
    createProperty,
    getAllProperties,
    getPropertyById,
    getAllPropertiesByUser,
    createComment,
    removeProperty,
    getSortedData
    searchProp
}