'use strict';
const SEARCH_INPUT = $('.management input');
const TRANSLATE = $$('.management button')[0];
const HISTORY = $$('.management button')[1];
const MANAGE = $$('.management button')[2];
const GERMAN_BOX = $('.german span');
const ENGLISH_BOX = $$('.word__details')[0];
const FORMS_BOX = $$('.word__details')[1];
const EXAMPLE_BOX = $$('.word__details')[2];
const TABLE_AREA = $('.tables');
const FORM_AREA = $('.forms');

document.addEventListener('DOMContentLoaded', (e) => {
    enableOperations();
});

const enableOperations = () => {
    SEARCH_INPUT.onkeydown = (e) => translateOnEnter(e);
    TRANSLATE.onclick = () => findWord();
    HISTORY.onclick = () => showHistory(translated);
    MANAGE.onclick = () => showManagingForm();
    $('#nouns').onclick = () => showWords('noun');
    $('#verbs').onclick = () => showWords('verb');
    $('#adjectives').onclick = () => showWords('adjective');
    $('#adverbs').onclick = () => showWords('adverb');
    $('#hide').onclick = () => hideManagingSections();
};
/****************************************************************************
 *
 *                              TRANSLATE
 *
 ***************************************************************************/
const translateOnEnter = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        TRANSLATE.click();
    }
};

const findWord = () => {
    let input = readUserInput(SEARCH_INPUT.value);
    if (checkUserInput(input)) {
        let word = replaceSpecialChars(input);
        if (word in dictionary) showWordData(word);
        else showNotFound(word);
    } else {
        window.alert(
            'You either mistyped or entered more than one word.'+
            "\nI can't translate this!"
        );
    }
};

const readUserInput = (str) => str.trim().toLowerCase();

const checkUserInput = (str) => {
    let alphaCheck = /[^a-z|äöüß|-]/;
    return !(alphaCheck.test(str) || str == '');
};

const replaceSpecialChars = (str) => {
    let strArray = str.split('');
    strArray.forEach( (letter, i, target) => {
        if (letter == 'ä') target[i] = 'ae';
        if (letter == 'ö') target[i] = 'oe';
        if (letter == 'ü') target[i] = 'ue';
        if (letter == 'ß') target[i] = 'ss';
        if (letter == '-') target[i] = '';
    });
    return strArray.join('');
};

const showWordData = (entry) => {
    let englishContent =
        dictionary[entry]['translation'].join('<br>')+'<br>('+
        dictionary[entry]['type']+')<br>';
    SEARCH_INPUT.value = dictionary[entry]['word'];
    GERMAN_BOX.innerHTML = dictionary[entry]['word'];
    ENGLISH_BOX.innerHTML = englishContent;
    FORMS_BOX.innerHTML = dictionary[entry]['forms'].join('<br>');
    EXAMPLE_BOX.innerHTML = dictionary[entry]['example'];
    if (dictionary[entry]['additional']) additionalAdverb(entry);
    translated.add(entry);
    window.scrollTo(top);
};

const showNotFound = (entry) => {
    let url =
        `https://www.linguee.de/deutsch-englisch/uebersetzung/${entry}.html`;
    let otherLink = document.createElement('a');
    let otherLinkText = document.createTextNode('this');
    otherLink.href = url;
    otherLink.setAttribute('target', '_blank');
    otherLink.appendChild(otherLinkText);
    SEARCH_INPUT.value = SEARCH_INPUT.value.toUpperCase();
    GERMAN_BOX.innerHTML = 'Ups!';
    ENGLISH_BOX.innerHTML = "I don't know this word...";
    FORMS_BOX.innerHTML = 'Check the spelling';
    EXAMPLE_BOX.innerHTML = 'or try ';
    EXAMPLE_BOX.appendChild(otherLink);
};

const additionalAdverb = (entry) => {
    let addLink = document.createElement('a');
    let linkText = document.createTextNode('check adverb');
    addLink.href = "#";
    addLink.appendChild(linkText);
    addLink.onclick = (e) => {
        e.preventDefault();
        showWordData(`${entry}_adv`);
    };
    ENGLISH_BOX.appendChild(addLink);
};
/****************************************************************************
 *
 *                              HISTORY
 *
 ***************************************************************************/
const showHistory = (translated) => {
    let sorted = Array.from(translated).sort();
    createTable(sorted);
    hideFormArea();
};
/****************************************************************************
 *
 *                              MANAGE
 *
 ***************************************************************************/
const showManagingForm = () => {
    if (!$('.forms form')) loadManagingForm();
    FORM_AREA.classList.remove('hidden');
    FORM_AREA.scrollIntoView();
    eraseCurrentTable();
};

const loadManagingForm = () => {
    fetch ('loadform').then(
        data => data.text(),
        () => console.log ('Oops... Something went wrong')
    ).then(
        data => {
            FORM_AREA.innerHTML = data;
            setFormEvents();
            FORM_AREA.scrollIntoView();
        }
    );
};

const hideFormArea = () => {
    if (!FORM_AREA.classList.contains('hidden'))
        FORM_AREA.classList.add('hidden');
};

const hideManagingSections = () => {
    eraseCurrentTable();
    hideFormArea();
};
/****************************************************************************
 *
 *                              SHOW WORDS
 *
 ***************************************************************************/
const showWords = (type) => {
    let wordsToShow = words.filter(entry => dictionary[entry]['type']==type);
    createTable(wordsToShow.sort());
    hideFormArea();
};

const createTable = (source) => {
    eraseCurrentTable();
    let table = document.createElement('table');
    let header = table.createTHead();
    let headerRow = header.insertRow(0);
    headerRow.innerHTML =
        '<th>Word</th>'+
        '<th>Translation</th>'+
        '<th>Type</th>';
    let tBody = document.createElement('tbody');
    fillOutTable(tBody, source);
    table.appendChild(tBody);
    TABLE_AREA.appendChild(table);
    TABLE_AREA.scrollIntoView();
    makeTableInteractive(source);
};

const fillOutTable = (target, source) => {
    source.forEach(word => {
        target.innerHTML +=
        "<tr>"+
        "<td>"+dictionary[word]["word"]+"</td>"+
        "<td>"+dictionary[word]["translation"].join(", ")+"</td>"+
        "<td>"+dictionary[word]["type"]+"</td>"+
        "</tr>";
    });
};

const makeTableInteractive = (source) => {
    $$('tbody tr').forEach( (row, i) => {
        row.onclick = () => showWordData(source[i]);
    });
};

const eraseCurrentTable = () => {
    if ($('table')) $('table').remove();
};