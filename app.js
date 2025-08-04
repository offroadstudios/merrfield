const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');
const exphbs          = require('express-handlebars');
const mongoose        = require('mongoose');
const compression     = require('compression');
const suvRouter       = require('./routes/suv_index');
const hatchbackRouter = require('./routes/hatchback_index');
const saloonRouter    = require('./routes/saloon_index');
const adminRouter     = require('./routes/admin');
const UserModel       = require('./models/CustomerModel');

const app = express();

/* Connect to MongoDB */
(async () => {
  try {
    await mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority&appName=autorizz-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB Error: Failed to connect');
    console.error(err);
    process.exit(1);
  }
})();

/* View engine setup */
app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', '.hbs');

/* Middleware */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

console.log('App is starting…');

/* Routes */
app.get('/', (req, res) => res.redirect('/home'));

app.get('/home', (req, res) =>
  res.sendFile(path.join(__dirname, 'routes', 'home.html'))
);

// *** Register your new login routes BEFORE the 404 handler ***
app.get('/login', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'routes', 'login.html'), err => {
    if (err) {
      console.error('Error sending login.html:', err);
      return next(err);
    }
  });
});

app.get('/loginerror', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'routes', 'loginerror.html'), err => {
    if (err) {
      console.error('Error sending loginerror.html:', err);
      return next(err);
    }
  });
});

app.use('/admin', adminRouter);
app.use('/suv', suvRouter);
app.use('/hatchback', hatchbackRouter);
app.use('/saloon', saloonRouter);

app.post('/customer', async (req, res) => {
  const user = new UserModel({
    name:  req.body.username,
    email: req.body.useremail,
    phone: req.body.userphone
  });
  try {
    const userRes = await user.save();
    console.log(userRes);
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving customer:', err);
    res.status(500).json({ error: 'Failed to save customer' });
  }
});

/* Catch 404 and forward to error handler */
app.use((req, res, next) => {
  next(createError(404));
});

/* Error handler */
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
