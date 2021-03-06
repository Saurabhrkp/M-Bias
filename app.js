const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

// Creating express app
const app = express();

// Passport Config
require('./lib/passport')(passport);

// Calling MongoDB
require('./models/database');

// Gets Status of Express app
app.use(require('express-status-monitor')());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Calling routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

// view engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Serving static public folder
app.use(express.static(path.join(__dirname, 'public')));

// Logging
app.use(logger('dev'));

// Body parser for Forms
app.use(bodyParser.json());

// Express body parser
app.use(express.urlencoded({ extended: true }));

//  Protects app from some well-known web vulnerabilities
app.use(helmet());

// Compress all routes
app.use(compression());

// Moment Locals
app.locals.moment = require('moment');

// Express session
app.use(
  session({
    secret: 'secret',
    name: 'connect.sid',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14 /* expires in 14 days*/,
      httpOnly: true,
    }, // week
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  /* custom middleware to put our user data (from passport)
     on the req.user so we can access it as such anywhere
     in our app
   */
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/api', userRouter);
app.use('/admin', adminRouter);

/* Error handling from async / await functions */
app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).json(message);
});

module.exports = app;
