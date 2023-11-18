const Joi = require('joi');

//회원가입 유효성 검사
const registerValidation = async (req, res, next) => {
	const schema = Joi.object({
		nick_name: Joi.string().min(2).max(30).required(),
		email: Joi.string()
			.email({ minDomainSegments: 2, maxDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
			.required(),
		password: Joi.string().min(6).required(),
		passwordRe: Joi.ref('password'),
		birth_year: Joi.number().min(1900).max(2022),
		birth_month: Joi.number().min(1).max(12),
		birth_day: Joi.number().min(1).max(31),
		address: Joi.string()
	});
	try {
		await schema.validateAsync(req.body);
		next();
	} catch (err) {
		// res.send(err.details[0]);
		next(err);
	}
};

//로그인 유효성 검사
const loginValidation = async (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				maxDomainSegments: 2,
				tlds: { allow: ['com', 'net'] }
			})
			.required(),
		password: Joi.string().required()
	});
	try {
		await schema.validateAsync(req.body);
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = { registerValidation, loginValidation };
