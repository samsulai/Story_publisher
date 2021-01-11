const path = require('path')
const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const morgan = require('morgan');
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

//load the config file
dotenv.config({path : './config/config.env'})
//passport config
require('./config/passport')(passport)
connectDB();

const app = express();
//logging
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
//session middlewares
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),

}))
//passport middlewares
app.use(passport.initialize())
app.use(passport.session())
//static folder

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
const port = process.env.PORT || 5000;
app.listen(port, console.log(`server running on ${process.env.NODE_ENV} MODE on ${port}`));
