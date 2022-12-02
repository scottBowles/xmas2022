import type { JwtPayload } from 'jsonwebtoken';

export { default as urls } from './urls';

export const isJwtExpiringWithinDays = (jwtPayload: JwtPayload, days = 7): boolean => {
	const exp = jwtPayload.exp;
	if (exp) {
		const expMs = exp * 1000;
		const nowMs = Date.now();
		const daysMs = days * 24 * 60 * 60 * 1000;
		return expMs < nowMs + daysMs;
	}
	return false;
};

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
	const result = {} as Pick<T, K>;
	keys.forEach((key) => {
		result[key] = obj[key];
	});
	return result;
};

export const getNow = () => new Date();

export const addKey =
	<T extends Record<string, unknown>, K extends string, V>(key: K, transform: (obj: T) => V) =>
	(obj: T): T & Record<K, V> => ({ ...obj, [key]: transform(obj) });
