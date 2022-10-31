export const JWT_EXPIRATION_DAYS = 15;
export const JWT_SIGN_OPTIONS = { expiresIn: `${JWT_EXPIRATION_DAYS}d` };
export const AUTH_COOKIE_OPTIONS = { path: '/', maxAge: 60 * 60 * 24 * 16 };
