require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// DEFINING CONSTANTS
const PORT = process.env.API_PORT;


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

module.exports = app;


// defining an array, default response
const deafult = [
    {
        code: 200,
        data: {
            msg: "All the APIs are up and running"
        }
    }
];

app.get('/', (req, res) => {
    res.send(deafult);
});


