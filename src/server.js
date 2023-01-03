require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const bcrypt    = require('bcrypt');

// DEFINING CONSTANTS
const PORT = process.env.API_PORT;

// initiating express server
const app = express();

// APPLICATION MIDDLEWARES

// adding Helmet to enhance our API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use( express.json() );

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// authentication layer
app.use(function (req, res, next) {
    // console.log(req.headers);

    const secretKey = req.headers['secret_key'];
    const publicKey = req.headers['public_key'];

    console.log('secretKey', secretKey);
    console.log('publicKey', publicKey);

    if( publicKey == process.env.API_PUBLIC_KEY
        && bcrypt.compareSync( secretKey, process.env.API_SECRET_KEY )
    ) {
        next();
    } else {
        return res.status(403).json({
            error: "Code Authentication Failure"
        });
    }
});

// END: APPLICATION MIDDLEWARES



// starting the server
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
});


// expoting file modules
module.exports = {
    app,
    // shopify,
    // shopifySession
};


