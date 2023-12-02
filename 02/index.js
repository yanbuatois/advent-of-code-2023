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
	.map((line) => line.split(':', 2)[1].trim())
	.map((line) =>
		line.split(';').map((group) =>
			group
				.trim()
				.split(',')
				.map((cube) => {
					const [number, color] = cube.trim().split(' ', 2);
					return {
						number: +number,
						color,
					};
				}),
		),
	);

const HANDLED_COLORS = ['red', 'green', 'blue'];

const minimumNeededCubesCount = input.map((game) =>
	game.reduce(
		(acc, serie) => ({
			...acc,
			...Object.fromEntries(
				serie.filter(({ color, number }) => acc[color] < number).map(({ color, number }) => [color, number]),
			),
		}),
		Object.fromEntries(HANDLED_COLORS.map((color) => [color, 0])),
	),
);

console.timeEnd('init');
console.time('part1');

const CEILS = {
	red: 12,
	green: 13,
	blue: 14,
};

const satisfyingGames = Object.entries(minimumNeededCubesCount)
	.filter(([key, value]) => Object.entries(value).every(([key, value]) => CEILS[key] >= value))
	.map(([index]) => +index + 1)
	.reduce((acc, elt) => acc + elt);

console.log(`The sum of possible games ids is ${satisfyingGames.toString().green}`);

console.timeEnd('part1');
console.time('part2');

const powers = minimumNeededCubesCount.map((counts) => Object.values(counts).reduce((acc, elt) => acc * elt));
const powersSum = powers.reduce((acc, elt) => acc + elt);

console.log(`The sum of the powers is ${powersSum.toString().red}`);

console.timeEnd('part2');
console.timeEnd('main');
