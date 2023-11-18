const ErrorHandler = (err, req, res, next) => {
	console.log('에러헨들러 미들웨어 구동중', err);

	if (err.name === 'EmailExistError') {
		return res.status(400).json({ success: false, erroerMessage: '이미 존재하는 이메일 입니다.' });
	}

	if (err.name === 'NickNameExistError') {
		return res.status(400).json({ success: false, erroerMessage: '이미 존재하는 닉네임 입니다.' });
	}

	const errPath = err.details[0].path[0];
	const errType = err.details[0].type;

	if (err.details[0]) {
		console.log('에러미들웨어돌아가는중');

		if (errPath === 'nick_name') {
			return res.status(400).json({ success: false, erroerMessage: '닉네임을 입력하세요.' });
		}
		if (errPath === 'email') {
			return res.status(400).json({ success: false, erroerMessage: '이메일을 확인해 주세요' });
		}
		if (errPath === 'password' || errPath === 'passwordRe') {
			if (errType === 'string.empty') {
				return res.status(400).json({ success: false, erroerMessage: '비밀번호를 입력해 주세요.' });
			}
			if (errType === 'string.min') {
				return res.status(400).json({ success: false, erroerMessage: '비밀번호는 6자리 이상이여야 합니다.' });
			}
			if (errType === 'any.only') {
				return res.status(400).json({ success: false, erroerMessage: '비밀번호가 일치하지 않습니다.' });
			}
		}
	}
	// res.status(500).json({ success: false, erroerMessage: '서버 오류' });
};

module.exports = ErrorHandler;
