const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// defining an array, default response
const deafult = [
    {
        code: 200,
        data: {
            msg: "All the APIs are up and running"
        }
    }
];

// adding Helmet to enhance our API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));


app.get('/', (req, res) => {
    res.send(deafult);
});

app.post('/upload-pricelist', (req, res) => {
    res.send({
        msg: 'my custom response'
    });
});


// starting the server
const PORT = 3001;
app.listen(PORT, () => {
console.log(`listening on PORT ${PORT}`);
});
