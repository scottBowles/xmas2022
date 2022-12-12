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

export const getNow = () => new Date();

export const addKey =
	<T extends Record<string, unknown>, K extends string, V>(key: K, transform: (obj: T) => V) =>
	(obj: T): T & Record<K, V> => ({ ...obj, [key]: transform(obj) });

export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDuration(ms: number, withUnits = true) {
	const s = Math.floor(ms / 1000);
	const m = Math.floor(s / 60);
	const h = Math.floor(m / 60);
	const sec = s % 60;
	const min = m % 60;
	const hours = h % 24;
	const days = Math.floor(h / 24);
	if (withUnits) {
		const hoursStr = hours ? `${hours} hr ` : '';
		const minStr = min ? `${min} min ` : '';
		const secStr = sec + ' sec';
		const daysStr = days ? `${days} day ` : '';
		return daysStr + hoursStr + minStr + secStr;
	}
	const hoursStr = hours ? `${hours}:` : '';
	const minStr = min ? `${min}:` : '';
	const secStr = sec.toString().padStart(2, '0');
	const daysStr = days ? `${days}:` : '';
	return `${daysStr}${hoursStr}${minStr}${secStr}`;
}

export const dateToYYYYMMDD = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth().toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};
