const limit: number[] = [350, 330, 310, 290, 270, 250, 225, 200, 150, 50];
const price: number[] = [500, 400, 300, 200, 100, 50, 20, 10, 5, 2];
interface Option {
	limits: number[];
	quantity: number;
	price: number;
}

const textInput: HTMLTextAreaElement = document.createElement("textarea");
textInput.addEventListener("keyup", calculate);

function calculate(event: KeyboardEvent) {
	const textLength: number = textInput.value.length;
	const options: Option[] = findOptions(textLength);
}

function findOptions(length: number, index: number = 0) {
	const results: Option[] = [];
	for (index; index < limit.length; index++) {
		let currentLength: number = length;
		const result: Option = {
			limits: [],
			quantity: 0,
			price: 0,
		};
		if (limit[index] < length) {
			result.limits.push(limit[index]);
			currentLength = currentLength - limit[index];
			let localIndex: number = index;
			for (localIndex; localIndex < limit.length; localIndex++) {
				currentLength = recursive(result, localIndex, currentLength);
			}
		} else {
			result.limits.push(limit[index]);
		}
		//calculate price and quantity here
		results.push(result);
	}
	return results;
}

function recursive(option: Option, index: number, length: number) {
	let currentLength: number = length;
	if (limit[index] < length) {
		option.limits.push(limit[index]);
		currentLength = currentLength - limit[index];
		let localIndex: number = index;
		for (localIndex; localIndex < limit.length; localIndex++) {
			currentLength = recursive(option, localIndex, currentLength);
		}
	} else {
		option.limits.push(limit[index]);
	}
	return currentLength;
}

// function permute(nums) {
// 	let result = [];
// 	if (nums.length === 0) return [];
// 	if (nums.length === 1) return [nums];
// 	for (let i = 0; i < nums.length; i++) {
// 		const currentNum = nums[i];
// 		const remainingNums = nums.slice(0, i).concat(nums.slice(i + 1));
// 		const remainingNumsPermuted = permute(remainingNums);
// 		for (let j = 0; j < remainingNumsPermuted.length; j++) {
// 			const permutedArray = [currentNum].concat(remainingNumsPermuted[j]);
// 			result.push(permutedArray);
// 		}
// 	}
// 	return result;
// }

// test code
findOptions(500);
