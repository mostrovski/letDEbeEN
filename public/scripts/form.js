'use strict';
/****************************************************************************
 *
 *                      FORM LOGIC AND EVENTS
 *
 ***************************************************************************/
const setFormEvents = () => {
	let action;
	let entry;
	const MAIN_SECTIONS = [
		$('#__general_details'),
		$('#__word_type'),
		$('#__manage-buttons')
	];
	const WORD_FORMS = [
		$('#__noun_forms'), 
		$('#__verb_forms'), 
		$('#__adjective_forms'), 
		$('#__additional_adverb')
	];	
	
	$('#__choose_action').onchange = () => {
		if ($('#create_type').checked) {
			action = 'create';
			resetFlexible();
			openSections(...MAIN_SECTIONS);
			hideSections($('#__update'), $('#__delete'), ...WORD_FORMS);
		} else if ($('#update_type').checked) {
			action = 'update';
			openSections($('#__update'));
			hideSections(...MAIN_SECTIONS, ...WORD_FORMS, $('#__delete'));	
		} else if ($('#delete_type').checked) {
			action = 'delete';
			openSections($('#__delete'));
			hideSections(...MAIN_SECTIONS, ...WORD_FORMS, $('#__update'));	
		}	
	};
	
	$('#word_spell').oninput = () => {
		if (action === 'create') {
			validateWordSpelling($$('#word_spell'));	
		}
	};

	$('#field_plus').onclick = () => addTranslationField('#general');
	$('#adv_field_plus').onclick = () => addTranslationField('#adverb');
	$('#field_minus').onclick = () => removeTranslationField('#general');
	$('#adv_field_minus').onclick = () => removeTranslationField('#adverb');

	$('#__choose_type').onclick = () => {
		if (action === 'create') {
			if ($('#noun_type').checked) 
				showTargetSection($('#__noun_forms'), WORD_FORMS);
			if ($('#verb_type').checked)
				showTargetSection($('#__verb_forms'), WORD_FORMS);
			if ($('#adj_type').checked) {
				$$('#add_adverb input')
					.forEach(radio => radio.checked = false);
				showTargetSection($('#__adjective_forms'), WORD_FORMS);
			}
			if ($('#adv_type').checked)
				hideSections(...WORD_FORMS);
		}
	};

	$('#add_adverb').onclick = () => {
		if ($('#adverb_true').checked) 
			openSections($('#__additional_adverb'));
		if ($('#adverb_false').checked) 
			hideSections($('#__additional_adverb'));
	};
	
	$('#entry_update').onclick = () => {
		if (validateWordSpelling($$('#word_upd'))) {
			resetFlexible();
			entry = readEntry($('#word_upd').value);
			setFormSections(entry, WORD_FORMS);
			fillOutForm(entry);
		}
	};

	$('#entry_delete').onclick = () => {
		if (validateWordSpelling($$('#word_del'))) {
			let deleted = deleteEntry($('#word_del').value);
			if (deleted) $('#clear_form').click();
		}
	};

	$('#clear_form').onclick = () => {
		hideSections(
			...WORD_FORMS, 
			...MAIN_SECTIONS, 
			$('#__update'), 
			$('#__delete')
		);
	};
	
	$('#save_changes').onclick = () => {
		if (validateAll(action, entry)) {
			if (action === 'create') {
				createEntry(); 
				$('#clear_form').click();
			} 
			if (action === 'update') {
				let updated = updateEntry($('#word_spell').value, entry);
				if (updated) $('#clear_form').click();
			} 
		}
	};
};
/****************************************************************************
 *
 *                      GENERAL OPERATIONS AND HELPERS
 *
 ***************************************************************************/
const resetFlexible = () => {
	$$('#entry_data input[type=text], textarea')
		.forEach(element => element.value = '');
	$$('#entry_data input[type=radio]')
		.forEach(radio => radio.checked = false);
	resetTranslationFields('#general input', '#general');
	resetTranslationFields('#adverb input', '#adverb');
};

const resetTranslationFields = (sections, target) => {
	while ($$(sections).length > 1) {
		removeTranslationField(target);
	}
};

