/**
 * Appends ".js" to module imports that do not end with ".js".
 *
 * Reformatted & inspired from the following script
 * https://github.com/microsoft/TypeScript/issues/16577#issuecomment-310426634
 * by https://github.com/quantuminformation
 *
 * Author: Artur Madjidov
 * License: MIT
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { argv } = require("process");

if (!argv[2]) {
	throw new Error("No directory or file given");
}

const filePaths = [];

function check(filepath) {
	let givenPath = path.resolve(filepath);
	let fileStats = fs.lstatSync(givenPath);
	if (fileStats.isFile()) {
		if (filePaths.includes(givenPath) === false) {
			filePaths.push(givenPath);
		}
	} else if (fileStats.isDirectory()) {
		const directoryContents = fs.readdirSync(givenPath);
		for (const file of directoryContents) {
			check(path.resolve(givenPath, file));
		}
	} else {
		throw new Error("Unsupported file type");
	}
}

check(argv[2]);

filePaths.forEach((filepath) => {
	fs.readFile(filepath, "utf8", (err, data) => {
		if (err) {
			throw err;
		}
		if (filepath.includes(".json")) {
			try {
				// console.log(filepath, typeof data, JSON.parse(data));
				var value = typeof data === "string" ? JSON.parse(data) : data;

				value = JSON.stringify(value)
					.replace(/\u2028/g, "\\u2028")
					.replace(/\u2029/g, "\\u2029");

				const result = `export default ${value}`;
				console.log(`Converted ${filepath} to a JS module.`);
				fs.writeFileSync(filepath + ".js", result);
			} catch (e) {
				// console.log(filepath, e);
			}
		}
		if (!data.match(/import .* from/g)) {
			return;
		}

		let newData = data.replace(/(import .* from\s+['"])([^'"]*)(?<!\.js)(?=['"])/g, "$1$2.js");

		console.log(`Appending '.js' extensions to imports inside of ${filepath}`);
		fs.writeFileSync(filepath, newData);
	});
});
