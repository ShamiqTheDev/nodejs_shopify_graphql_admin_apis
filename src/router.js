const modules = require('./server.js');
const app = modules.app;

// Controllers
const pricelistController = require('./controllers/pricelistController');


// Routes
app.use('/pricelist', pricelistController);


