require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const shopify = require('@shopify/shopify-api');

// DEFINING CONSTANTS
const PORT = process.env.API_PORT;

// initiating express server
const app = express();

// adding Helmet to enhance our API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// starting the server
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
});

app.use( express.json() );


// expoting file modules
module.exports = {
    app,
    shopify
};


