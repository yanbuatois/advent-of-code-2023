import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import 'colors';

console.time('main');
console.time('init');
const cards = fs
	.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'input'), {
		encoding: 'utf-8',
	})
	.trim()
	.split('\n')
	.map((line) => line.split(':', 2)[1].trim())
	.map((line) =>
		line.split('|').map((group) =>
			group
				.trim()
				.replaceAll(/\s{2,}/g, ' ')
				.split(' ')
				.map((number) => +number),
		),
	)
	.map(([winning, numbers], index) => ({
		winning,
		numbers,
		index,
	}));

const getWinningNumber = ({ winning, numbers }) => numbers.filter((number) => winning.includes(number)).length;

console.timeEnd('init');
console.time('part1');

const winningNumbersCount = cards.map(getWinningNumber);

const score = winningNumbersCount.reduce(
	(acc, winningNumber) => acc + (winningNumber === 0 ? 0 : Math.pow(2, winningNumber - 1)),
	0,
);

console.log(`The total score for the cards is ${score.toString().green} !`);

console.timeEnd('part1');
console.time('part2');

const cardsWithMultiplier = cards.map((card) => ({ ...card, multiplier: 1 }));

const cardsWithFinalMultiplier = cardsWithMultiplier.reduce((acc, element, index, array) => {
	const winningNumber = getWinningNumber(element);
	const startIndex = index + 1;
	const endIndex = startIndex + winningNumber;
	array.splice(
		startIndex,
		winningNumber,
		...array.slice(startIndex, endIndex).map((elt) => ({
			...elt,
			multiplier: elt.multiplier + element.multiplier,
		})),
	);

	return [...acc, element]; // ?
}, []);

const sum = cardsWithFinalMultiplier.reduce((acc, { multiplier }) => acc + multiplier, 0);

console.log(`The length of the final pile is ${sum.toString().green}.`);

console.timeEnd('part2');
console.timeEnd('main');
