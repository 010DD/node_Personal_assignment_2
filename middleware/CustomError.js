class WriteEmailError extends Error {
	constructor(message) {
		super(message);
		this.name = 'WriteEmailError';
	}
}

class PasswordLengthError extends Error {
	constructor(message) {
		super(message);
		this.name = 'PasswordLengthError';
	}
}

class PasswordReError extends Error {
	constructor(message) {
		super(message);
		this.name = 'PasswordReError';
	}
}

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

class WriteNickNameError extends Error {
	constructor(message) {
		super(message);
		this.name = 'WriteNickNameError';
	}
}

class WritePasswordError extends Error {
	constructor(message) {
		super(message);
		this.name = 'WritePasswordError';
	}
}

module.exports = {
	WriteEmailError,
	PasswordLengthError,
	PasswordReError,
	EmailExistError,
	NickNameExistError,
	WriteNickNameError,
	WritePasswordError
};
