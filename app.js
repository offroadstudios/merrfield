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
const vehiclesRouter  = require('./routes/vehicles');
const carsRouter      = require('./routes/cars');
const adminRouter     = require('./routes/admin');
const syncRouter      = require('./routes/sync');
const UserModel       = require('./models/CustomerModel');
const AutomatedSyncScheduler = require('./utils/automatedSyncScheduler');

const app = express();

/* Connect to MongoDB */
(async () => {
  try {
    await mongoose.connect('mongodb://win:KZSkFl1aamuVfNb9@ac-evylqtx-shard-00-00.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-01.xhngg04.mongodb.net:27017,ac-evylqtx-shard-00-02.xhngg04.mongodb.net:27017/autorizz-db?ssl=true&replicaSet=atlas-12fnql-shard-0&authSource=admin&retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('✅ MongoDB connected successfully');
    
    // Initialize automated sync scheduler (non-blocking)
    try {
      const syncScheduler = new AutomatedSyncScheduler();
      syncScheduler.initialize();
      
      // Run initial sync in background (don't await)
      console.log('🔄 Starting initial sync in background...');
      syncScheduler.runManualSync().then(() => {
        console.log('✅ Initial sync completed');
      }).catch(err => {
        console.error('⚠️ Initial sync failed:', err.message);
      });
      
      console.log('✅ Automated sync scheduler started');
    } catch (syncErr) {
      console.error('⚠️ Sync scheduler initialization failed:', syncErr.message);
      // Don't exit the app if sync fails
    }
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('⚠️ App will continue without database connection');
    // Don't exit the app - let it start and handle DB errors gracefully
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
app.use(compression());

console.log('App is starting…');

/* Routes - Define before static middleware */
app.get('/', (req, res) => res.redirect('/home'));
app.get('/login', (req, res) => res.redirect('/admin'));

// Health check endpoint for Azure (must be before static middleware)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Static middleware after routes
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/vehicles', vehiclesRouter);
app.use('/cars', carsRouter);
app.use('/suv', suvRouter);
app.use('/hatchback', hatchbackRouter);
app.use('/saloon', saloonRouter);
app.use('/sync', syncRouter);

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
