import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import 'colors';

console.time('main');
console.time('init');

const input = fs
	.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'input'), {
		encoding: 'utf-8',
	})
	.trim()
	.replaceAll('\r\n', '\n');

const isAdjacent = ({ line: numberLine, start, end }, { line: symbolLine, position }) =>
	symbolLine <= numberLine + 1 && symbolLine >= numberLine - 1 && position <= end + 1 && position >= start - 1;

const NUMBER_REGEXP = /\d+/dg;
const SYMBOL_REGEXP = /[^\d.\s]/g;

const lineLength = input.split('\n', 1)[0].trim().length + 1;

const numbers = Array.from(input.matchAll(NUMBER_REGEXP)).map((match) => ({
	value: +match[0],
	line: Math.floor(match.index / lineLength),
	start: match.index % lineLength,
	end: (match.indices[0][1] % lineLength) - 1,
}));
const symbols = Array.from(input.matchAll(SYMBOL_REGEXP)).map((match) => ({
	symbol: match[0],
	line: Math.floor(match.index / lineLength),
	position: match.index % lineLength,
}));

console.timeEnd('init');
console.time('part1');

const numbersToAdd = numbers.filter((number) => symbols.some((symbol) => isAdjacent(number, symbol)));

const result = numbersToAdd.reduce((acc, { value }) => acc + value, 0);

console.log(`The sum of all part numbers is ${result.toString().yellow}.`);

console.timeEnd('part1');
console.time('part2');

const sum = symbols
	.map((symbol) => {
		if (symbol.symbol !== '*') {
			return undefined;
		}

		const adjacentNumbers = numbers.filter((number) => isAdjacent(number, symbol));

		if (adjacentNumbers.length !== 2) {
			return undefined;
		}

		return adjacentNumbers;
	})
	.filter(Boolean)
	.map((numbers) => numbers.reduce((acc, { value }) => acc * value, 1))
	.reduce((acc, elt) => acc + elt);

console.log(`The sum of all gear ratios is ${sum.toString().green} !`);

console.timeEnd('part2');
console.timeEnd('main');
