const modules = require('./server.js');
const app = modules.app;

// Controllers
const pricelistController = require('./controllers/pricelistController');


// Routes
app.use('/pricelist', pricelistController);


// defining an array, default response
const deafult = [
    {
        code: 200,
        data: {
            msg: "The APIs are up and running"
        }
    }
];

app.get('/', (req, res) => {
    res.send(deafult);
});


