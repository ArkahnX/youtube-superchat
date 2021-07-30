/* eslint-disable @typescript-eslint/typedef */
"use strict";

const limit = [350, 330, 310, 290, 270, 250, 225, 200, 150, 50];
const prices = [500, 400, 300, 200, 100, 50, 20, 10, 5, 2];

// https://stackoverflow.com/questions/53659151/return-all-subsets-whose-sum-is-a-given-value-subset-sum-problem
document.addEventListener("DOMContentLoaded", function () {
	const textInput = document.createElement("span");
	textInput.setAttribute("class", "textarea");
	textInput.setAttribute("id", "textinput");
	textInput.setAttribute("maxlength", "1000");
	textInput.setAttribute("contenteditable", "true");
	textInput.innerText = "This is a sample superchat message! Lorem Ipsum... This will appear in a new $2 superchat.";
	const textData = document.createElement("div");
	textData.setAttribute("id", "textdata");
	const superChatValues = document.getElementById("superchatvalues");
	const superchattextbox = document.getElementById("superchattextbox");
	const mainElement = document.getElementById("main");
	textInput.addEventListener("keyup", calculate);

	// superChatSelect.addEventListener("change", calculate);
	for (const [key, value] of prices.entries()) {
		const optionElement = document.createElement("input");
		const superchatElement = document.createElement("div");
		const spanElement = document.createElement("span");
		const labelElement = document.createElement("label");
		const inputElement = document.createElement("input");
		labelElement.innerText = `$${value}`;
		spanElement.appendChild(labelElement);
		labelElement.appendChild(inputElement);
		inputElement.setAttribute("id", `sc_${key}`);
		superchatElement.setAttribute("data-superchat-id", `${key}`);
		superchatElement.setAttribute("class", `${superchatTier(key)} superchat-card`);
		spanElement.setAttribute("class", `contents`);
		inputElement.setAttribute("value", `${value}`);
		inputElement.setAttribute("type", "text");
		optionElement.setAttribute("value", `${key}`);
		optionElement.setAttribute("checked", "true");
		optionElement.setAttribute("id", `sco_${key}`);
		optionElement.setAttribute("type", "checkbox");
		optionElement.addEventListener("change", calculate);
		spanElement.appendChild(optionElement);
		superchatElement.appendChild(spanElement);
		if (superChatValues) {
			superChatValues.appendChild(superchatElement);
		}
	}
	if (superchattextbox && mainElement) {
		superchattextbox.appendChild(textInput);
		mainElement.appendChild(textData);
	}
});
let timer = -1;

function toggleSuperchatColors() {
	const superChatValues = document.getElementById("superchatvalues");
	if (superChatValues) {
		for (let index = 0; index < superChatValues?.children.length; index++) {
			const element = superChatValues?.children[index];
			// console.log(
			// 	element,
			// 	element.children[0].children[1],
			// 	superchatTier(element.dataset.superchatId),
			// 	element.dataset.superchatId,
			// );
			const option: HTMLInputElement = element.children[0].children[1] as HTMLInputElement;
			const superChatId: string | null = element.getAttribute("data-superchat-id");
			let superChatTier: string = "";
			if (typeof superChatId === "string") {
				superChatTier = superchatTier(parseInt(superChatId, 10));
			}
			if (option.checked === false) {
				element.classList.remove(superChatTier);
				element.classList.add("none");
			} else {
				element.classList.add(superChatTier);
				element.classList.remove("none");
			}
		}
	}
}

