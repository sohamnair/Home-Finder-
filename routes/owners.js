const express = require('express');
const router = express.Router();
const index = require('../data/index');

const validate = require("../helpers");


router.route('/')
.get(async (req, res) => {
    if (!req.session.user) {
        res.redirect('/sign-in');
    } 
    else {
        let emailId = req.session.user.emailId;
        let data = await index.owner.getOwnerByEmail(emailId); 
        return res.render('./owner_profile_page', {title: "Profile", data: data, msg: ""});
    }
})
.post(async (req, res) => {
    try {
        let emailId = req.body.emailIdInput;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let contact = req.body.contact;
        let gender = req.body.gender;
        let city = req.body.city;
        let state = req.body.state;
        let age = req.body.age;
        
        validate.validateUpdate(emailId,firstName,lastName,contact,gender,city,state,age);
        emailId=emailId.trim().toLowerCase();
        firstName=firstName.trim();
        lastName=lastName.trim();
        contact=contact.trim();
        gender=gender.trim();
        city=city.trim();
        state=state.trim();
        age=age.trim(); 
        let data = await index.owner.updateOwnerDetails(emailId, firstName, lastName, contact, gender, city, state, age);
        
        req.session.user = {emailId: emailId, userType: 'owner', firstName:firstName}; 
        return res.render('./owner_profile_page', {title: "Profile", data: data, msg: "Profile updated successfully"});
    }catch(e) {
        let data = await index.owner.getOwnerByEmail(req.body.emailIdInput);
        res.status(404).render('./owner_profile_page', {title: "Profile", data: data, msg: "Profile update failed", error: e})
    }
})

router.route('/properties-list')
.get(async (req, res) => {
    if (!req.session.user) {
        res.redirect('/sign-in');
    } 
    else {
        let emailId = req.session.user.emailId;
        let response = await index.owner.getOwnerByEmail(emailId); 

        if(!response.properties || response.properties.length == 0) return res.render('./owner_properties_empty_list_page', {title: "No properties found"});
        else {
            let data = await index.properties.getAllPropertiesByUser(response.properties);
            return res.render('./owner_properties_list_page', {title: `Hello ${req.session.user.firstName}, here are your properties`, data: data});
        }
    }
})

module.exports = router;