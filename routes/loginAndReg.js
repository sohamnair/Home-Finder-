const express = require('express');
const router = express.Router();
const index = require('../data/index');

router.route('/')
.get(async (req, res) => {
    if (!req.session.user) {
        res.redirect('/sign-in');
    } 
    else {
        res.redirect('/properties');
    }

    // res.redirect('/properties');
})

router.route('/sign-in')
.get(async (req, res) => {
    if (!req.session.user) {
        return res.render('./sign-in_page', {title: "Sign-in Page"});
    } 
    else {
        res.redirect('/properties');
    }

    // return res.render('./sign-in_page', {title: "Sign-in Page"});
})
.post(async (req, res) => {
    try {
        let emailId = req.body.emailIdInput;
        let password = req.body.passwordInput;
        let userType = req.body.userType; 
        if(userType == 'owner') await index.owner.checkUser(emailId, password);
        else await index.student.checkUser(emailId, password);
        req.session.user = {emailId: emailId};
        res.redirect('/properties');
    }catch(e) {
        res.status(404).render('./sign-in_page', {title: "Sign-in Page", error: e})
    }
})

router.route('/sign-up')
.get(async (req, res) => {
    if (!req.session.user) {
        return res.render('./sign-up_page', {title: "Sign-up Form"});
    } 
    else {
        res.redirect('/properties');
    }

    // return res.render('./sign-up_page', {title: "Sign-up Form"});
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
        let userType = req.body.userType; 
        if(userType == 'owner') await index.owner.createUser(emailId, password, firstName, lastName, contact, gender, city, state, age);
        else await index.student.createUser(emailId, password, firstName, lastName, contact, gender, city, state, age);
        res.redirect('/sign-in');
    }catch(e) {
        res.status(404).render('./sign-up_page', {title: "Sign-up Form", error: e})
    }
})

module.exports = router;