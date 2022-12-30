const modules = require('../server.js');
const express = require('express');

let router = express.Router();

const shopify = modules.shopify;


const readXlsxFile = require('read-excel-file/node');

const multer  = require('multer');
const upload = multer({ dest: './uploads/PriceLists/' });

const PriceListGIDPrefix = process.env.SHOPIFY_PRICELIST_GID_PREFIX;
const ProductVariantGIDPrefix = process.env.SHOPIFY_PRODUCT_VARIANT_GID_PREFIX;

router.route('/upload')
        .post( upload.single('price_list_file'), (req, res) => {
            // console.log(req.file.path);
            // console.log('pricelist_id', req.body.price_list_id);

            let priceListID = req.body.price_list_id;
            let priceListGID = PriceListGIDPrefix + priceListID;

            let pricesArr = [];
            readXlsxFile(req.file.path).then( async (rows) => {
                rows.shift();// to remove headings in excel

                rows.map( (col, index) => {
                    // let country         = col[0]; //Country
                    let variantID       = col[1]; // Variant Id
                    let price           = col[2]; // Price
                    let compareAtPrice  = col[3]; // Compare At
                    let currencyCode    = col[4]; // Currency
                    let variantGID      = ProductVariantGIDPrefix + variantID;

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

                });

                // const client = new shopify.clients.Graphql({session});
                // const data = await client.query({
                //     data: {
                //         "query": `mutation priceListFixedPricesAdd($priceListId: ID!, $prices: [PriceListPriceInput!]!) {
                //         priceListFixedPricesAdd(priceListId: $priceListId, prices: $prices) {
                //             prices {
                //             compareAtPrice {
                //                 amount
                //                 currencyCode
                //             }
                //             price {
                //                 amount
                //                 currencyCode
                //             }
                //             }
                //             userErrors {
                //             field
                //             code
                //             message
                //             }
                //         }
                //         }`,
                //         "variables": {
                //             "priceListId": priceListGID,
                //             "prices": pricesArr
                //         },
                //     }
                // });

                res.send({
                    code: 200,
                    data: 'pricesArr'
                });

            });
        });

module.exports = router;


