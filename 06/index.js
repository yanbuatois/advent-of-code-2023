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
	.map((block) => block.trim().split(':', 2)[1].trim());

const computeRootDifferences = (times, distances) => {
	const races = times.map((time, index) => [time, distances[index]]);
	return races.map(([t, y]) => {
		const delta = Math.pow(t, 2) - 4 * y;
		if (delta <= 0) return 0;
		const tmp = [-1, 1].map((coeff) => (-t + coeff * Math.sqrt(delta)) / -2).toSorted((a, b) => a - b);
		const start = Number.isInteger(tmp[0]) ? tmp[0] + 1 : Math.ceil(tmp[0]);
		const end = Number.isInteger(tmp[1]) ? tmp[1] - 1 : Math.floor(tmp[1]);

		return end - start + 1;
	});
};

console.timeEnd('init');
console.time('part1');

const [times, distances] = input.map((block) =>
	block
		.split(' ')
		.filter(Boolean)
		.map((value) => +value.trim()),
);

const rootDifferences = computeRootDifferences(times, distances); // ?

const errorMargin = rootDifferences.reduce((acc, val) => acc * val);

console.log(`The error margin is ${errorMargin.toString().yellow}.`);

console.timeEnd('part1');
console.time('part2');

const [newTimes, newDistances] = input.map((block) => [+block.replaceAll(/\s+/g, '').trim()]);

const newErrorMargin = computeRootDifferences(newTimes, newDistances)[0];

console.log(`The new error margin is ${newErrorMargin.toString().green}.`);

console.timeEnd('part2');
console.timeEnd('main');
