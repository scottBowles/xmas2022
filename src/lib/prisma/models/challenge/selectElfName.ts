import { response } from './utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from './types';

const correctAnswer: CorrectAnswer = () => undefined;

const responseIsCorrect: ResponseIsCorrect = (challenge) => !!response(challenge);

const scoreChallenge: ScoreChallenge = (challenge) =>
	responseIsCorrect(challenge) ? challenge.points : 0;

export { correctAnswer, responseIsCorrect, scoreChallenge };
