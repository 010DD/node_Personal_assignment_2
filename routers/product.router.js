const express = require('express');
const { User, Product } = require('../models');
const router = express.Router();

//상품 작성하기
router.post('/product', async (req, res) => {
	const { product_name, price, comment, buy_date } = req.body;
	console.log(product_name, price, comment, buy_date);

	// await Product.create(req.body);
	// res.send(req.body);
});

module.exports = router;
