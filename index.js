import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

if (process.argv.length < 3) {
	console.error(`Please call this script with the number of the day you want to run, like :\nnode index.js 01`);
	process.exit(1);
}

const arg = +process.argv[2];
if (Number.isNaN(arg)) {
	console.error('Please type a valid number for the day you want to run.');
	process.exit(2);
}

const paddedNumber = String(arg).padStart(2, '0');
const directoryPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), paddedNumber);
try {
	fs.accessSync(directoryPath, fs.constants.X_OK | fs.constants.R_OK);
} catch (e) {
	console.error(`The day ${arg} does not exist, or the directory is not readable.`, e);
	process.exit(3);
}

const scriptPath = path.resolve(directoryPath, 'index.js');
try {
	fs.accessSync(scriptPath, fs.constants.R_OK);
} catch (e) {
	console.error(`The script for the day ${arg} does not exist, or is not readable.`, e);
	process.exit(4);
}

const inputPath = path.resolve(directoryPath, 'input');
try {
	fs.accessSync(scriptPath, fs.constants.R_OK);
} catch (e) {
	console.error(`The input for the day ${arg} does not exist, or is not readable. Please put it in ${inputPath}.`);
	process.exit(5);
}

await import(`./${paddedNumber}/index.js`);
