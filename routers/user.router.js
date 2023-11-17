require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index.js');
const registerValidation = require('../middleware/register.js');
const { alreadyLogin } = require('../middleware/auth.js');
const router = express.Router();

// User.destroy({
// 	where: { nickName: '오란씨' }
// });

//회원가입 기능
router.post('/register', alreadyLogin, registerValidation, async (req, res) => {
	const { nick_name, email, password, passwordRe, birth_year, birth_month, birth_day, address } = req.body;

	const sameEmail = await User.findOne({ where: { email: email } });
	if (sameEmail) {
		return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
	}

	const hashPassword = bcrypt.hashSync(password, 10);

	const newUser = await User.create({
		nick_name,
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

//로그인 기능
router.post('/auth/login', alreadyLogin, async (req, res) => {
	const { email, password } = req.body;

	const sameEmailData = await User.findOne({ where: { email } });
	if (!sameEmailData) {
		return res.status(404).json({ message: '존재하지 않는 회원입니다.' });
	}

	const isSameUser = bcrypt.compareSync(password, sameEmailData.password);
	if (!isSameUser) {
		return res.status(400).json({ message: '비빌번호가 일치하지 않습니다.' });
	}

	const jwtToken = jwt.sign(
		{
			id: sameEmailData.id,
			nickName: sameEmailData.nickName
		},
		process.env.SECRET_KEY,
		{
			expiresIn: '12h'
		}
	);
	console.log(jwtToken);
	res.header.authorization = `Bearer ${jwtToken}`;
});

module.exports = router;
