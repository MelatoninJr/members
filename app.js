const express = require('express')
const app = express()
app.use(express.json());
const path = require("path");
var session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const User = require('./schema/user')
const bcrypt = require('bcryptjs')
require('dotenv').config()
var cors = require('cors')
process.NODE_ENV = 'production'
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());


mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Mongo'))

app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Incorrect password" });
            }
        } catch (error) {
            return done(error);
        }
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
const messageRouter = require('./routes/messages')
const userRouter = require('./routes/users')
const logoutRouter = require('./routes/logout')
app.get('/', function(req, res) {
    res.redirect('/login')
})
app.use("/sign-up", signUpRouter)
app.use('/login', loginRouter)
app.use('/messages', messageRouter)
app.use('/users', userRouter)
app.use('/logout', logoutRouter)

app.listen(proccess.env.PORT, ()=> {
    console.log('Listening on port 3000')
})


module.exports = passport;