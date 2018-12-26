// Italics/Bold
function checkForInnerFormatting(text){
	let reg = /\**\*[^*]*\**/g;
	let startIndex = 0;
	let lastLength = 0;
	let styleArr = [];
	let textArr = [];

	// Create an array of styled sections
	while((match = reg.exec(text)) != null){
		if (match[0].length > 2){
			
			// Add plaintext
			textArr.push(text.substring(startIndex, match.index));
			styleArr.push('p');
			startIndex = match.index + match[0].length;

			// Add styled text
			let styledText = text.substring(startIndex, match.index);
			let lnth = styledText.length;

			// Bold
			if (match[0].length > 4){
				if (styledText[0] == '*' && styledText[1] == '*' && styledText[lnth-2] == '*' && styledText[lnth-1] == '*'){
					textArr.push(styledText.substring(2, lnth-2));
					styleArr.push('strong');
				}
			}
			// Italics
			else {
				if (styledText[0] == '*' && styledText[lnth-1] == '*'){
					textArr.push(styledText.substring(1, lnth-1));
					styleArr.push('em');
				}

			}
		}
		
	}

	// Check for ending 
	textArr.push(text.substring(startIndex));
	styleArr.push('p');
	addElements(textArr, styleArr);

}

// Create line of various styled text
function addElements(texts = [], styles = []){
	let parent = document.createElement('p');
	for (let i = 0; i < texts.length; i++){
		// No style
		if (styles[i] == 'p'){
			parent.innerHTML += texts[i];
		}
		// Style
		else {
			let child = document.createElement(styles[i]);
			child.innerHTML = texts[i];
			parent.appendChild(child);
		}	
	}
	document.getElementById('display').appendChild(parent);
}

// Display markdown text
function addElement(text = '', style = ''){
	if (text.length != 0){
		// Styled text
		if (style.length != 0){
			var element = document.createElement(style);
			element.innerHTML = text;
		}
		// Normal text
		else {
			var element = document.createElement('p');
			element.innerHTML = text;
		}
		document.getElementById('display').appendChild(element);
	}
}

// Put consecutive elements into a list
let checkForList = (textArr, text, index) => {
	return new Promise ((resolve, reject) => {
		let newList = [];
		// Check consecutive
		for (var i = index; i < textArr.length; i++){
			let spaceIndex = textArr[i].indexOf(' ');
			let symbol = textArr[i].substring(0, spaceIndex);

			// Add to list array
			if (symbol == '*' || symbol == '-'){
				let text = textArr[i].substring(spaceIndex, textArr[i].length);
				newList.push(text);
			}
			else {
				break;
			}
		}
		addList(newList);
		resolve(i-1);
		
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
		textArr[line] = await removeSpaces(textArr[line]);
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
			default: checkForInnerFormatting(textArr[line]);
		}
		
	}
}

// Main callback
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
			i--;
		}
		// Execute at end of loop
		if (i == parsedText.length - 1){
			parseMarkdown(parsedText);
		}
	}
}