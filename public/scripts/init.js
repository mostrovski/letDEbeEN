'use strict';
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
var dictionary;
var words;
var translated = new Set();
// load dictionary on start
fetch ('dictionaryload').then(
    data => data.text(),
    () => console.log ('Oops... Something went wrong')
).then(
    data => {
        dictionary = JSON.parse(data);
        words = Object.getOwnPropertyNames(dictionary);
        showInitialWord();
    }
);
// show random word from the dictionary
const showInitialWord = () => {
    let defineInitialWord = new Promise(
        (resolve, reject) => {
            if (words) {
                var random = randomNum(words.length);
                resolve(random);
            } else {
                var problem = new Error('failed to catch the source');
                reject(problem);
            }
        }
    ).then(
        (random) => showWordData(words[random]),
        (problem) => {
            console.log(problem.message);
            showDefaultWord();
        }
    );
};
// show in case the dictionary was not loaded fast enough
const showDefaultWord = () => {
    $('.management input').value = 'Dualzahl';
    $('.german span').innerHTML = 'Dualzahl';
    $$('.word__details')[0].innerHTML = 'binary number<br>(noun)';
    $$('.word__details')[1].innerHTML = 'die Dualzahl<br>die Dualzahlen<br>'+
        'der Dualzahl';
    $$('.word__details')[2].innerHTML = 'Die über Tasten einstellbare '+
        'Hexadezimalzahl wird in eine Dualzahl umgewandelt';
    translated.add('dualzahl');
    window.scrollTo(top);
};

const randomNum = (range) => Math.floor(Math.random() * range);