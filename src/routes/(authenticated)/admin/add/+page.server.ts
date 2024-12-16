import { jsonSafeParse } from '@/utils';
import {
	makeFramed,
	makeFramedSchema,
	makeMultipleOpenResponse,
	makeMultipleOpenResponseSchema,
	makeWordle,
	makeWordleSchema,
} from '@/utils/make';
import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

const objectWithTypeSchema = z
	.object({
		challengeType: z.enum(['framed', 'wordle', 'multipleOpen']),
	})
	.passthrough();

export const actions: Actions = {
	default: async ({ request }) => {
		console.log('Starting');
		const data = await request.formData();
		let json = data.get('json')?.toString();
		console.log('with');
		console.log('json: ' + json);
		console.log('//////////////////////////');
		console.log('json raw value:', JSON.stringify(json));
		console.log('//////////////////////////');

		if (!json) return fail(400, { error: 'Missing json' });

		json = json.replace(/\\"/g, '"');
		// const parsedJson = jsonSafeParse(json);
		let parsedJson;
		try {
			parsedJson = JSON.parse(json);
		} catch (e) {
			console.log('error parsing json');
			console.log(e);
			return fail(400, { error: e });
		}
		console.log('parsed json: ', parsedJson);
		console.log('//////////////////////////');
		if (!parsedJson) return fail(400, { error: 'Invalid JSON' });

		const parseType = objectWithTypeSchema.safeParse(parsedJson).data;
		console.log('parsed type: ', objectWithTypeSchema.safeParse(parsedJson));
		console.log('//////////////////////////');
		if (!parseType) return fail(400, { error: 'Error parsing challengeType' });

		const { challengeType, ...restData } = parseType;

		if (challengeType === 'framed') {
			console.log('making framed');
			console.log('parsing json');
			if (!parsedJson) return fail(400, { error: 'Invalid JSON' });
			const parsed = makeFramedSchema.safeParse(restData);
			console.log('parsing');
			console.log('parse result: ' + JSON.stringify(parsed));
			if (!parsed.data) return fail(400, { error: 'Invalid data schema' });
			console.log('parsed successfully');
			console.log('making challenge');
			const challenge = await makeFramed(parsed.data);
			console.log('made challenge');
			return { success: true, challenge };
		}

		if (challengeType === 'wordle') {
			console.log('making wordle');
			console.log('parsing json');
			if (!parsedJson) return fail(400, { error: 'Invalid JSON' });
			const parsed = makeWordleSchema.safeParse(restData);
			console.log('parsing');
			console.log('parse result: ' + JSON.stringify(parsed));
			if (!parsed.data) return fail(400, { error: 'Invalid data schema' });
			console.log('parsed successfully');
			console.log('making challenge');
			const challenge = await makeWordle(parsed.data);
			console.log('made challenge');
			return { success: true, challenge };
		}

		if (challengeType === 'multipleOpen') {
			console.log('making multiple open');
			console.log('parsing json');
			if (!parsedJson) return fail(400, { error: 'Invalid JSON' });
			const parsed = makeMultipleOpenResponseSchema.safeParse(restData);
			console.log('parsing');
			console.log('parse result: ' + JSON.stringify(parsed));
			if (!parsed.data) return fail(400, { error: 'Invalid JSON' });
			console.log('parsed successfully');
			console.log('making challenge');
			const challenge = await makeMultipleOpenResponse(parsed.data);
			console.log('made challenge');
			return { success: true, challenge };
		}
	},
};