const setFormSections = (entry, sections) => {
	$(setType(entry)).checked = true;
	if (entry.type !== 'adverb') {
		let forms = '#__' + entry.type + '_forms';
		showTargetSection($(forms), sections);
	} else {
		hideSections(...sections);
	}
	if (entry.hasOwnProperty('extraTranslation')) {
		openSections($('#__additional_adverb'));
		$('#adverb_true').checked = true;
	} else {
		$('#adverb_false').checked = true;
	}
	openSections(
		$('#__general_details'),
		$('#__manage-buttons')
	);
};

const setType = (entry) => {
	let type;
	switch (entry.type) {
		case 'noun':
			type = '#noun_type';
			break;
		case 'verb':
			type = '#verb_type';
			break;
		case 'adverb':
			type = '#adv_type';
			break;
		case 'adjective':
			type = '#adj_type';
			break;
	}
	return type;
};

const fillOutForm = (entry) => {
	fillOutGeneralDetails(entry);
	switch (entry.type) {
		case 'noun':
			fillOutNounForms(entry);
			break;
		case 'verb':
			fillOutVerbForms(entry);
			break;
		case 'adjective':
			fillOutAdjectiveForms(entry);
			fillOutExtraDetails(entry);
			break;
	}	
};

const fillOutGeneralDetails = (entry) => {
	$('#word_spell').value = entry.word;
	fillOutTranslations(entry, '#general input', '#general');
	$('#word_example').value = entry.example;
};

const fillOutNounForms = (entry) => {
	entry.forms.forEach((form, i) => {
		$$('#__noun_forms input')[i].value = form;
	});
};

const fillOutVerbForms = (entry) => {
	let forms = entry.forms;
	for (let i = 0; i < (forms.length - 1); i++) {
		$$('#present_forms input')[i].value = 
			forms[i].substring(forms[i].indexOf(' ') + 1);
	}
	let lastForm = forms[forms.length - 1];
	let pastFormType = lastForm.substring(lastForm.indexOf(' ') + 1);
	if (pastFormType === '(h)') {
		$('#haben_type').checked = true;
	} else {
		$('#sein_type').checked = true;
	}
	let pastForm = lastForm.substring(0, lastForm.indexOf(' '));
	$('#form_perfect').value = pastForm;
};

const fillOutAdjectiveForms = (entry) => {
	entry.forms.forEach((form, i) => {
		$$('#__adjective_forms input[type=text]')[i].value = form; 
	});
};

const fillOutExtraDetails = (entry) => {
	if (entry.hasOwnProperty('extraTranslation')) {
		fillOutTranslations(entry, '#adverb input', '#adverb');
		$('#adv_word_example').value = entry.extraExample;
	}
};

const fillOutTranslations = (entry, sections, target) => {
	let translations = 
		target === '#general' ? entry.translation : entry.extraTranslation;
	while ($$(sections).length < translations.length) {
		addTranslationField(target);
	}
	for (let i = 0; i < translations.length; i++) {
		$$(sections)[i].value = translations[i];
	}
};

const addTranslationField = (spot) => {
	let inputNum = $$(spot+' input').length;
	let lastIndex = inputNum - 1;
	let lastInput = $$(spot+' input')[lastIndex];
	let newInput = lastInput.cloneNode(true);
	let newId = inputNum + 1;
	if (inputNum < 2) newInput.id += newId;
	else {
		let cut = newInput.id.search(/\d/);
		newInput.id = newInput.id.slice(0, cut) + newId;
	} 
	$(spot).appendChild(newInput);
};

const removeTranslationField = (spot) => { 
	let inputNum = $$(spot+' input').length;
	let lastIndex = inputNum - 1;
	if (lastIndex > 0) {
		let lastInput = $$(spot+' input')[lastIndex];
		$(spot).removeChild(lastInput);
	}	
};

const showTargetSection = (targetSection, sections) => {
	openSections(targetSection);
	hideSections(...sections.filter(s => s != targetSection));
};

const hideSections = (...s) => {
	s.forEach(el => {
		if (!el.classList.contains('hidden')) el.classList.add('hidden');
	});
};

const openSections = (...s) => {
	s.forEach(el => {
		if (el.classList.contains('hidden')) el.classList.remove('hidden');
	});
	s[0].scrollIntoView();	
};