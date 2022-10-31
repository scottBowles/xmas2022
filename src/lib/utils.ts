import type { JwtPayload } from 'jsonwebtoken';

const isJwtExpiringWithinDays = (jwtPayload: JwtPayload, days = 7): boolean => {
	const exp = jwtPayload.exp;
	if (exp) {
		const expMs = exp * 1000;
		const nowMs = Date.now();
		const daysMs = days * 24 * 60 * 60 * 1000;
		return expMs < nowMs + daysMs;
	}
	return false;
};

const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
	const result = {} as Pick<T, K>;
	keys.forEach((key) => {
		result[key] = obj[key];
	});
	return result;
};

export { isJwtExpiringWithinDays, pick };
