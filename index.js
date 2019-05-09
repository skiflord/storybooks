const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

mongoose.set('debug', true);

//Load Models
require('./models/User');
require('./models/Story');

//Passport Config
require('./config/passport')(passport);

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Handlebars Helpers
const {
  truncate,
  stripTags,
  formateDate
} = require('./helpers/hbs');

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    truncate,
    stripTags,
    formateDate
  }
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

//Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

//Load Keys
const keys = require('./config/keys');

//Mongoose Connect
mongoose.connect(keys.mongoURI, 
  {useNewUrlParser: true} )
  .then(() => console.log('Mongo connected'))
  .catch((err) => console.log(err));
  
const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server run... on port ${port}`));