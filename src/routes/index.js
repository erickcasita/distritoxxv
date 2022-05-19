const express = require('express');
const router = express.Router();
const passport = require('passport');
//const {isNotLoggedIn} = require('../lib/auth');
router.get('/',(req,res)=>{
    res.render('index');
});
router.post('/signin',passport.authenticate('local.signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
  }));
module.exports = router;

module.exports = router;

