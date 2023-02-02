const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', (req, res) => {
    res.render('./views/login')
})
router.post("/", passport.authenticate("local", {
    successRedirect: "/messages",
    failureRedirect: "/failure"
}), (req, res) => {
});


module.exports = router