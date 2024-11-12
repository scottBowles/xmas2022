import { isNotNil } from 'ramda';
import { z } from 'zod';

export const responseTakenElfNamesResponseSchema = z
	.object({
		selectedFirstName: z.string(),
		selectedLastName: z.string(),
	})
	.optional();

type TakenElfNamesMinimalInput = {
	response: string;
	responseSelectElfName?: { selectedFirstName: string; selectedLastName: string };
}[];
type TakenElfNames = <T extends TakenElfNamesMinimalInput>(
	challengeResponses: T
) =>
	| {
			takenFirstNames: string[];
			takenLastNames: string[];
	  }
	| undefined;

const takenElfNames: TakenElfNames = (challengeResponses) =>
	challengeResponses
		.map(
			({ responseSelectElfName, response }) =>
				responseSelectElfName ||
				responseTakenElfNamesResponseSchema.safeParse(JSON.parse(response) as unknown).data
		)
		.filter(isNotNil)
		.reduce(
			(acc, cur) => ({
				takenFirstNames: [...acc.takenFirstNames, cur.selectedFirstName],
				takenLastNames: [...acc.takenLastNames, cur.selectedLastName],
			}),
			{ takenFirstNames: [] as string[], takenLastNames: [] as string[] }
		);

export { takenElfNames };
