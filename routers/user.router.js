require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index.js');
const registerValidation = require('../middleware/register.js');
const { alreadyLogin } = require('../middleware/auth.js');
const { EmailExistError, NickNameExistError } = require('../middleware/CustomError.js');

const router = express.Router();
// User.destroy({
// 	where: { nickName: '오란씨' }
// });

//회원가입 기능
router.post('/register', alreadyLogin, registerValidation, async (req, res, next) => {
	const { nick_name, email, password, birth_year, birth_month, birth_day, address } = req.body;
	try {
		//이미 존재하는 이메일, 닉네임인 경우
		const sameEmail = await User.findOne({ where: { email } });
		const sameNick_name = await User.findOne({ where: { nick_name } });

		if (sameEmail) {
			throw new EmailExistError();
		}
		if (sameNick_name) {
			throw new NickNameExistError();
		}

		const hashPassword = bcrypt.hashSync(password, 10);
		console.log('해쉬패스워드=>', hashPassword);

		const newUser = await User.create({
			nick_name,
			email,
			password: hashPassword,
			birth_year,
			birth_month,
			birth_day,
			address
		});

		return res.status(200).json({ message: '회원가입이 완료되었습니다.', newUser });
	} catch (err) {
		next(err);
	}
});

//로그인 기능
router.post('/auth/login', alreadyLogin, async (req, res) => {
	const { email, password } = req.body;

	const sameEmailData = await User.findOne({ where: { email } });
	if (!sameEmailData) {
		const newError = new Error();
		console.log('에러 테스트', newError);
		// return res.status(404).json({ message: '존재하지 않는 회원입니다.' });
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