function calculate() {
	clearTimeout(timer);
	toggleSuperchatColors();
	const textInput = document.getElementById("textinput");
	const textdata = document.getElementById("textdata");
	if (textInput && textdata) {
		timer = window.setTimeout(function () {
			const values = getSelectedSuperchatOptions();
			const textLength = textInput.innerText.length;
			// console.log(textLength);
			const options = getSubsets(values, textLength);
			const fragment = document.createDocumentFragment();
			for (const option of options) {
				let remainingText = textInput.innerText;
				let price = 0;
				fragment.appendChild(document.createElement("hr"));
				const superchatElement = document.createElement("div");
				const superchatHeaderElement = document.createElement("div");
				const superChatStatsElement = document.createElement("div");
				superchatElement.setAttribute("class", `none superchat-card`);
				superchatHeaderElement.setAttribute("class", `header`);
				superChatStatsElement.setAttribute("class", `contents`);
				superchatHeaderElement.innerText = `Stats`;
				superchatElement.appendChild(superchatHeaderElement);
				superchatElement.appendChild(superChatStatsElement);
				fragment.appendChild(superchatElement);
				for (const index of option) {
					const characterLimit = limit[index];
					const superchatvalue: HTMLInputElement = document.getElementById(`sc_${index}`) as HTMLInputElement;
					if (superchatvalue) {
						const dollarValue = superchatvalue.value;
						const message = remainingText.match(new RegExp(`(.|[\r\n]){1,${characterLimit}}`, "g"));
						if (message && message[0]) {
							const superchatElement = document.createElement("div");
							const superchatHeaderElement = document.createElement("div");
							const preElement = document.createElement("div");
							superchatElement.setAttribute("class", `${superchatTier(index)} superchat-card`);
							superchatHeaderElement.setAttribute("class", `header`);
							preElement.setAttribute("class", `contents`);
							superchatHeaderElement.innerText = `$${dollarValue} \t (${message[0].length}/${limit[index]})`;
							preElement.innerText = message[0];
							superchatElement.appendChild(superchatHeaderElement);
							superchatElement.appendChild(preElement);
							fragment.appendChild(superchatElement);
							message[0] = "";
							remainingText = message.join("");
							price += prices[index];
						}
					}
				}
				superChatStatsElement.innerText = `Cost: ${price}, Characters: ${textInput.innerText.length}`;
			}
			textdata.innerText = "";
			textdata.appendChild(fragment);
			// textData.innerText = textLength + "\n" + JSON.stringify(options, null, "\t");
		}, 300);
	}
}

function superchatTier(index: number | undefined) {
	if (!index) {
		return "none";
	}
	if (index < 5) {
		return "aka";
	}
	if (index === 5) {
		return "fifty";
	}
	if (index === 6) {
		return "twenty";
	}
	if (index === 7) {
		return "ten";
	}
	if (index === 8) {
		return "five";
	}
	if (index === 9) {
		return "two";
	}
	return "none";
}

function getSelectedSuperchatOptions() {
	const values = [];
	for (const [key] of prices.entries()) {
		const superchatCheckbox: HTMLInputElement = document.getElementById(`sco_${key}`) as HTMLInputElement;
		if (superchatCheckbox) {
			if (superchatCheckbox.checked) {
				values.push(limit[key]);
			}
		}
	}
	// console.log(values);
	return values;
}

// add termination condition, if s > 0?

function getSubsets(array: number[], sum: number) {
	function fork(index = 0, s = 0, temp: number[] = []) {
		if (s >= sum) {
			// console.log(1, s, sum);
			result.push(temp);
			// console.log("1");
			// fork(index + 1, s, temp);
			return;
		}
		if (index === array.length) {
			// console.log(2, index, array.length);
			// console.log("2");
			return;
		}
		if (s + array[index] <= sum) {
			// shout circuit for positive numbers only
			// console.log(3, s, array[index], sum);
			// console.log("3");
			// fork(index + 1, s + array[index], temp.concat(array[index]));
			fork(index, s + array[index], temp.concat(limit.indexOf(array[index])));
		}
		if (s + array[index] >= sum) {
			// console.log(4, s, array[index], sum);
			// console.log("4");
			result.push(temp.concat(limit.indexOf(array[index])));
			fork(index + 1, s, temp);
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
		// console.log(6, index + 1, s, temp);
		// console.log("5");
		fork(index + 1, s, temp);
	}
	const result: number[][] = [];
	fork();
	// console.log(result);
	return result;
}

// console.log(getSubsets(limit, 51));
calculate();