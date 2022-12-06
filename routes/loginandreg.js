const express = require('express');
const router = express.Router();
const index = require('../data/index');

router.route('/')
.get(async (req, res) => {
    if (!req.session.user) {
        res.redirect('/sign-in');
    } 
    else {
        if(req.session.user.userType=='student'){
            res.redirect('/properties');
        }
        else{
            res.redirect('/owners/properties-list');
        }
    }

    // res.redirect('/properties');
})

router.route('/sign-in')
.get(async (req, res) => {
    if (!req.session.user) {
        return res.render('./sign-in_page', {title: "Sign-in Page"});
    } 
    else {
        if(req.session.user.userType=='student'){
            res.redirect('/properties');
        }
        else{
            res.redirect('/owners/properties-list');
        }
    }

    // return res.render('./sign-in_page', {title: "Sign-in Page"});
})
.post(async (req, res) => {
    try {
        let emailId = req.body.emailIdInput;
        let password = req.body.passwordInput;

        let userType = req.body.userType;
        validate.validateUser(emailId, password);
        emailId = emailId.trim().toLowerCase();
        let user;
        if(userType == 'owner'){
            user = await index.owner.checkUser(emailId, password);
        }
        else{
            user = await index.student.checkUser(emailId, password);
        }
        req.session.user = {emailId: emailId, userType: userType, firstName:user.firstName};
        if(req.session.user.userType=='student'){

        res.redirect('/properties');
        }
        else{
            res.redirect('/owners/properties-list');
        }
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
        if(req.session.user.userType=='student'){
            res.redirect('/properties');
        }
        else{
            res.redirect('/owners/properties-list');
        } 
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

        validate.validateRegistration(emailId, password, firstName, lastName, contact, gender, city, state, age);

        if(userType == 'owner') await index.owner.createUser(emailId, password, firstName, lastName, contact, gender, city, state, age);
        else await index.student.createUser(emailId, password, firstName, lastName, contact, gender, city, state, age);
        res.redirect('/sign-in');
    }catch(e) {
        res.status(404).render('./sign-up_page', {title: "Sign-up Form", error: e})
    }
})


router.route('/sign-out')
.get(async (req, res) => {
    req.session.destroy();
    res.clearCookie('AuthCookie');
    return res.render('./logout_page', {title: "Logout Successful"});
})


module.exports = router;