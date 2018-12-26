// Delete surrouding spaces
async function removeSpaces(text){
	// Remove front spaces
	let i = 0;
	while (text[i] == ' '){
		i++;
	}
	
	// Remove trailing spaces
	let k = text.length-1;
	while (text[k] == ' '){
		k--;
	}
	return text.substring(i, k+1);
}