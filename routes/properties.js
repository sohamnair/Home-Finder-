const express = require('express');
const router = express.Router();
const index = require('../data/index');
const validate =require('../helpers');
const multer = require('multer');
const upload = multer({});
require("dotenv/config");

router.route('/')
.get(async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/sign-in');
        } 
        else {
            let data = await index.properties.getAllProperties();
            res.render('./properties_page', {title: "All Properties", data: data, style: "/public/properties_page_style.css"});
        }
    }catch(e) {
        return res.status(500).render('./error_page', {title: "Error", error: e});
    }
})

router.route('/filter/:id')
.get(async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/sign-in');
        } 
        else {
            let data = await index.properties.getSortedData(req.params.id);
            res.render('./properties_page', {title: "All Properties", data: data, style: "/public/properties_page_style.css"});
        }
    }catch(e) {
        return res.status(500).render('./error_page', {title: "Error", error: e});
    }
})

router.route('/property/:id')
.get(async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/sign-in');
        } 
        else {
            let id = req.params.id;
            validate.checkId(id);
            let data = await index.properties.getPropertyById(id);
            let favourite = await index.student.checkFavourite(id,req.session.user.emailId);
            if(favourite){
                return res.render('./favourite_property_page', {title: "Property", data: data, emailId : req.session.user.emailId, id: id});
            }
            else{
                return res.render('./property_page', {title: "Property", data: data, emailId : req.session.user.emailId, id: id});
            }
        }
    }catch(e) {
        return res.status(404).render('./error_page', {title: "Error", error: e});
    }
})

router.route('/property/comments/:id')
.post(async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/sign-in');
        } 
        else {
            let id = req.params.id;
            let comment = req.body.comment;
            validate.checkId(id);
            validate.checkComment(comment);
            let emailId = req.session.user.emailId;
            let firstName = req.session.user.firstName;
            let lastName = req.session.user.lastName;
            await index.properties.createComment(id,emailId,firstName,lastName,comment);
            if(req.session.user.userType==='student'){
                res.redirect(`/properties/property/${id}`);
            }
            else{
                res.redirect(`/properties/editProperty/${id}`);
            }
        }
    }catch(e) {
        return res.status(404).render('./error_page', {title: "Error", error: e});
    }
})

router.route('/createProperty')
.get(async (req,res)=>{
    if (!req.session.user) {
        res.redirect('/sign-in');
    } 
    else {
        return res.render('./createProperty', {title: "Add Property"});
    }
})
.post(upload.array('images'),async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/sign-in');
        } 
        else {
            let imageBuffer=[];
            for(let i=0;i<req.files.length;i++){
                let mime = req.files[i].mimetype;
                if(!((/^image\/(png|jpeg|jpg|tif|pjp|apng|xbm|jxl|svgz|ico|tiff|gif|svg|jfif|webp|bmp|pjpeg|avif)$/).test(mime))){
                    throw "Error: Selected image is not a right image type";
                }
                let base = req.files[i].buffer.toString('base64');
                let url = "data:"+mime+";base64,"+base;
                imageBuffer.push(url);
            }
            let address = req.body.address;
            let description = req.body.description;
            let laundry = req.body.laundry;
            let rent = req.body.rent;
            let listedBy = req.session.user.firstName;
            let emailId = req.session.user.emailId;
            let area = req.body.area;
            let bed = req.body.bed;
            let bath = req.body.bath;
            
            validate.validateProperty(address,description,laundry,rent,listedBy,emailId,area,bed,bath);
            await index.properties.createProperty(imageBuffer,address,description,laundry,rent,listedBy,emailId,area,bed,bath);
            res.redirect('/');
        }
    }catch(e) {
        return res.status(404).render('./error_page', {title: "Error", error: e});
    }
})

router.route('/editProperty/:id')
.get(async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/sign-in');
        } 
        else {
            let id = req.params.id;
            validate.checkId(id);
            let data = await index.properties.getPropertyById(id);

            return res.render('./owner_property_edit', {title: "Property", data: data});
        }
    }catch(e) {
        return res.status(404).render('./error_page', {title: "Error", error: e});
    }
})
.post(upload.array('images'),async (req, res) => {
    let id = req.params.id;
    try {
        id = validate.checkId(id);
        let imageBuffer=[];
        if(req.files){
            for(let i=0;i<req.files.length;i++){
                let mime = req.files[i].mimetype;
                if(!((/^image\/(png|jpeg|jpg|tif|pjp|apng|xbm|jxl|svgz|ico|tiff|gif|svg|jfif|webp|bmp|pjpeg|avif)$/).test(mime))){
                    throw "Error: Selected image is not a right image type";
                }
                let base = req.files[i].buffer.toString('base64');
                let url = "data:"+mime+";base64,"+base;
                imageBuffer.push(url);
            }
        }
        let address = req.body.address;
        let description = req.body.description;
        let laundry = req.body.laundry;
        let rent = req.body.rent;
        let listedBy = req.session.user.firstName;
        let emailId = req.session.user.emailId;
        let area = req.body.area;
        let bed = req.body.bed;
        let bath = req.body.bath;
        // console.log(req.files+" "+id+" "+address+" "+description+" "+laundry+" "+rent+" "+listedBy+" "+emailId+" "+area+" "+bed+" "+bath);
        validate.validateProperty(address,description,laundry,rent,listedBy,emailId,area,bed,bath);
        await index.owner.editProp(id,imageBuffer,address,description,laundry,rent,listedBy,emailId,area,bed,bath);
        let data = await index.properties.getPropertyById(id);
        res.render('./owner_property_edit', {title: "Property", data: data, msg: "Update successful"});
    }catch(e) {
        return res.status(404).render('./error_page', {title: "Error", error: e});
    }
})

router.route('/deleteProperty/:id')
.get(async (req, res) => {
    let id = req.params.id;
    try {
        if (!req.session.user) {
            res.redirect('/sign-in');
        } 
        else {
            id = validate.checkId(id);
            await index.properties.removeProperty(id, req.session.user.emailId);
            res.redirect('/owners/properties-list')
        }
    }catch(e) {
        return res.status(404).render('./error_page', {title: "Error", error: e});
    }
})

router.route('/deleteImage/:id')
.get(async (req, res) => {
    let id = req.params.id;
    try {
        if (!req.session.user) {
            res.redirect('/sign-in');
        } 
        else {
            id = validate.checkId(id);
            let propId = await index.properties.deleteImage(id);
            res.redirect('/properties/editProperty/'+propId);
        }
    }catch(e) {
        return res.status(404).render('./error_page', {title: "Error", error: e});
    }
})

module.exports = router;