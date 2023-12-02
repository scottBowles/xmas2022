import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { dateToYYYYMMDD, urls } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { filter, groupBy, pipe, prop } from 'ramda';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;
	const now = new Date();

	if (!userId) throw redirect(302, urls.login());

	// need to find the day index and group name

	const [challengeSets, groups] = await Promise.all([
		prisma.challengeSet.findMany({
			...(!locals.user?.isAdmin && { where: { timeAvailableStart: { lte: now } } }),
			select: {
				id: true,
				title: true,
				timeAvailableStart: true,
				isTimed: true,
				isScored: true,
				challenges: { select: { id: true }, orderBy: { id: 'asc' } }
			}
		}),
		prisma.group.findMany({
			where: { users: { some: { user: { id: userId } } } },
			select: { name: true }
		})
	]);

	const groupName = groups[0].name;

	const groupByDate = groupBy((set: (typeof challengeSets)[number]) => {
		if (!set.timeAvailableStart) return 'Invalid Date';
		const date = new Date(set.timeAvailableStart);
		if (isNaN(date.getTime())) return 'Invalid Date';
		return dateToYYYYMMDD(date);
	});

	const challengeSetsByDate = pipe(
		filter(pipe(prop('timeAvailableStart'), Boolean)),
		groupByDate
	)(challengeSets);

	const days = Object.keys(challengeSetsByDate).sort((a, b) => {
		if (a === 'Invalid Date') return 1;
		if (b === 'Invalid Date') return -1;
		return a > b ? 1 : -1;
	});

	const latestDay = days.at(-1);
	const yearShown = latestDay ? new Date(latestDay).getFullYear() : 2023;
	const daysInYear = days.filter((day) => new Date(day).getFullYear() === yearShown);

	const dayShown =
		dateToYYYYMMDD(new Date()) in challengeSetsByDate
			? daysInYear.indexOf(dateToYYYYMMDD(new Date()))
			: 'total';

	throw redirect(302, urls.scoreboard(groupName, yearShown, dayShown));
};
