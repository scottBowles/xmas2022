import { WORDS } from './constants/wordlist';
import { VALIDGUESSES } from './constants/validGuesses';

export const isWordInWordList = (word: string) => {
	return WORDS.includes(word.toLowerCase()) || VALIDGUESSES.includes(word.toLowerCase());
};

export const isWinningWord = (word: string) => {
	return solution === word;
};

export const getWordOfDay = () => {
	// const dayOne = dayjs('2022-02-22');
	// const today = dayjs();
	// const daysSince = today.diff(dayOne, 'days');
	// const tomorrow = today.add(1, 'day').startOf('day');

	// return {
	// 	solution: WORDS[daysSince % WORDS.length].toUpperCase(),
	// 	solutionIndex: daysSince,
	// 	tomorrow
	// };
	return { solution: 'TESTY', solutionIndex: 0, tomorrow: '2022-02-22' };
};

export const { solution, solutionIndex, tomorrow } = getWordOfDay();
