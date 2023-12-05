import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import 'colors';

console.time('main');
console.time('init');
const [inputSeedLine, ...inputRemainingParts] = fs
	.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'input'), {
		encoding: 'utf-8',
	})
	.trim()
	.replaceAll('\r\n', '\n')
	.split('\n\n')
	.map((block) => block.trim());

const seeds = inputSeedLine
	.split(':', 2)[1]
	.trim()
	.split(' ')
	.map((elt) => +elt);

const maps = inputRemainingParts.map((part) =>
	part
		.split(':')[1]
		.trim()
		.split('\n')
		.map((line) =>
			line
				.trim()
				.split(' ')
				.map((value) => +value.trim()),
		),
);

console.timeEnd('init');
console.time('part1');

const locations = seeds.map((seed) =>
	maps.reduce(
		(acc, map) =>
			map.reduce(
				([seed, moved], [end, begin, length]) =>
					moved
						? [seed, moved]
						: seed >= begin && seed < begin + length
						  ? [end + (seed - begin), true]
						  : [seed, false],
				[acc, false],
			)[0],
		seed,
	),
);

const minimalLocation = Math.min(...locations);

console.log(`The minimal location is ${minimalLocation.toString().green}.`);

console.timeEnd('part1');
console.time('part2');

const multipleSeeds = seeds
	.reduce(
		(chunked, value, index) =>
			index % 2
				? chunked.with(chunked.length - 1, [chunked[chunked.length - 1][0], value])
				: [...chunked, [value]],
		[],
	)
	.toSorted(([a], [b]) => a - b);
const sortedMaps = maps.map((map) => map.toSorted(([, a], [, b]) => a - b));
let ranges = multipleSeeds;
for (const map of sortedMaps) {
	const newRanges = [];
	for (const range of ranges) {
		let [seed, count] = range;
		for (const [end, begin, length] of map) {
			const beginEnd = begin + length;
			const tmpEnd = seed + count;
			if (
				(seed >= begin && seed < beginEnd) ||
				(tmpEnd >= begin && tmpEnd < beginEnd) ||
				(seed < begin && tmpEnd >= beginEnd)
			) {
				if (seed < begin) {
					newRanges.push([seed, begin - seed]);
					seed = begin;
					count -= begin - seed;
				}
				const seedEnd = seed + count - 1;
				const newBegin = seed - begin + end;
				if (seedEnd < beginEnd) {
					newRanges.push([newBegin, count]);
					count = 0;
					break;
				} else {
					const newLength = length - (seed - begin);
					newRanges.push([newBegin, newLength]);
					count -= newLength;
					seed = beginEnd;
					if (count === 0) {
						break;
					}
				}
			}
		}
		if (count !== 0) {
			newRanges.push([seed, count]);
		}
	}
	ranges = newRanges.toSorted(([a], [b]) => a - b);
}

const min = ranges[0][0];

console.log(`The minimal location with a lot of grains is ${min.toString().green}.`);

console.timeEnd('part2');
console.timeEnd('main');
