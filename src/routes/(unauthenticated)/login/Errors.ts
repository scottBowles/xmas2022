enum LoginError {
	EMAIL_MISSING,
	INVALID,
	UNKNOWN
}

enum SignupError {
	EMAIL_TAKEN,
	VALIDATION,
	UNKNOWN
}

export { LoginError, SignupError };
