type TakenElfNamesMinimalInput = { response: string }[];
type TakenElfNames = <T extends TakenElfNamesMinimalInput>(
	challengeResponses: T
) =>
	| {
			takenFirstNames: string[];
			takenLastNames: string[];
	  }
	| undefined;

const takenElfNames: TakenElfNames = (challengeResponses) => {
	const takenElfNames = challengeResponses.map((data) => JSON.parse(data.response) as unknown);
	if (Array.isArray(takenElfNames)) {
		const takenFirstNames = takenElfNames.map((name) => {
			if (typeof name === 'object' && !!name && 'selectedFirstName' in name) {
				return String(name.selectedFirstName);
			}
			return '';
		});
		const takenLastNames = takenElfNames.map((name) => {
			if (typeof name === 'object' && !!name && 'selectedLastName' in name) {
				return String(name.selectedLastName);
			}
			return '';
		});
		return { takenFirstNames, takenLastNames };
	}
};

export { takenElfNames };
