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
	.split('\n')
	.map((line) => line.trim());

console.timeEnd('init');

console.time('part 1');

const NUMBER_REGEX = /^(\D*(?<firstDigit>\d).*(?<lastDigit>\d)\D*)|(\D*(?<onlyDigit>\d)\D*)$/;

const total = input.map((line) => {
	const { groups: { firstDigit, lastDigit, onlyDigit } } = NUMBER_REGEX.exec(line);
	return +(onlyDigit ? `${onlyDigit}${onlyDigit}` : `${firstDigit}${lastDigit}`);
}).reduce((acc, elt) => acc + elt);

console.log(`The total is ${total.toString().red} !`);

console.timeEnd('part 1');
console.time('part 2');

const map = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
	zero: 0,
};
const entries = Object.entries(map);

const COMPLEX_REGEX = /^(?<previous>\D*)(?<firstDigit>\d).*(?<lastDigit>\d)(?<final>\D*)$/;
const ALTERNATIVE_REGEX = /^(?<previous>\D*)(?<firstDigit>\d)(?<final>\D*)$/;

const part2Total = input.map((line) => {
	const matching = COMPLEX_REGEX.exec(line) ?? ALTERNATIVE_REGEX.exec(line);
	const { groups: { previous, firstDigit, lastDigit, final } } = matching ?? {
		groups: {
			previous: line,
			final: line,
		}
	};
	const previousCorresponding = entries.filter(([key]) => previous.includes(key)).toSorted(([keyA], [keyB]) => previous.indexOf(keyA) - previous.indexOf(keyB))?.[0]?.[1];
	const lastCorresponding = entries.filter(([key]) => final.includes(key)).toSorted(([keyA], [keyB]) => final.lastIndexOf(keyB) - final.lastIndexOf(keyA))?.[0]?.[1];
	const finalFirst = previousCorresponding ?? firstDigit;
	const lastFirst = lastCorresponding ?? lastDigit ?? firstDigit ?? previousCorresponding;

	return +`${finalFirst}${lastFirst}`;
}).reduce((acc, elt) => acc + elt);

console.log(`The true total of calibration values is ${part2Total.toString().green} !`);
console.timeEnd('part 2');
console.timeEnd('main');
