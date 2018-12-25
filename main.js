// Display markdown text
function addElement(text = '', style = ''){
	if (text.length != 0){
		if (style.length != 0){
			var element = document.createElement(style);
			element.innerHTML = text;
		}
		else {
			var element = document.createElement('p');
			element.innerHTML = text;
		}
		document.getElementById('display').appendChild(element);
	}
}

// Check for list
let checkForList = (textArr, text, index) => {
	return new Promise ((resolve, reject) => {
		let newList = [];
		for (var i = index; i < textArr.length; i++){
			let spaceIndex = textArr[i].indexOf(' ');
			let symbol = textArr[i].substring(0, spaceIndex);
			if (symbol == '*' || symbol == '-'){
				let text = textArr[i].substring(spaceIndex, textArr[i].length);
				newList.push(text);
			}
			else {
				addList(newList);
				resolve(i);
			}
		}
		// Add list and send new index
		/*if (i >= textArr.length -1){
			addList(newList);
			resolve(i);
		}*/
	});
}

// Display markdown list
function addList(textArr){
	let ul = document.createElement('ul');
	for (let i = 0; i < textArr.length; i++){
		let li = document.createElement('li');
		li.innerHTML = textArr[i];
		ul.appendChild(li);
	}
	document.getElementById('display').appendChild(ul);
}

// Parse by line
async function parseMarkdown(textArr){
	for (let line = 0; line < textArr.length; line++){
		let spaceIndex = textArr[line].indexOf(' ');
		let symbol = textArr[line].substring(0, spaceIndex);
		let text = textArr[line].substring(spaceIndex, textArr[line].length);

		switch(symbol){
			case '#': addElement(text, 'h1'); break;
			case '##': addElement(text, 'h2'); break;
			case '###': addElement(text, 'h3'); break;
			case '####': addElement(text, 'h4'); break;
			case '#####': addElement(text, 'h5'); break;
			case '######': addElement(text, 'h6'); break;
			case '*':
			case '-': await checkForList(textArr, text, line).then(index => line = index);
				break;
			default: addElement(text);
		}
		
	}
}

function updateMarkdown(){
	// Clear old output
	document.getElementById('display').innerHTML = "";

	// Get input
	let text = document.getElementById('textArea').value;
	let parsedText = text.split('\n');

	// Remove blanks
	for (let i = 0; i < parsedText.length; i++){
		if (parsedText[i].length == 0){
			parsedText.splice(i, 1);
		}
		// Execute at end of loop
		if (i == parsedText.length - 2){
			console.log(parsedText);
			parseMarkdown(parsedText);
		}
	}
}