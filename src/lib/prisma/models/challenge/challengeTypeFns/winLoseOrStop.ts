import { normalize, pointsManuallyAwarded, response } from '../utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from '../types';

type Prompt = { prompt: string; acceptedAnswers: string[] };

const correctAnswer: CorrectAnswer = (challenge) => {
	const prompt = JSON.parse(challenge.prompt || '[]') as { mainPrompt: string; prompts: Prompt[] };
	return prompt.prompts.map((val) => val.acceptedAnswers[0]).join(', ');
};

const responseIsCorrect: ResponseIsCorrect = (challenge) => {
	// our answer is going to be an array of strings. if the user fails, the array will
	// include the string "RESPONSE_FAIL". if the user passes all questions the array will just
	// be the length of the response. if the user stops, the array will include the string
	// "RESPONSE_STOP".
	const prompt = JSON.parse(challenge.prompt || '[]') as { mainPrompt: string; prompts: Prompt[] };
	const answer = JSON.parse(response(challenge) || '[]');
	return prompt.prompts.every((val, index) => {
		const allCorrect = val.acceptedAnswers.map(normalize).includes(normalize(answer[index] || ''));
		return allCorrect;
	});
};

const scoreChallenge: ScoreChallenge = (challenge) => {
	const res = JSON.parse(response(challenge) || '[]');
	const prompt = JSON.parse(challenge.prompt || '[]') as { mainPrompt: string; prompts: Prompt[] };
	const numQuestions = prompt.prompts.length;
	const numAnswers = res.length;
	const { answersCorrect, points } = prompt.prompts.reduce(
		(acc, val, index) => {
			const isCorrect = val.acceptedAnswers.map(normalize).includes(normalize(res[index] || ''));
			return isCorrect
				? { answersCorrect: acc.answersCorrect + 1, points: acc.points + index + 1 }
				: acc;
		},
		{ answersCorrect: 0, points: 0 }
	);
	const arePointsEarned =
		!res.includes('RESPONSE_FAIL') && numQuestions && numAnswers - answersCorrect < 2;
	const pointsForCorrect = arePointsEarned ? points : 0;
	return pointsForCorrect + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
