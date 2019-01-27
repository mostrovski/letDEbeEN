'use strict';
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

let server = express();
server.use(express.static('public'));
server.use(bodyParser.json());

server.get('/loadform', (req, res) => {
    fs.readFile('./data/form.html', (err, data) => {
        if (err) throw err;
        else {
            res.send(data);
        }
    });
});

server.post('/dictionarytojson', (req, res) => {
    let dictionaryData = JSON.stringify(req.body, null, 4);
    fs.writeFile('./data/dictionary.json', dictionaryData, (err) => {
        if (err) throw err;
        else res.send('Changes were saved to the dictionary.');
    });
});

server.get('/dictionaryload', (req, res) => {
    fs.readFile('./data/dictionary.json', (err, data) => {
        if (err) throw err;
        else {
            let dictionaryToDocument = JSON.parse(data);
            res.send(dictionaryToDocument);
        }
    });
});

server.listen (8080);