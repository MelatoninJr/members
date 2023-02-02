const express = require('express')
const router = express.Router()
const User = require('../schema/user')
const bcrypt = require('bcryptjs')
const { body, validationResult, check } = require('express-validator')

router.get('/', (req, res) => {
    res.render("./views/sign-up")
})







router.post('/', [
    // email must be an email
    body('email').isEmail(),
    // password must be at least 4 chars long
    body('password').isLength({ min: 4 })
  ], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
    const user = new User({
       username: req.body.username,
       firstname: req.body.firstname,
       lastname: req.body.lastname,
       email: req.body.email,
       password: req.body.password 
    })
    
    try{
        const usernameExists = await User.findOne({ username: req.body.username });
        const emailExists = await User.findOne({ email: req.body.email });

        if (usernameExists) {
            return res.status(400).json({ errors: [{ msg: 'Username already taken' }] });
        }

        if (emailExists) {
            return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
        }
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            // if err, do something
            if(err) {
                return next(err)
            }
            const user = new User({
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPassword 
             })
             const newUser = await user.save()
            // otherwise, store hashedPassword in DB
          });
        

        res.redirect('/login')
        console.log('user save success')
    } catch (err){
        console.error(err)
        res.status(400).json(err)
    }
});




module.exports = router