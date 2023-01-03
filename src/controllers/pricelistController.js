const express = require('express');

let router      = express.Router();
let request     = require('request');


// Module's constants
const PriceListGIDPrefix = process.env.SHOPIFY_PRICELIST_GID_PREFIX;
const ProductVariantGIDPrefix = process.env.SHOPIFY_PRODUCT_VARIANT_GID_PREFIX;

// File Uploading
const readXlsxFile = require('read-excel-file/node');
const multer = require('multer');
const upload = multer({ dest: './uploads/PriceLists/' });

router.route('/upload')
    .post(upload.single('price_list_file'), (req, res) => {
        // console.log(req.file.path);
        // console.log('pricelist_id', req.body.price_list_id);

        let priceListID = req.body.price_list_id;
        let priceListGID = PriceListGIDPrefix + priceListID;

        readXlsxFile(req.file.path).then(async (rows) => {
            rows.shift(); // to remove headings in excel

            let pricesArr = [];
            let itemsCounter = 0;
            let shopifyLimit = 250;

            // var responses = [];
            rows.map((col, index) => {

                // let country         = col[0]; //Country
                let variantID           = col[1]; // Variant Id
                let price               = col[2]; // Price
                let compareAtPrice      = col[3]; // Compare At
                let currencyCode        = col[4]; // Currency
                let variantGID          = ProductVariantGIDPrefix + variantID;
                let submitLastBatch    = !rows[index+1]; // To submit last batch
                // console.log('rows[index+1]', submitLastBatch);

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

                // console.log('itemsCounter', itemsCounter);
                if(itemsCounter == shopifyLimit || submitLastBatch) {
                    console.log(`itemsCounter, shopifyLimit: ${itemsCounter}, ${shopifyLimit}`);

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

                    console.log('pricesArr.length' ,pricesArr.length);
                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);

                        // responses.push({body})
                        // console.log(JSON.parse(body));
                        console.log({body});
                    });

                    pricesArr = [];
                    itemsCounter = 0;
                }
            });

            res.send({
                code: 200,
                msg: 'Pricelists Uploaded successfully',
                // responseData: responses

            });

        });
    });

module.exports = router;


