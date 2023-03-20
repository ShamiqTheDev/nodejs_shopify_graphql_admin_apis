const express   = require('express');

let router      = express.Router();
let request     = require('request');
let logger      = require('../logger');

// Init logger
const log       = logger({ subFolder:'pricelist-upload', filePrefix:'plu' });

// Module's constants
const PriceListGIDPrefix = process.env.SHOPIFY_PRICELIST_GID_PREFIX;
const ProductVariantGIDPrefix = process.env.SHOPIFY_PRODUCT_VARIANT_GID_PREFIX;



// Enabling fileupload
const multer = require('multer');
const upload = multer({ dest: './uploads/PriceLists/' });

// Read uploaded file
const readXlsxFile = require('read-excel-file/node');

router.route('/upload')
  .post(upload.single('price_list_file'), (req, res) => {
    try {

        let priceListID = req.body.price_list_id;
        let priceListGID = PriceListGIDPrefix + priceListID;

        readXlsxFile(req.file.path).then(async (rows) => {
            rows.shift(); // to remove headings in excel

            let pricesArr = [];
            let itemsCounter = 0;
            let shopifyLimit = 250;

            rows.map((col, index) => {
                // let country         = col[0]; //Country
                let variantID           = col[1]; // Variant Id
                let price               = col[2]; // Price
                let compareAtPrice      = col[3]; // Compare At
                let currencyCode        = col[4]; // Currency
                let variantGID          = ProductVariantGIDPrefix + variantID;
                let submitLastBatch     = !rows[index+1]; // To submit last batch

                let priceObj = {
                    "compareAtPrice": {
                        "amount": compareAtPrice,
                        "currencyCode": currencyCode
                    },
                    "price": {
                        "amount": price,
                        "currencyCode": currencyCode
                    },
                    "variantId": variantGID
                }

                pricesArr.push(priceObj);
                itemsCounter++;

                if(itemsCounter == shopifyLimit || submitLastBatch) {
                    console.log(`itemsCounter, shopifyLimit: ${itemsCounter}, ${shopifyLimit}`);
                    log.info(`itemsCounter, shopifyLimit: ${itemsCounter}, ${shopifyLimit}`);

                    let options = {
                        'method': 'POST',
                        'url': process.env.SHOPIFY_GRAPHQL_API_ENDPOINT,
                        'headers': {
                            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
                            'Content-Type': process.env.SHOPIFY_HEADER_CONTENT_TYPE
                        },
                        body: JSON.stringify(
                        {
                            query: `mutation priceListFixedPricesAdd($priceListId: ID!, $prices: [PriceListPriceInput!]!) {
                            priceListFixedPricesAdd(priceListId: $priceListId, prices: $prices) {
                                prices {
                                compareAtPrice {
                                    amount
                                    currencyCode
                                }
                                price {
                                    amount
                                    currencyCode
                                }
                                }
                                userErrors {
                                field
                                code
                                message
                                }
                            }
                            }`,
                            variables: {
                                "priceListId": priceListGID,
                                "prices": pricesArr
                            }

                        })
                    };

                    console.log(`pricesArr.length: ${pricesArr.length}`);
                    log.info(`pricesArr.length: ${pricesArr.length}`);

                    request(options, function (error, response, body) {
                        if (error) {
                            log.error(error);
                            throw new Error(error);
                        }

                        console.log({body});
                        log.error({body});
                    });

                    pricesArr = [];
                    itemsCounter = 0;
                }
            });

            res.send({
                code: 200,
                msg: 'Pricelists Uploaded successfully',
            });

        });
    } catch (error) {
        log.error(error);
    }
  }// end /upload post
);

module.exports = router;


