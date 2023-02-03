const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', async(req, res) => {
    console.log('hello at logout page')
    console.log(req.user)
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    console.log('logout success?')
})


module.exports = router