require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

//인증된 사용자인지 검증합니다.
async function authMiddleware(req, res, next) {
	const [tokenType, tokenValue] = req.headers.authorization.split(' ');
	// console.log(tokenType);
	if (tokenType !== 'Bearer' || !tokenValue) {
		return res.status(400).json({ message: '토큰이 없습니다.' });
	}

	const tokenValueVerify = jwt.verify(tokenValue, process.env.SECRET_KEY);

	//verify 할때 에러남. 에러처리 다시 할것.
	if (!tokenValueVerify) {
		return res.status(400).json({ message: '토큰이 만료되었습니다.' });
	}

	const findUser = await User.findOne({ where: { id: tokenValueVerify.id } });
	if (!findUser) {
		return res.status(401).json({ message: '로그인을 해주세요.' });
	}
	// console.log(req.locals);
	// req.locals.user = req.user;
	res.locals.user = findUser;
	next();
}

//이미 로그인한 회원인지 검증합니다.
async function alreadyLogin(req, res, next) {
	console.log(req.headers.authorization);
	if (!req.headers.authorization) {
		next();
	} else if (req.body.email) {
		return res.status(401).json({ message: '이미 로그인한 회원입니다.' });
	}
}

module.exports = { authMiddleware, alreadyLogin };
