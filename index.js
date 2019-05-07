const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

//Load user model
require('./models/User');

//Passport Config
require('./config/passport')(passport);

const app = express();

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//Load Keys
const keys = require('./config/keys');

//Mongoose Connect
mongoose.connect(keys.mongoURI, 
  {useNewUrlParser: true} )
  .then(() => console.log('Mongo connected'))
  .catch((err) => console.log(err));

//Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server run... on port ${port}`));