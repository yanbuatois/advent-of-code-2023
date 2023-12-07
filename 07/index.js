import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import 'colors';

console.time('main');
console.time('init');
const hands = fs
	.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'input'), {
		encoding: 'utf-8',
	})
	.trim()
	.split('\n')
	.map((line) =>
		line
			.trim()
			.split(' ')
			.map((part) => part.trim()),
	);

const Card = {
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	T: 10,
	J: 11,
	Q: 12,
	K: 13,
	A: 14,
};

const CardWithJoker = {
	J: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	T: 10,
	Q: 12,
	K: 13,
	A: 14,
};

const HandType = {
	HIGH_CARD: 1,
	ONE_PAIR: 2,
	TWO_PAIR: 3,
	THREE_OF_A_KIND: 4,
	FULL_HOUSE: 5,
	FOUR_OF_A_KIND: 6,
	FIVE_OF_A_KIND: 7,
};

const handToObject = (hand, resolveJokers = false) => {
	const cards = Array.from(hand);
	let cardsCount = cards.reduce(
		(acc, card) => ({ ...acc, ...(card in acc ? { [card]: acc[card] + 1 } : { [card]: 1 }) }),
		{},
	);
	if (resolveJokers && 'J' in cardsCount) {
		const values = Object.entries(cardsCount)
			.filter(([index]) => index !== 'J')
			.toSorted(([, a], [, b]) => b - a);
		const jokersCount = cardsCount.J;
		const toAdd = values.length ? values[0][0] : 'A';
		if (!values.length) {
			values.push([toAdd, jokersCount]);
		} else {
			values[0][1] += jokersCount;
		}
		cardsCount = cards
			.map((card) => (card === 'J' ? toAdd : card))
			.reduce((acc, card) => ({ ...acc, ...(card in acc ? { [card]: acc[card] + 1 } : { [card]: 1 }) }), {});
	}
	const values = Object.values(cardsCount).toSorted((a, b) => b - a);
	const type = (() => {
		if (values[0] === 3 && values[1] === 2) {
			return HandType.FULL_HOUSE;
		}
		if (values[0] === 2 && values[1] === 2) {
			return HandType.TWO_PAIR;
		}
		switch (values[0]) {
			case 1:
				return HandType.HIGH_CARD;
			case 2:
				return HandType.ONE_PAIR;
			case 3:
				return HandType.THREE_OF_A_KIND;
			case 4:
				return HandType.FOUR_OF_A_KIND;
			case 5:
				return HandType.FIVE_OF_A_KIND;
			default:
				throw new Error(`Unhandled hand ${hand}`);
		}
	})();

	return {
		type,
		cardsValues: cards.map((card) => (resolveJokers ? CardWithJoker : Card)[card]),
	};
};

console.timeEnd('init');
console.time('part1');
const sortedHands = hands
	.map(([hand, bid]) => [handToObject(hand), +bid])
	.toSorted(([handA], [handB]) => {
		if (handA.type !== handB.type) {
			return handA.type - handB.type;
		}
		return handA.cardsValues.reduce((acc, value, index) => (acc === 0 ? value - handB.cardsValues[index] : acc), 0);
	});

const weightedScores = sortedHands.map(([, bid], index) => (index + 1) * bid);
const sum = weightedScores.reduce((acc, score) => acc + score);

console.log(`The total winnings is ${sum.toString().yellow}.`);

console.timeEnd('part1');
console.time('part2');

const sortedJokerHands = hands
	.map(([hand, bid]) => [handToObject(hand, true), +bid])
	.toSorted(([handA], [handB]) => {
		if (handA.type !== handB.type) {
			return handA.type - handB.type;
		}
		return handA.cardsValues.reduce((acc, value, index) => (acc === 0 ? value - handB.cardsValues[index] : acc), 0);
	});

const weightedJokerScores = sortedJokerHands.map(([, bid], index) => (index + 1) * bid);
const jokerSum = weightedJokerScores.reduce((acc, score) => acc + score);

console.log(`The total winnings with jokers is ${jokerSum.toString().green}.`);

console.timeEnd('part2');
console.timeEnd('main');
