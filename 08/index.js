import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import 'colors';

console.time('main');
console.time('init');
const [rawDirections, rawLines] = fs
	.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'input'), {
		encoding: 'utf-8',
	})
	.trim()
	.replaceAll('\r\n', '\n')
	.split('\n\n')
	.map((block) => block.trim());
const LINE_REGEX = /^(?<node>\S{3})(\s*)=(\s*)\((?<left>\S{3}),\s*(?<right>\S{3})\)$/;

const lines = rawLines.split('\n').map((rawLine) => {
	const {
		groups: { node, left, right },
	} = LINE_REGEX.exec(rawLine);
	return [
		node,
		{
			L: left,
			R: right,
		},
	];
});

const nodesMap = Object.fromEntries(lines);
const directions = Array.from(rawDirections);
console.timeEnd('init');
console.time('part1');

// NOT WORKING AS V8 DOESN'T SEEMS TO CURRENTLY SUPPORT TAIL RECURSION OPTIMIZATION
// const countNodes = (nodes, nextDirections, current = 'AAA', count = 0) => {
// 	console.log(count);
// 	if (current === 'ZZZ') {
// 		return count;
// 	}
// 	const node = nodes[current];
// 	const [firstDirection, ...remainingDirections] = nextDirections;
//
// 	const newDirections = [...remainingDirections, firstDirection];
// 	const tmpNode = node[firstDirection];
// 	const newCount = count + 1;
//
// 	return countNodes(nodes, newDirections, tmpNode, newCount);
// };
//
// const distance = countNodes(nodesMap, Array.from(directions));

const countNodes = (nodes, directions) => {
	let current = 'AAA';
	let count = 0;
	let currentDirections = directions;
	while (current !== 'ZZZ') {
		const node = nodes[current];
		const [firstDirection, ...remainingDirections] = currentDirections;
		current = node[firstDirection];
		currentDirections = [...remainingDirections, firstDirection];
		++count;
	}

	return count;
};

const distance = countNodes(nodesMap, directions);

console.log(`We need to iterate over ${distance.toString().yellow} nodes.`);

console.timeEnd('part1');
console.time('part2');

const ghostKeys = Object.keys(nodesMap).filter((key) => key.endsWith('A'));

const ghostKeysCycles = ghostKeys.map((key) => {
	const advancementMap = {};
	let startKey = key;
	let count = 0;
	let cycleStart = null;
	while (!cycleStart) {
		if (!(startKey in advancementMap)) {
			advancementMap[startKey] = [];
		}
		advancementMap[startKey].push(count);
		startKey = nodesMap[startKey][directions[count % directions.length]];
		++count;
		if (startKey in advancementMap) {
			cycleStart = advancementMap[startKey].find(
				(index) => count % directions.length === index % directions.length,
			);
		}
	}

	const filteredAdvancementMap = Object.fromEntries(
		Object.entries(advancementMap).filter(([key]) => key.endsWith('Z')),
	);

	return {
		advancementMap: filteredAdvancementMap,
		expectedNumbers: Object.values(filteredAdvancementMap).flat(),
		maxCount: count,
		cycleStart,
	};
});

const [largestCycle, ...otherCycles] = ghostKeysCycles.toSorted(({ maxCount: a }, { maxCount: b }) => b - a);

let found = false;
let multiplier = 0;
let ghostEnd = 0;
while (!found) {
	for (const expectedNumber of largestCycle.expectedNumbers) {
		const cycleLength = largestCycle.maxCount - largestCycle.cycleStart;
		const newExpectedNumber = expectedNumber + cycleLength * multiplier;
		found = otherCycles.every(({ maxCount, cycleStart, expectedNumbers }) =>
			expectedNumbers.some(
				(otherNumber) =>
					(newExpectedNumber - cycleStart) % (maxCount - cycleStart) === otherNumber - cycleStart,
			),
		);
		if (found) {
			ghostEnd = newExpectedNumber;
			break;
		}
	}

	if (!found) {
		++multiplier;
	}
}

console.log(`The ghost will go through all Z after ${ghostEnd.toString().white}.`);

console.timeEnd('part2');
console.timeEnd('main');
