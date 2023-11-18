require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index.js');
const { registerValidation, loginValidation } = require('../middleware/register.js');
const { alreadyLogin } = require('../middleware/auth.js');
const {
	EmailExistError,
	NickNameExistError,
	UserDosntExistError,
	PasswordIncorrectError
} = require('../middleware/CustomError.js');

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
router.post('/auth/login', alreadyLogin, loginValidation, async (req, res, next) => {
	const { email, password } = req.body;
	console.log('password=>', password);
	try {
		//회원이 존재 하는가.
		const sameEmailData = await User.findOne({ where: { email } });
		console.log(sameEmailData);
		if (!sameEmailData) {
			throw new UserDosntExistError();
		}

		//비밀번호가 동일한가.
		const isSameUser = bcrypt.compareSync(password, sameEmailData.password);
		console.log('isSameUser=>', isSameUser);
		if (!isSameUser) {
			throw new PasswordIncorrectError();
		}

		const jwtToken = jwt.sign(
			{
				id: sameEmailData.id,
				nickName: sameEmailData.nickName
			},
			process.env.SECRET_KEY,
			{ expiresIn: '12h' }
		);
		console.log(jwtToken);
		res.header.authorization = `Bearer ${jwtToken}`;
	} catch (err) {
		// res.send(err);
		next(err);
	}
	res.status(200).json({ success: true, message: '로그인 되었습니다.' });
	next();
});

module.exports = router;
