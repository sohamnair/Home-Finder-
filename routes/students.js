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
        let data = await index.student.getStudentByEmail(emailId); 
        return res.render('./student_profile_page', {title: "Profile", data: data});
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
        let data = await index.student.updateStudentDetails(emailId, firstName, lastName, contact, gender, city, state, age);
        req.session.user = {emailId: emailId, userType: "student", firstName:firstName};
        return res.render('./student_profile_page', {title: "Profile", data: data, msg: "Profile updated successfully"});
    }catch(e) {
        let data = await index.student.getStudentByEmail(req.body.emailIdInput); 
        res.status(404).render('./student_profile_page', {title: "Profile", data: data, msg: "Profile update failed", error: e})
    }
})

router.route('/favourites-list')
.get(async (req, res) => {
    if (!req.session.user) {
        res.redirect('/sign-in');
    } 
    else {
        let emailId = req.session.user.emailId;
        let response = index.owner.getOwnerByEmail(emailId); 
        let data = await index.properties.getAllPropertiesByUser(response.favourites);
        return res.render('./student_favourites_list_page', {title: "Favourites", data: data});
    }
})
// .post(async (req, res) => {})


module.exports = router;