const express = require('express');
const bcrypt = require('bcrypt');
const joi = require('joi');
const { User, Product, sequelize } = require('../models');
const registerValidation = require('../middleware/register.js');
const router = express.Router();

// User.destroy({
// 	where: { name: '삼다수' }
// });

router.post('/register', registerValidation, async (req, res) => {
	const { name, email, password, passwordRe, birth_year, birth_month, birth_day, address } = req.body;

	const sameEmail = await User.findOne({ where: { email: email } });
	if (sameEmail) {
		return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
	}

	const hashPassword = bcrypt.hashSync(password, 10);

	const newUser = await User.create({
		name,
		email,
		password: hashPassword,
		birth_year,
		birth_month,
		birth_day,
		address
	});

	// if (!email) {
	// 	return res.status(400).json({ message: '이메일을 입력해주세요' });
	// }
	// if (password.length < 6) {
	// 	return res.status(400).json({ message: '비밀번호는 6자리 이상이여야 합니다.' });
	// }
	// if (newUser.errorMessage) {
	// 	throw new Error(newUser.errorMessage);
	// }
	// if (password !== passwordRe) {
	// 	return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
	// }

	res.status(200).json({ message: '회원가입이 완료되었습니다.' });
});

router.post('/auth/login', async (req, res) => {
	const { email, password } = req.body;
	// console.log(email, password);

	//비밀번호 동일한지(데이터베이스 비번이랑 비교)
	const sameEmailData = await User.findOne({ where: { email } });
	console.log('000=>', sameEmailData);
	if (!sameEmailData) {
		return res.status(404).json({ message: '존재하지 않는 회원입니다.' });
	}
	const isSameUser = await bcrypt.compare(password, sameEmailData.password);
	console.log(Boolean(isSameUser));
	if (!isSameUser) {
		return res.status(400).json({ message: '비빌번호가 일치하지 않습니다.' });
	}
});

module.exports = router;
