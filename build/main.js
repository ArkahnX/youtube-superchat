"use strict";
const limit = [350, 330, 310, 290, 270, 250, 225, 200, 150, 50];
const prices = [500, 400, 300, 200, 100, 50, 20, 10, 5, 2];
limit.reverse();
prices.reverse();
document.addEventListener("DOMContentLoaded", function () {
    const textInput = document.createElement("textarea");
    textInput.setAttribute("class", "textarea");
    textInput.setAttribute("id", "textinput");
    textInput.setAttribute("maxlength", "10000");
    const fancyText = [
        "What changed, Nov 25th edition",
        "improved layout for small screens, added a button to copy superchat text",
    ];
    textInput.innerHTML = fancyText.join("|");
    const textData = document.createElement("div");
    textData.setAttribute("id", "textdata");
    const superChatValues = document.getElementById("superchatvalues");
    const superchattextbox = document.getElementById("superchattextbox");
    const mainElement = document.getElementById("main");
    textInput.addEventListener("keyup", calculate);
    mainElement?.addEventListener("mousedown", listenForCopy);
    for (const [key, value] of prices.entries()) {
        const optionElement = document.createElement("input");
        const optionElementUI = document.createElement("span");
        const superchatElement = document.createElement("div");
        const spanElement = document.createElement("span");
        const labelElement = document.createElement("label");
        const inputElement = document.createElement("input");
        labelElement.innerText = `$`;
        spanElement.appendChild(labelElement);
        spanElement.appendChild(inputElement);
        inputElement.setAttribute("id", `sc_${key}`);
        superchatElement.setAttribute("data-superchat-id", `${key}`);
        superchatElement.setAttribute("class", `${superchatTier(key)} superchat-card`);
        labelElement.setAttribute("class", `container`);
        spanElement.setAttribute("class", `contents`);
        inputElement.setAttribute("value", `${value}`);
        inputElement.setAttribute("type", "text");
        optionElement.setAttribute("value", `${key}`);
        optionElement.setAttribute("checked", "true");
        optionElement.setAttribute("id", `sco_${key}`);
        optionElement.setAttribute("type", "checkbox");
        optionElementUI.setAttribute("class", "checkmark");
        optionElement.addEventListener("change", calculate);
        inputElement.addEventListener("keyup", calculate);
        labelElement.appendChild(optionElement);
        labelElement.appendChild(optionElementUI);
        superchatElement.appendChild(spanElement);
        if (superChatValues) {
            superChatValues.appendChild(superchatElement);
        }
    }
    if (superchattextbox && mainElement) {
        superchattextbox.appendChild(textInput);
        mainElement.appendChild(textData);
    }
    calculate();
    window.requestAnimationFrame(getSuperChatStats);
});
let timer = -1;
async function listenForCopy(event) {
    if (event.target instanceof Element && event.target.className.includes("copy")) {
        const target = event.target;
        const parentNode = target.parentNode?.parentNode;
        const contentNode = parentNode.querySelector(".contents");
        if (contentNode) {
            console.log(typeof contentNode.innerText, contentNode.innerText);
            await copyTextToClipboard(contentNode.innerText);
            target.innerText = "Copied!";
        }
    }
}
function toggleSuperchatColors() {
    const superChatValues = document.getElementById("superchatvalues");
    if (superChatValues) {
        for (let index = 0; index < superChatValues?.children.length; index++) {
            const element = superChatValues?.children[index];
            const option = element.children[0].children[0].children[0];
            const superChatId = element.getAttribute("data-superchat-id");
            let superChatTier = "";
            if (typeof superChatId === "string") {
                superChatTier = superchatTier(parseInt(superChatId, 10));
            }
            if (option.checked === false) {
                element.classList.remove(superChatTier);
                element.classList.add("none");
            }
            else {
                element.classList.add(superChatTier);
                element.classList.remove("none");
            }
        }
    }
}
function getSuperChatStats() {
    const textInput = document.getElementById("textinput");
    const superStats = document.getElementById("superstats");
    if (textInput && superStats) {
        const cursorPosition = textInput.selectionStart;
        const splitString = stripNewLines(textInput.value).split("|");
        let index = 0;
        for (const string of splitString) {
            if (cursorPosition >= index && cursorPosition <= index + string.length) {
                const SCLength = string.length;
                const SCLimitKey = findSuperchatLimitKey(SCLength);
                let warning = "";
                const superchatvalue = document.getElementById(`sc_${SCLimitKey}`);
                if (superchatvalue) {
                    const SCLimit = limit[SCLimitKey];
                    if (SCLength > SCLimit) {
                        warning = "Superchat is too long! Consider splitting it with |";
                    }
                    superStats.innerText = `Cost: $${superchatvalue.value}
					Characters: ${SCLength}/${SCLimit}
					${warning}`;
                }
                window.requestAnimationFrame(getSuperChatStats);
                return true;
            }
            else {
                index += string.length + 1;
            }
        }
    }
    window.requestAnimationFrame(getSuperChatStats);
}
function calculate() {
    clearTimeout(timer);
    toggleSuperchatColors();
    const textInput = document.getElementById("textinput");
    const textdata = document.getElementById("textdata");
    if (textInput && textdata) {
        if (textInput.innerText.length > 0) {
            getSuperChatStats();
        }
        timer = window.setTimeout(function () {
            const values = getSelectedSuperchatOptions();
            const fragment = document.createDocumentFragment();
            const split = stripNewLines(textInput.value).split("|");
            let price = 0;
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
            let SCIndex = 0;
            const fancyText = [];
            for (const splitText of split) {
                fancyText.push(`${splitText}`);
                const options = getSubsets(values, splitText.length);
                for (const option of options) {
                    for (const index of option) {
                        SCIndex++;
                        let remainingText = splitText;
                        const characterLimit = limit[index];
                        const superchatvalue = document.getElementById(`sc_${index}`);
                        if (superchatvalue) {
                            const dollarValue = superchatvalue.value;
                            let message = [];
                            if (remainingText.indexOf("|") <= characterLimit && remainingText.indexOf("|") > -1) {
                                message = [
                                    remainingText.slice(0, remainingText.indexOf("|")).trim(),
                                    remainingText.slice(1 + remainingText.indexOf("|")).trim(),
                                ];
                            }
                            else {
                                message = remainingText.match(new RegExp(`(.){1,${characterLimit}}`, "g"));
                            }
                            if (message && message[0]) {
                                const superchatElement = document.createElement("div");
                                const superchatHeaderElement = document.createElement("div");
                                const superchatHeaderLeftElement = document.createElement("span");
                                const superchatHeaderRightElement = document.createElement("span");
                                const preElement = document.createElement("div");
                                superchatElement.setAttribute("class", `${superchatTier(index)} superchat-card`);
                                superchatHeaderElement.setAttribute("class", `header`);
                                superchatHeaderLeftElement.setAttribute("class", `left`);
                                superchatHeaderRightElement.setAttribute("class", `right copy`);
                                preElement.setAttribute("class", `contents`);
                                superchatHeaderLeftElement.innerText = `#${SCIndex} (${message[0].length}/${limit[index]})`;
                                superchatHeaderRightElement.innerText = `Copy`;
                                superchatHeaderElement.innerText = `$${dollarValue}`;
                                preElement.innerText = message[0];
                                superchatHeaderElement.appendChild(superchatHeaderLeftElement);
                                superchatHeaderElement.appendChild(superchatHeaderRightElement);
                                superchatElement.appendChild(superchatHeaderElement);
                                superchatElement.appendChild(preElement);
                                fragment.appendChild(superchatElement);
                                message[0] = "";
                                remainingText = message.join("");
                                price += parseInt(dollarValue, 10);
                            }
                        }
                    }
                }
                superChatStatsElement.innerText = `Cost: $${price}, Characters: ${stripNewLines(textInput.value).length}`;
            }
            textdata.innerText = "";
            textdata.appendChild(fragment);
        }, 300);
    }
}
function stripNewLines(string) {
    return string.replace(/\r?\n/g, "");
}
function findSuperchatLimitKey(length) {
    const values = getSelectedSuperchatOptions();
    for (const value of values) {
        if (length < value) {
            return limit.indexOf(value);
        }
    }
    return limit.indexOf(values[values.length - 1]);
}
function superchatTier(index) {
    if (typeof index !== "number") {
        return "none";
    }
    if (index > 4) {
        return "aka";
    }
    if (index === 4) {
        return "fifty";
    }
    if (index === 3) {
        return "twenty";
    }
    if (index === 2) {
        return "ten";
    }
    if (index === 1) {
        return "five";
    }
    if (index === 0) {
        return "two";
    }
    return "none";
}
function getSelectedSuperchatOptions() {
    const values = [];
    for (const [key] of prices.entries()) {
        const superchatCheckbox = document.getElementById(`sco_${key}`);
        if (superchatCheckbox) {
            if (superchatCheckbox.checked) {
                values.push(limit[key]);
            }
        }
    }
    return values;
}
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand("copy");
        const msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);
    }
    catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log("Async: Copying to clipboard was successful!");
    }, function (err) {
        console.error("Async: Could not copy text: ", err);
    });
}
function getSubsets(array, sum) {
    function fork(index = 0, s = 0, temp = []) {
        if (s === sum) {
            result.push(temp);
            return;
        }
        if (index === array.length) {
            return;
        }
        if (s + array[index] >= sum) {
            result.push(temp.concat(limit.indexOf(array[index])));
            return;
        }
        fork(index + 1, s, temp);
    }
    const result = [];
    fork();
    return result;
}
//# sourceMappingURL=main.js.map