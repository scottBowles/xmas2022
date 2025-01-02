export type CharStatus = 'absent' | 'present' | 'correct';

export type CharValue =
	| 'Q'
	| 'W'
	| 'E'
	| 'R'
	| 'T'
	| 'Y'
	| 'U'
	| 'I'
	| 'O'
	| 'P'
	| 'A'
	| 'S'
	| 'D'
	| 'F'
	| 'G'
	| 'H'
	| 'J'
	| 'K'
	| 'L'
	| 'Z'
	| 'X'
	| 'C'
	| 'V'
	| 'B'
	| 'N'
	| 'M';

export const charsFromWord = (word: string): CharValue[] =>
	word
		.toUpperCase()
		.split('')
		.filter((char) => char.match(/[A-Z]/)) as CharValue[];

export const getStatuses = (guessChars: CharValue[], answerChars: CharValue[]): CharStatus[] => {
	const charCount = {} as Record<CharValue, number>;
	return guessChars.map((char, i) => {
		if (answerChars[i] === char) {
			charCount[char] = charCount[char] ? charCount[char] + 1 : 1;
			return 'correct';
		}
		const charIsPresent = answerChars.includes(char);
		const numOfThisCharInCorrectAnswer = answerChars.filter((c) => c === char).length;
		const allOfCharAreAlreadyMarkedPresent = (charCount[char] ?? 0) >= numOfThisCharInCorrectAnswer;
		if (charIsPresent && !allOfCharAreAlreadyMarkedPresent) {
			charCount[char] = charCount[char] ? charCount[char] + 1 : 1;
			return 'present';
		}
		return 'absent';
	});
};
