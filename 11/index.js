import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import 'colors';

console.time('main');
console.time('init');

const map = fs
	.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'input'), {
		encoding: 'utf-8',
	})
	.trim()
	.split('\n')
	.map((line) => Array.from(line.trim())); // ?

const galaxyIndexes = map.reduce(
	(indexes, row, index) => [
		...indexes,
		...row.reduce(
			(rowIndexes, char, charIndex) => (char === '.' ? rowIndexes : [...rowIndexes, [index, charIndex]]),
			[],
		),
	],
	[],
);

const emptyColumnsIndexes = Object.entries(map[0].map((_, index) => map.every((row) => row[index] === '.')))
	.filter(([, isEmpty]) => isEmpty)
	.map(([index]) => +index);

const emptyRowsIndexes = Object.entries(map.map((row) => row.every((char) => char === '.')))
	.filter(([, isEmpty]) => isEmpty)
	.map(([index]) => +index);

const expandGalaxyIndexes = (galaxyIndexes, spacing = 2) =>
	galaxyIndexes.map(([i, j]) => [
		emptyRowsIndexes.filter((elt) => elt <= i).length * (spacing - 1) + i,
		emptyColumnsIndexes.filter((elt) => elt <= j).length * (spacing - 1) + j,
	]);

const getDistancesSumBetweenGalaxyIndexes = (galaxyIndexes) => {
	const pairs = galaxyIndexes
		.map((coords, index, galaxyIndexes) => galaxyIndexes.slice(index + 1).map((coordsB) => [coords, coordsB]))
		.flat();

	const distances = pairs.map(([[ai, aj], [bi, bj]]) => Math.abs(ai - bi) + Math.abs(aj - bj));
	return distances.reduce((acc, elt) => acc + elt);
};

console.timeEnd('init');
console.time('part1');

const expandedGalaxyIndexes = expandGalaxyIndexes(galaxyIndexes);
const distancesSum = getDistancesSumBetweenGalaxyIndexes(expandedGalaxyIndexes);

console.log(`The sum of the distances is ${distancesSum.toString().red}.`);

console.timeEnd('part1');
console.time('part2');

const farGalaxyIndexes = expandGalaxyIndexes(galaxyIndexes, 1_000_000); // ?
const farDistancesSum = getDistancesSumBetweenGalaxyIndexes(farGalaxyIndexes);

console.log(`The sum of the furthest distances is ${farDistancesSum.toString().green}.`);

console.timeEnd('part2');
console.timeEnd('main');
