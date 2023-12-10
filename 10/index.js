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
	.map((line) => Array.from(line.trim()));

const getFollowingStartingPoint = (i, j) => {
	if (i - 1 >= 0 && ['|', '7', 'F'].includes(map[i - 1][j])) {
		return [i - 1, j];
	}
	if (i + 1 < map.length && ['|', 'L', 'J'].includes(map[i + 1][j])) {
		return [i + 1, j];
	}
	if (j - 1 >= 0 && ['-', 'L', 'F'].includes(map[i][j - 1])) {
		return [i, j - 1];
	}
	if (j + 1 < map[i].length && ['-', 'J', '7'].includes(map[i][j + 1])) {
		return [i, j + 1];
	}

	throw new Error('No beginning found around starting point.');
};

const getFollowingCoords = (currentPoint, oldI, oldJ, i, j) => {
	switch (currentPoint) {
		case 'S':
			return getFollowingStartingPoint(i, j);
		case '|':
			return [oldI < i ? i + 1 : i - 1, j];
		case '-':
			return [i, oldJ < j ? j + 1 : j - 1];
		case 'L':
			return [oldI === i ? i - 1 : i, oldJ === j ? j + 1 : j];
		case 'J':
			return [oldI === i ? i - 1 : i, oldJ === j ? j - 1 : j];
		case '7':
			return [oldI === i ? i + 1 : i, oldJ === j ? j - 1 : j];
		case 'F':
			return [oldI === i ? i + 1 : i, oldJ === j ? j + 1 : j];
		default:
			throw new Error(`Unhandled ${currentPoint} at [${i};${j}].`);
	}
};

console.timeEnd('init');
console.time('part1');

const startingPosition = map.reduce((acc, line, index) => {
	if (acc) {
		return acc;
	}
	const lineIndex = line.indexOf('S');
	if (lineIndex !== -1) {
		return [index, lineIndex];
	}
	return null;
}, null);

const loopLength = (() => {
	let [i, j] = startingPosition;
	let [oldI, oldJ] = [i, j];
	let currentPoint = map[i][j];
	let count = 0;
	do {
		const newCoords = getFollowingCoords(currentPoint, oldI, oldJ, i, j);
		[oldI, oldJ] = [i, j];
		[i, j] = newCoords;
		++count;
		currentPoint = map[i][j];
	} while (currentPoint !== 'S');

	return count;
})();

const maxDistance = Math.floor(loopLength / 2);

console.log(`The furthest point is at ${maxDistance.toString().yellow} steps.`);

console.timeEnd('part1');
console.time('part2');

const getStartingPointType = (i, j) => {
	const up = i - 1 >= 0 && ['|', '7', 'F'].includes(map[i - 1][j]);
	const bottom = i + 1 < map.length && ['|', 'L', 'J'].includes(map[i + 1][j]);
	const left = j - 1 >= 0 && ['-', 'L', 'F'].includes(map[i][j - 1]);
	const right = j + 1 < map[i].length && ['-', 'J', '7'].includes(map[i][j + 1]);
	if (up) {
		if (bottom) {
			return '|';
		}
		if (left) {
			return 'J';
		}
		if (right) {
			return 'L';
		}
	}
	if (bottom) {
		if (left) {
			return '7';
		}
		if (right) {
			return 'F';
		}
	}
	if (left && right) {
		return '-';
	}

	throw new Error('No beginning found around starting point.');
};

const visitedMap = map.map((line) => line.map(() => false));

(() => {
	let [i, j] = startingPosition;
	let [oldI, oldJ] = [i, j];
	let currentPoint = map[i][j];
	do {
		visitedMap[i][j] = true;
		const newCoords = getFollowingCoords(currentPoint, oldI, oldJ, i, j);
		[oldI, oldJ] = [i, j];
		[i, j] = newCoords;
		currentPoint = map[i][j];
	} while (currentPoint !== 'S');
})();

const enclosedCount = (() => {
	let count = 0;
	for (let i = 0; i < visitedMap.length; ++i) {
		const row = visitedMap[i];
		let currentlyEnclosed = false;
		let enclosing = null;
		for (let j = 0; j < row.length; ++j) {
			const mapElt = map[i][j] === 'S' ? getStartingPointType(i, j) : map[i][j];
			if (row[j]) {
				if (['|', 'L', 'F'].includes(mapElt)) {
					enclosing = mapElt;
					currentlyEnclosed ^= true;
				} else if ((mapElt === '7' && enclosing === 'F') || (mapElt === 'J' && enclosing === 'L')) {
					currentlyEnclosed ^= true;
				}
			} else if (currentlyEnclosed) {
				++count;
			}
		}
	}

	return count;
})();

console.log(`There is ${enclosedCount.toString().green} enclosed cells.`);

console.timeEnd('part2');
console.timeEnd('main');
