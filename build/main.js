/* eslint-disable @typescript-eslint/typedef */
"use strict";

const limit = [350, 330, 310, 290, 270, 250, 225, 200, 150, 50];
limit.reverse();
const price = [500, 400, 300, 200, 100, 50, 20, 10, 5, 2];
price.reverse();

// https://stackoverflow.com/questions/53659151/return-all-subsets-whose-sum-is-a-given-value-subset-sum-problem

const textInput = document.createElement("textarea");
const textData = document.createElement("pre");
textInput.addEventListener("keyup", calculate);
document.getElementById("main").appendChild(textInput);
document.getElementById("main").appendChild(textData);
let timer = -1;
function calculate(event) {
	clearTimeout(timer);
	timer = setTimeout(function () {
		const textLength = textInput.value.length;
		const options = getSubsets(limit, textLength);
		textData.innerText = textLength + "\n" + JSON.stringify(options, null, "\t");
	}, 300);
}
// function findOptions(length, index = 0) {
// 	const results = [];
// 	for (index; index < limit.length; index++) {
// 		let currentLength = length;
// 		const result = {
// 			limits: [],
// 			quantity: 0,
// 			price: 0,
// 		};
// 		console.log(limit[index], length);
// 		if (limit[index] < length) {
// 			result.limits.push(limit[index]);
// 			currentLength = currentLength - limit[index];
// 			let localIndex = index;
// 			for (localIndex; localIndex < limit.length; localIndex++) {
// 				if (currentLength > 0) {
// 					currentLength = recursive(result, localIndex, currentLength);
// 				}
// 			}
// 		} else {
// 			result.limits.push(limit[index]);
// 			currentLength = currentLength - limit[index];
// 		}
// 		console.log(result);
// 		results.push(result);
// 	}
// 	return results;
// }

// function findOption(length) {
// 	// const fit = [];
// 	const options = {};
// 	for (const item of limit) {
// 		const option = [item];
// 		const recursiveOption = [];
// 		// fit.push(Math.ceil(length / item));
// 		if (Math.ceil(length / item) > 1) {
// 			// console.log(item, limit, recursiveOption);
// 			recursive(length - item, recursiveOption);
// 		}
// 		console.log(item, option, recursiveOption);
// 		console.log(JSON.stringify(options, null, "\t"));
// 		// options[item] = [].concat(option, recursiveOption);
// 	}
// 	return options;
// }

// function recursive(length, array) {
// 	console.log(length, array);
// 	for (const [key, value] of limit.entries()) {
// 		const option = [value];
// 		// fit.push(Math.ceil(length / item));
// 		if (length > 0 && Math.ceil(length / value) > 1) {
// 			option.push(value);
// 			recursive(length - value, option);
// 		} else {
// 			// console.log(option);
// 			option.push(value);
// 		}
// 		// console.log(length, item, option);
// 		// console.log(array);
// 		array.push(option);
// 	}
// }

// function count(textLength, containerLength) {}

// function recursive(option, index, length) {
// 	let currentLength = length;
// 	console.log(index, length, limit[index]);
// 	if (limit[index] < length) {
// 		option.limits.push(limit[index]);
// 		currentLength = currentLength - limit[index];
// 		let localIndex = index;
// 		for (localIndex; localIndex < limit.length; localIndex++) {
// 			if (currentLength > 0) {
// 				currentLength = recursive(option, localIndex, currentLength);
// 			}
// 		}
// 	} else {
// 		option.limits.push(limit[index]);
// 		currentLength = currentLength - limit[index];
// 	}
// 	return currentLength;
// }
// console.log(findOption(500));
//# sourceMappingURL=main.js.map

function getSubsets(array, sum) {
	function fork(index = 0, s = 0, temp = []) {
		if (s === sum) {
			console.log(1, s, sum);
			result.push(temp);
			return;
		}
		if (index === array.length) {
			console.log(2, index, array.length);
			return;
		}
		if (s + array[index] <= sum) {
			// shout circuit for positive numbers only
			console.log(3, s, array[index], sum);
			// fork(index + 1, s + array[index], temp.concat(array[index]));
			fork(index, s + array[index], temp.concat(array[index]));
		}
		if (s + array[index] >= sum) {
			console.log(4, s, array[index], sum);
			result.push(temp.concat(array[index]));
			return;
		}
		// if (array[index] + array[index] >= sum) {
		// 	console.log(5, array[index], array[index], sum);
		// 	result.push(temp.concat(array[index], array[index]));
		// 	return;
		// }
		// if (s + array[index] >= sum) {
		// 	// shout circuit for positive numbers only
		// 	console.log(4, s, array[index], sum);

		// 	result.push(temp.concat(array[index + 1]));
		// 	return;
		// }
		console.log(6, index + 1, s, temp);
		fork(index + 1, s, temp);
	}
	var result = [];
	fork();
	return result;
}

// console.log(getSubsets(limit, 35));
