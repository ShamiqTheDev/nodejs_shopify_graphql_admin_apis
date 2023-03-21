const express           = require('express');
let router              = express.Router();
let uploadPricelist     = require('../services/pricelistUploadService');

// Enabling logging functionality in the application
let logger              = require('../logger');
const log               = logger({ subFolder:'pricelist-upload', filePrefix:'plu' });

// Enabling fileupload
const multer            = require('multer');
const upload            = multer({ dest: './uploads/PriceLists/' });

// Module's constants
const PriceListGIDPrefix = process.env.SHOPIFY_PRICELIST_GID_PREFIX;
const ProductVariantGIDPrefix = process.env.SHOPIFY_PRODUCT_VARIANT_GID_PREFIX;

router.route('/upload')
  .post(upload.single('price_list_file'), (req, res) => {
    try {
        uploadPricelist({
            req: req,
            res: res,
            log: log,
            PriceListGIDPrefix: PriceListGIDPrefix,
            ProductVariantGIDPrefix: ProductVariantGIDPrefix,
        });
    } catch (error) {
        console.log(error);
        log.error(error);
    }
  }// end /upload post
);

module.exports = router;


