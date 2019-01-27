'use strict';
/****************************************************************************
 *
 *                      CREATE READ UPDATE DELETE
 *
 ***************************************************************************/
const createEntry = (mode = 'created') => {
	let word = $('#word_spell').value;
	let entry = replaceSpecialChars(word.toLowerCase());
	let translation = Array.from(setTranslation('#general input'));
	let example = $('#word_example').value;
	let type = setWordType();
	let forms = setWordForms(); 
	dictionary[entry] = {
		word: word,
		type: type,
		translation: translation,
		forms: forms,
		example: example
	};
	if ($('#adverb_true').checked) composeExtraEntry(entry, word);
	words = Object.getOwnPropertyNames(dictionary);
	updateDictionary(mode);
	showWordData(entry);
};

const readEntry = (word) => {
	let entry = replaceSpecialChars(word.toLowerCase());
	let read = {
		word: dictionary[entry]['word'],
		type: dictionary[entry]['type'],
		translation: dictionary[entry]['translation'],
		forms: dictionary[entry]['forms'],
		example: dictionary[entry]['example'],
	};
	if (dictionary[entry]['additional']) {
		let extraAdverb = entry + '_adv';
		read.extraTranslation = dictionary[extraAdverb]['translation'];
		read.extraExample = dictionary[extraAdverb]['example'];
	}
	return read;
};

const updateEntry = (word, currentEntry) => {
	let confirmation = confirm('Do you want to change this entry?');
	if (!confirmation) return false;
	if (word.toLowerCase() !== currentEntry.word.toLowerCase()) {
		let oldEntry = replaceSpecialChars(currentEntry.word.toLowerCase());
		let oldExtraAdverb = oldEntry + '_adv';
		eraseWords(oldEntry, oldExtraAdverb);
	}
	createEntry('changed');
	return true;
};

const deleteEntry = (word) => {
	let confirmation = confirm('Do you want to delete this entry?');
	if (!confirmation) return false;
	let entry = replaceSpecialChars(word.toLowerCase());
	let extraAdverb = entry + '_adv';
	eraseWords(entry, extraAdverb);
	words = Object.getOwnPropertyNames(dictionary);
	updateDictionary('deleted');
	showWordData('entfernen');
	return true;
};

const updateDictionary = (mode) => {
	let updateRequest = new Request(
		'dictionarytojson',
		{
			method: 'POST',
			headers: new Headers ({ 'Content-Type': 'application/json' }),
			body: JSON.stringify (dictionary)
		}
	);
	fetch (updateRequest).then(
		response => response.text(),
		() => console.log ('Oops... Something went wrong')
	).then(
		response => window.alert('The entry was '+mode+'. '+response)
	);	
};
/****************************************************************************
 *
 *                      GENERAL OPERATIONS AND HELPERS
 *
 ***************************************************************************/
const setTranslation = (sections) => {
	let translation = new Set();
	$$(sections).forEach(input => translation.add(input.value));
	return translation;
};

const setWordType = () => {
	let type;
	if ($('#noun_type').checked) type = 'noun';
	if ($('#verb_type').checked) type = 'verb';
	if ($('#adv_type').checked) type = 'adverb';
	if ($('#adj_type').checked) type = 'adjective';
	return type;
};

const setWordForms = () => {
	let forms;
	if ($('#noun_type').checked) forms = composeNounForms();
	if ($('#verb_type').checked) forms = composeVerbForms();
	if ($('#adv_type').checked) forms = [($('#word_spell').value)];
	if ($('#adj_type').checked) forms = composeAdjectiveForms();
	return forms;
};

const composeExtraEntry = (entry, word) => {
	let extraEntry = entry + '_adv';
	let extraTranslation = Array.from(setTranslation('#adverb input'));
	let extraForms = [$('#word_spell').value];
	let extraExample = $('#adv_word_example').value;
	dictionary[entry]['additional'] = true;
	dictionary[extraEntry] = {
		word: word,
		type: 'adverb',
		translation: extraTranslation,
		forms: extraForms,
		example: extraExample
	};
};

const composeNounForms = () => {
	let forms = [];
	$$('#__noun_forms input').forEach(input => forms.push(input.value));
	return forms;
};

const composeVerbForms = () => {
	let forms = [];
	const formPrefix = ['ich', 'du', 'es', 'ihr'];
	const formAddition = ['(h)', '(i)'];
	let currentForm;
	$$('#present_forms input').forEach((input, i, arr) => {
		currentForm = formPrefix[i] + ' ' + input.value;
		forms.push(currentForm);
	});
	forms.push(
		$('#sein_type').checked ? 
			$('#form_perfect').value + ' ' + formAddition[1]:
			$('#form_perfect').value + ' ' + formAddition[0]
	);
	return forms;
};

const composeAdjectiveForms = () => {
	let forms = [];
	$$('#__adjective_forms input[type=text]')
			.forEach(input => forms.push(input.value));
	return forms;
};

const eraseWords = (main, extra) => {
	delete dictionary[main];
	if (dictionary.hasOwnProperty(extra)) delete dictionary[extra];
	if (translated.has(main)) translated.delete(main);
	if (translated.has(extra)) translated.delete(extra);
};