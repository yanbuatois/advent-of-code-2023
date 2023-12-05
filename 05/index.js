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

// const betterMaps = maps.map((map) => map.map((row) => ({})))

// const ranges = maps.map((map) =>
// 	map.reduce(
// 		(range, [end, begin, length]) => ({
// 			...range,
// 			...Object.fromEntries(
// 				Array(length)
// 					.fill(0)
// 					.map((_, index) => [begin + index, end + index]),
// 			),
// 		}),
// 		{},
// 	),
// );

console.timeEnd('init');
console.time('part1');

// console.log(
// 	maps.reduce(
// 		(acc, map) =>
// 			map.reduce(
// 				(acc, [end, begin, length]) =>
// 					acc.map(([seed, moved]) => {
// 						const toReturn = moved
// 							? [seed, moved]
// 							: seed >= begin && seed < begin + length
// 							  ? [end + (seed - begin), true]
// 							  : [seed, false];
//
// 						if (typeof toReturn[0] !== 'number') {
// 							console.log('hi');
// 						}
//
// 						return toReturn;
// 					}),
// 				acc.map((seed) => [seed, false]),
// 			)[0],
// 		seeds,
// 	),
// );

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
); // ?

// const locations = ranges.reduce((acc, range) => acc.map((seed) => (seed in range ? range[seed] : seed)), seeds);
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
	.toSorted(([, a], [, b]) => a - b);
const sortedMaps = maps.map((map) => map.toSorted(([, a], [, b]) => a - b));
let ranges = multipleSeeds;
for (const map of sortedMaps) {
	let newRanges = [];
	for (const range of ranges) {
		newRanges = [];
		let [seed, count] = range;
		for (const [end, begin, length] of map) {
			const beginEnd = begin + length;
			if (seed >= begin && seed < beginEnd ||) {
				const seedEnd = seed + count - 1;
				const newBegin = seed - begin + end;
				if (seedEnd < beginEnd) {
					newRanges.push([newBegin, count]);
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
			if (count !== 0) {
				newRanges.push([seed, count]);
			}
		}
	}
	ranges = newRanges.toSorted(([, a], [, b]) => a - b);
}

const min = ranges[0][1];

//
// const totalSeeds = multipleSeeds.reduce((acc, [, count]) => acc + count, 0);
// console.log(`There is ${totalSeeds.toString().yellow} seeds to process. Please wait...`);
// const percent = Math.ceil(totalSeeds / 100);
//
// function* generateSeed(seeds) {
// 	for (const [seed, count] of seeds) {
// 		for (let i = 0; i < count; ++i) {
// 			yield seed + i;
// 		}
// 	}
// }
//
// let min = Infinity;
// let seedNumber = 0;
// let percents = 0;
// for (const seed of generateSeed(multipleSeeds)) {
// 	let position = seed;
// 	for (const map of maps) {
// 		for (const [end, begin, length] of map) {
// 			if (position >= begin && position < begin + length) {
// 				position += end - begin;
// 				break;
// 			}
// 		}
// 	}
//
// 	min = min < position ? min : position;
// 	if (++seedNumber === percent) {
// 		console.log(`${(++percents).toString().yellow}%`);
// 		seedNumber = 0;
// 	}
// }

console.log(`The minimal location with a lot of grains is ${min.toString().green}.`);

console.timeEnd('part2');
console.timeEnd('main');
