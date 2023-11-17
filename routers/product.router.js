const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Product } = require('../models');
const { authMiddleware } = require('../middleware/auth.js');

const router = express.Router();

//상품 작성하기
router.post('/product', authMiddleware, async (req, res) => {
	// console.log('res.locals.user => ', res.locals.user);
	const user_id = res.locals.user.id;
	console.log('user_id=>', res.locals.user.id);
	const { product_name, price, comment, buy_date } = req.body;

	const newProduct = await Product.create({ user_id, product_name, price, comment, buy_date });
	return res.status(200).json({ message: '상품 업로드 완료하였습니다.', newProduct });
});

//상품 리스트 보여주기
router.get('/products', authMiddleware, async (req, res) => {
	const sortValue = req.query.sort;

	if (!sortValue || sortValue.toLowerCase() === 'desc') {
		sort = 'desc';
	} else if (sortValue.toLowerCase() === 'asc') {
		sort = 'asc';
	} else {
		return res.status(400).json({ message: '주소를 올바르게 입력해 주세요.' });
	}
	//쿼리스트링 sort가 아닌 다른 문자열로 입력햇을때 통과 못하게 에러처리 할 것

	const productJoinUser = await Product.findAll({
		include: { model: User },
		order: [['updatedAt', sort]]
	});

	const showList = productJoinUser.map((data) => {
		return {
			id: data.id,
			nick_name: data.User.nick_name,
			product_name: data.product_name,
			comment: data.comment,
			status: data.status,
			updatedAt: data.updatedAt
		};
	});

	return res.status(200).json({ message: '상품 리스트 조회 성공하였습니다.', showList });
});

//상품 상세 보여주기
router.get('/product/detail', authMiddleware, async (req, res) => {
	const productJoinUser = await Product.findAll({
		include: {
			model: User
		}
	});

	const showList = productJoinUser.map((data) => {
		return {
			id: data.id,
			nick_name: data.User.nick_name,
			product_name: data.product_name,
			comment: data.comment,
			status: data.status,
			price: data.price,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt
		};
	});

	return res.status(200).json({ message: '상품 리스트 조회 성공하였습니다.', showList });
});

//상품 수정하기
router.patch('/product/:id', authMiddleware, async (req, res) => {
	const { product_name, comment, status, price } = req.body;
	const { id } = req.params;

	const willModifyData = await Product.findOne({
		where: { id },
		include: User
	});
	const writerId = willModifyData.User.id;
	const userId = res.locals.user.id;
	console.log('writerId=>', writerId);
	console.log('userId', userId);

	if (writerId !== userId) {
		console.log(writerId);
		return res.status(401).json({ message: '작성자가 아님으로 수정할 수 없습니다.' });
	}

	await Product.update({ product_name, comment, status, price }, { where: { id } });
	return res.status(200).json({ message: '상품이 수정되었습니다.' });
});

//상품 삭제하기
router.delete('/product/:id', authMiddleware, async (req, res) => {
	const paramsId = req.params.id;
	const deleteData = await Product.findOne({ where: { id: paramsId } });
	console.log(deleteData.user_id);

	const userId = res.locals.user.id;
	console.log(userId);

	if (userId !== deleteData.user_id) {
		return res.status(400).json({ message: '작성자가 아님으로 상품을 삭제할 권한이 없습니다.' });
	}

	await Product.destroy({ where: { id: paramsId } });
	return res.status(200).json({ message: '상품이 삭제되었습니다.' });
});

module.exports = router;
