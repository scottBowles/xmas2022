import { correctAnswerFromOptions, normalize, response } from './utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from './types';

const correctAnswer: CorrectAnswer = correctAnswerFromOptions;

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	normalize(correctAnswer(challenge) || '') === normalize(response(challenge) || '');

const scoreChallenge: ScoreChallenge = (challenge) =>
	responseIsCorrect(challenge) ? challenge.points : 0;

export { correctAnswer, responseIsCorrect, scoreChallenge };
