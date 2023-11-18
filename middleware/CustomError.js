class EmailExistError extends Error {
	constructor(message) {
		super(message);
		this.name = 'EmailExistError';
	}
}

class NickNameExistError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NickNameExistError';
	}
}

class UserDosntExistError extends Error {
	constructor(message) {
		super(message);
		this.name = 'UserDosntExistError';
	}
}

class PasswordIncorrectError extends Error {
	constructor(message) {
		super(message);
		this.name = 'PasswordIncorrectError';
	}
}

module.exports = {
	EmailExistError,
	NickNameExistError,
	UserDosntExistError,
	PasswordIncorrectError
};
