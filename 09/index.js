import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import 'colors';

console.time('main');
console.time('init');
const rows = fs
	.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'input'), {
		encoding: 'utf-8',
	})
	.trim()
	.split('\n')
	.map((line) =>
		line
			.trim()
			.split(' ')
			.map((val) => +val.trim()),
	);

const computeFollowingRows = (rows) => {
	const lastRow = rows[rows.length - 1];
	if (lastRow.every((value) => value === 0)) {
		return rows;
	}

	return computeFollowingRows([
		...rows,
		lastRow.reduce(
			(newRow, value, index, currentRow) => (index <= 0 ? newRow : [...newRow, value - currentRow[index - 1]]),
			[],
		),
	]);
};

const fullRows = rows.map((row) => computeFollowingRows([row]));

console.timeEnd('init');
console.time('part1');

const computeMissingNumber = (rows, start = true, index = rows.length - 1) => {
	const row = Array.from(rows[index]);
	if (start) {
		row.push(0);
	} else {
		const previousRow = rows[index + 1]; // ?
		row.push(row[row.length - 1] + previousRow[previousRow.length - 1]);
	}

	if (index <= 0) {
		return row[row.length - 1];
	}

	return computeMissingNumber(rows.with(index, row), false, index - 1);
};

const missingNumbers = fullRows.map((rows) => computeMissingNumber(rows)); // ?
const sum = missingNumbers.reduce((acc, val) => acc + val);
console.log(`The sum of missing numbers is ${sum.toString().yellow}.`);

console.timeEnd('part1');
console.time('part2');

const computeMissingStartNumber = (rows, start = true, index = rows.length - 1) => {
	const row = Array.from(rows[index]);
	if (start) {
		row.unshift(0);
	} else {
		const previousRow = rows[index + 1]; // ?
		row.unshift(row[0] - previousRow[0]);
	}

	if (index <= 0) {
		return row[0];
	}

	return computeMissingStartNumber(rows.with(index, row), false, index - 1);
};

const missingNumbersStart = fullRows.map((rows) => computeMissingStartNumber(rows)); // ?
const startSum = missingNumbersStart.reduce((acc, val) => acc + val);

console.log(`The sum of missing numbers at the beginning is ${startSum.toString().green} !`);

console.timeEnd('part2');
console.timeEnd('main');
