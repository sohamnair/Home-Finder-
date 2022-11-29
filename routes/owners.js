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
        return res.render('./owner_profile_page', {title: "Profile", data: data});
    }
})
.post(async (req, res) => {
    try {
        let emailId = req.body.emailIdInput;
        let password = req.body.passwordInput;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let contact = req.body.contact;
        let gender = req.body.gender;
        let city = req.body.city;
        let state = req.body.state;
        let age = req.body.age;
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
        await index.owner.updateOwnerDetails(emailId, password, firstName, lastName, contact, gender, city, state, age);
        res.redirect('/properties');
    }catch(e) {
        res.status(404).render('./properties', {title: "Profile", error: e})
    }
})

router.route('/properties-list')
.get(async (req, res) => {
    if (!req.session.user) {
        res.redirect('/sign-in');
    } 
    else {
        let emailId = req.session.user.emailId;
        let response = index.owner.getOwnerByEmail(emailId); 
        let data = await index.properties.getAllPropertiesByUser(response.properties);
        return res.render('./owner_properties_list_page', {title: "Properties", data: data});
    }
})
// .post(async (req, res) => {})

module.exports = router;