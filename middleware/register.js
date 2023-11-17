const Joi = require('joi');

const registerValidation = async (req, res, next) => {
	const body = req.body;
	const schema = Joi.object({
		nick_name: Joi.string().min(2).max(30).required(),
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
			.required(),
		password: Joi.string().min(6).required(),
		passwordRe: Joi.ref('password'),
		birth_year: Joi.number().min(1900).max(2022),
		birth_month: Joi.number().min(1).max(12),
		birth_day: Joi.number().min(1).max(31),
		address: Joi.string()
	});

	try {
		const temp = schema.validateAsync(body);
		console.log('temp => ', temp);
	} catch (err) {
		// return res.status(400).json({ message: '형식이 올바르지 않습니다. 비밀번호는 6글자 이상이여야 합니다.' });
		//next(err);
		// throw err;
		console.log(err);
	}
	next();
};

module.exports = registerValidation;

//{ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }
