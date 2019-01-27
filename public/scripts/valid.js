'use strict';
/****************************************************************************
 *
 *                      VALIDATE SPECIFIC SECTIONS
 *
 ***************************************************************************/
const validateGeneralSection = (mode, data) => {
    if (mode === 'create') {
        return validateWordSpelling($$('#word_spell')) &&
            validateTranslation($$('#general input')) &&
            validateTextArea($('#word_example')) &&
            validateRadioButtons($$('#__choose_type input'));
    } else if (mode === 'update') {
        return validateWordSpellingForUpdate($$('#word_spell'), data) &&
            validateTranslation($$('#general input')) &&
            validateTextArea($('#word_example'));
    }
};

const validateNounSection = () => {
    return validateNounForms($$('#__noun_forms input'));
};

const validateVerbSection = () => {
    return validateVerbPresentForms($$('#present_forms input')) &&
        validateRadioButtons($$('#perfect_type input')) &&
        validateVerbPastForms($$('#past_forms input[type=text]'));
};

const validateAdjectiveSection = () => {
    let firstResult = false;
    let secondResult = true;
    firstResult = 
        validateAdjectiveForms($$('#__adjective_forms input[type=text]')) &&
        validateRadioButtons($$('#add_adverb input'));
    if ($('#adverb_true').checked) {
        secondResult = validateTranslation($$('#adverb input')) &&
            validateTextArea($('#adv_word_example'));
    }
    return firstResult && secondResult;
};

const validateAll = (mode, data = null) => {
    let result = false;
    if (validateGeneralSection(mode, data)) {
        if ($('#noun_type').checked) result = validateNounSection();
        if ($('#verb_type').checked) result = validateVerbSection();
        if ($('#adj_type').checked) result = validateAdjectiveSection();
        if ($('#adv_type').checked) result = true;
    } 
    return result;
};
/****************************************************************************
 *
 *                      HOW TO VALIDATE VARIOUS INPUTS
 *
 ***************************************************************************/
const validateTextArea = (source) => {
    let extraSpace = /\s{2,}/g;
    let pattern = /.{10,}/;
    source.value = source.value
        .trim()
        .replace(extraSpace,' ');
    if (!pattern.test(source.value)) highlightInvalid(source);
    return pattern.test(source.value);
};

const validateRadioButtons = (source) => {
    let nodeArray = Array.from(source);
    if (nodeArray.every(input => !input.checked))
        highlightInvalid(source[0].parentElement);
    return nodeArray.some(input => input.checked);
};

const validateTranslation = (source) => {
    let forbidden = /[^a-z|A-Z|\s]/g;
    eraseForbiddenSymbols(source, forbidden)
        .forEach(input => {
            if (forbidden.test(input.value) || input.value == '')
                highlightInvalid(input);
        }); 
    return Array.from(source)
        .every(input => !(forbidden.test(input.value) || input.value == ''));
    
};

const validateNounForms = (source) => {
    let forbidden = /[^a-z|A-Z|äöüß|ÄÖÜ|\s|()]/g;
    let pattern = /^(der|die|das|des)\s[A-ZÄÖÜ][a-zßäöü()]*$/;
    return validateTextInputs(source, forbidden, pattern);
};

const validateVerbPresentForms = (source) => {
    let forbidden = /[^a-z|äöüß|\s]/g;
    let pattern = /^[a-zßäöü]{3,}\s[a-zßäöü]{2,}$|^[a-zßäöü]{3,}$/;
    return validateTextInputs(source, forbidden, pattern);
};

const validateVerbPastForms = (source) => {
    let forbidden = /[^a-z|äöüß]/g;
    let pattern = /[a-zäöüß]{5,}/;
    return validateTextInputs(source, forbidden, pattern);
};

const validateAdjectiveForms = (source) => {
    let forbidden = /[^a-z|äöüß]/g;
    let pattern = /[a-zäöüß]{4,}/;
    return validateTextInputs(source, forbidden, pattern);
};

const validateWordSpelling = (source) => {
    let forbidden = /[^a-z|A-Z|äöüß|ÄÖÜ|-]/g;
    let longRegEx = ['^[A-Z]-[A-ZÄÖÜ]?[a-zäöüß]+$|^[A-ZÄÖÜ]?[a-zäöüß]{2,}$',
        '|^[A-ZÄÖÜ]?[a-zäöüß]+-[A-ZÄÖÜ]?[a-zäöüß]+$'].join('');
    let pattern = new RegExp(longRegEx);
    let result;
    result = validateTextInputs(source, forbidden, pattern);
    if (doesExist(source[0].value) && $('#create_type').checked) {
        notifyThatExists(source[0].value);
        result = false;
    }
    if (!doesExist(source[0].value) && $('#update_type').checked) {
        notifyThatExistsNot(source[0].value, '#exst_word_upd');
        result = false;
    }
    if (!doesExist(source[0].value) && $('#delete_type').checked) {
        notifyThatExistsNot(source[0].value, '#exst_word_del');
        result = false;
    }
    return result;
};

const validateWordSpellingForUpdate = (source, data) => {
    let forbidden = /[^a-z|A-Z|äöüß|ÄÖÜ|-]/g;
    let longRegEx = ['^[A-Z]-[A-ZÄÖÜ]?[a-zäöüß]+$|^[A-ZÄÖÜ]?[a-zäöüß]{2,}$',
        '|^[A-ZÄÖÜ]?[a-zäöüß]+-[A-ZÄÖÜ]?[a-zäöüß]+$'].join('');
    let pattern = new RegExp(longRegEx);
    let result = validateTextInputs(source, forbidden, pattern);
    if (source[0].value.toLowerCase() !== data.word.toLowerCase()) {
        if (doesExist(source[0].value)) {
            notifyThatExists(source[0].value);
            result = false;
        } 
    }
    return result;
};
/****************************************************************************
 *
 *                      GENERAL OPERATIONS AND HELPERS
 *
 ***************************************************************************/
const validateTextInputs = (source, forbidden, pattern) => {
    eraseForbiddenSymbols(source, forbidden)
        .forEach(input => {
            if (pattern.test(input.value) === false) {
                highlightInvalid(input);
            }
        });
        
    return Array.from(source).every(input => pattern.test(input.value));
};

const highlightInvalid = (target) => {
    target.parentElement.parentElement.scrollIntoView();
    target.classList.add('invalid');
    setTimeout(() => target.classList.remove('invalid'), 500);
};

const doesExist = (word) => {
    return replaceSpecialChars(word.toLowerCase()) in dictionary; 
}; 

const notifyThatExists = (word) => {
    let notification = document.createElement('span');
    notification.classList.add('red');
    notification.innerText = ` "${word}" is already in the dictionary!`;    
    $('#new_word').scrollIntoView();
    if ($('#new_word').children.length === 0) 
        $('#new_word').appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 2000);
};

const notifyThatExistsNot = (word, target) => {
    if (word != '') {
        let notification = document.createElement('span');
        notification.classList.add('red');
        notification.innerText = ` "${word}" is not in the dictionary!`;    
        $(target).scrollIntoView();
        if ($(target).children.length === 0) 
            $(target).appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
};

const eraseForbiddenSymbols = (source, forbidden) => {
    let extraSpace = /\s{2,}/g;
    let nodeArray = Array.from(source);
    nodeArray.forEach(input => {
        input.value = input.value
            .replace(forbidden, ' ')
            .trim()
            .replace(extraSpace, ' ');
    });
    return nodeArray;
};