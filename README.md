# let DE be EN
*tiny German->English dictionary of (mainly) computer terminology* 

## Intro

German is not my first language, so you can imagine how it was to read my 
first ever German-written programming book. There are many ways to find out 
how this or that German word is translated into English. For starters, one can 
go to something like [linguee](https://www.linguee.com/). There are dozens of 
pretty decent offline dictionary apps as well. So what's the problem?

Although these apps are great for the general lexis, they may confuse a user
when it comes to computer science, programming, web development, and similar
areas. Consider the moment I faced the word *Verzweigung* for the first time. 
There was no code snippet around to get the meaning immediately. It took a 
while to understand the author has meant *conditional* or *if-statement* in 
that sentence. I didn't find this translation of *Verzweigung* anywhere.

Another problem is that traditional dictionary apps are mainly designed for the
reference. If one also wants to **learn** a couple of words, he or she would
probably want the dictionary entries to be presented the other way.

In brief, these were the main incentives for me to come up with this tiny 
single-page web application.

## Idea

I wanted to present the entry as the combination of the following pieces of 
information:

- the word spelling,
- the word type (class),
- relevant translation(s) into English,
- most important inflected forms,
- a relevant example in German.

I believe these data are essential for *learning* the word. Therefore, my app 
instantly shows them all for every opened entry - no extra clicks.

## Functionality

A user can:

- *search* for the entry in the dictionary;
- *create* new dictionary entries;
- *read* dictionary entries;
- *update* dictionary entries;
- *delete* dictionary entries;
- *request* the history of entries read during current visit;
- *request* all the entries for the certain word type (class). 

## Implementation

- `app.js` - the server;
- `init.js` - constants for the DOM manipulation, the dictionary load;
- `main.js` - search & view events, the managing form load;
- `form.js` - managing form logic and events;
- `valid.js` - validation of the user input;
- `crud.js` - create, read, update, delete;
- `form.html` - html fragment with the managing form;
- `index.html` - html of the page;
- `main.css` - styles;
- `dictionary.json` - the dictionary.  

## Dependencies (built with) 

- [HTML](https://www.w3.org/html/)
- [CSS](https://www.w3.org/Style/CSS/)
- [JavaScript](https://developer.mozilla.org/bm/docs/Web/JavaScript)
- [Node.js](https://nodejs.org/en/download/)
- [Express](http://expressjs.com/)
- [body-parser](https://github.com/expressjs/body-parser)

## How to run it

1. Download and extract the repository.
2. Make sure **Node.js** is installed on your computer. Otherwise, download and 
   install it from the download page (see Dependencies above).
3. In your terminal, `cd` to the directory of the application (see step 1).
4. Make sure you are on the same level where the `package.json` is.
5. Run the command `npm install`, this will install necessary modules.
6. Run the command `node app.js` to start the server.
7. In your browser, open *localhost:8080*.