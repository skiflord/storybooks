const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

//Load user model
require('./models/User');

//Passport Config
require('./config/passport')(passport);

const app = express();

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//Load Routes
const auth = require('./routes/auth');

//Load Keys
const keys = require('./config/keys');

//Mongoose Connect
mongoose.connect(keys.mongoURI, 
  {useNewUrlParser: true} )
  .then(() => console.log('Mongo connected'))
  .catch((err) => console.log(err));
    

app.get('/', (req, res) => res.send('It works!'));

//Use Routes
app.use('/auth', auth);

const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server run... on port ${port}`));