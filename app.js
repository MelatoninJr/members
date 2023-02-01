const express = require('express')
const app = express()
app.use(express.json());
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const User = require('./schema/user')
const bcrypt = require('bcryptjs')
var cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json())

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin:admin@cluster0.mstcgxc.mongodb.net/members?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Mongo'))

app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, user)
          } else {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          }
        })
      });
    })
  );



  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        console.log('deserialized');

      return done(null, user);
    });
  });





app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.urlencoded({ extended: false }));

const signUpRouter = require('./routes/sign-up')
const loginRouter = require('./routes/login')
app.use("/sign-up", signUpRouter)
app.use('/login', loginRouter)


app.listen(3000, ()=> {
    console.log('Listening on port 3000')
})


module.exports = passport;