const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  translate(text, locale) {
    let translation = '';
    // const textArr = this.grep(text);
    const textArr = text.split(' ');
    
    translation =
      locale === 'american-to-british' ?
        textArr
          .map((word, index) => {
            const capitalized = word[0].toUpperCase() === word[0];
            const testWord = word[0].toLowerCase().concat(word.slice(1)).toLowerCase();
            let returnedWord = word;
            let wordHasBeenTranslated = false;
            
            if (Object.keys(americanToBritishTitles).includes(testWord)) {
              returnedWord = americanToBritishTitles[testWord];
              wordHasBeenTranslated = true;
            } else if (/^[0-9]{1,2}:[0-9]{1,2}$/g.test(testWord)) {
              returnedWord = testWord.replace(':', '.');
              wordHasBeenTranslated = true;
            } else if (Object.keys(americanToBritishSpelling).includes(testWord)) {
              returnedWord = americanToBritishSpelling[testWord];
              wordHasBeenTranslated = true;
            }  else if (Object.keys(americanOnly).includes(testWord)) {
              returnedWord = americanOnly[testWord];
              wordHasBeenTranslated = true;
            } else {
              const wordArr = this.grep(testWord);

              returnedWord = wordArr
                .map(w => {
                  if (Object.keys(americanOnly).includes(w)) {
                    return this.classWrapper(americanOnly[w]);
                  } else {
                    return w;
                  }
                })
                .join('');
            }

            if (capitalized)
              returnedWord = returnedWord[0].toUpperCase().concat(returnedWord.slice(1));

            if (wordHasBeenTranslated)
              returnedWord = this.classWrapper(returnedWord);
            
            return returnedWord;
          })
          .join(' ')
          .replace(/\s+(\W)/g, "$1")
          .replace(/(\w)(<span)/g, "$1 $2")
        :
        textArr
          .map(word => {
            const capitalized = word[0].toUpperCase() === word[0];
            const testWord = word[0].toLowerCase().concat(word.slice(1)).toLowerCase();
            let returnedWord = word;
            let wordHasBeenTranslated = false;
            
            if (/^[0-9]{1,2}.[0-9]{1,2}$/g.test(testWord)) {
              returnedWord = testWord.replace('.', ':');
              wordHasBeenTranslated = true;
            } else if (Object.values(americanToBritishSpelling).includes(testWord)) {
              returnedWord = americanToBritishSpelling[
                Object.keys(americanToBritishSpelling)
                  .find(key => americanToBritishSpelling[key] === testWord)
              ];
              wordHasBeenTranslated = true;
            } else if (Object.values(americanToBritishTitles).includes(testWord)) {
              returnedWord = americanToBritishTitles[
                Object.keys(americanToBritishTitles)
                  .find(key => americanToBritishTitles[key] === testWord)
              ];
              wordHasBeenTranslated = true;
            } else if (Object.keys(britishOnly).includes(testWord)) {
              returnedWord = britishOnly[testWord];
              wordHasBeenTranslated = true;
            }

            if (capitalized)
              returnedWord = returnedWord[0].toUpperCase().concat(returnedWord.slice(1));

            if (wordHasBeenTranslated)
              returnedWord = this.classWrapper(returnedWord);
            
            return returnedWord;
          })
          .join(' ')
          .replace(/\s+(\W)/g, '$1')
          .replace(/(\w)(<span)/g, "$1 $2");

    if (translation === text) translation = 'Everything looks good to me!';

    return { translation, text };
  }

  classWrapper(str) {
    return '<span class="highlight">'.concat(str, '</span>');
  }

  grep(str, filt) {
    const punct = '\\[' + '\\!' + '\\"' + '\\#' + '\\$' +   // since javascript does not
          '\\%' + '\\&' + '\\\'' + '\\(' + '\\)' +  // support POSIX character
          '\\*' + '\\+' + '\\,' + '\\\\' + '\\-' +  // classes, we'll need our
          '\\.' + '\\/' + '\\:' + '\\;' + '\\<' +   // own version of [:punct:]
          '\\=' + '\\>' + '\\?' + '\\@' + '\\[' +
          '\\]' + '\\^' + '\\_' + '\\`' + '\\{' +
          '\\|' + '\\}' + '\\~' + '\\]';
    const re = new RegExp(     // tokenizer
       '\\s*' +            // discard possible leading whitespace
       '(' +               // start capture group
         '\\.{3}' +            // ellipsis (must appear before punct)
       '|' +               // alternator
         '\\w+\\-\\w+' +       // hyphenated words (must appear before punct)
       '|' +               // alternator
         '\\w+\'(?:\\w+)?' +   // compound words (must appear before punct)
       '|' +               // alternator
         '\\w+' +              // other words
       '|' +               // alternator
         '[' +
      punct + ']' +        // punct
       ')'                // end capture group
     );
// grep(ary[,filt]) - filters an array
//   note: could use jQuery.grep() instead
// @param {Array}    ary    array of members to filter
// @param {Function} filt   function to test truthiness of member,
//   if omitted, "function(member){ if(member) return member; }" is assumed
// @returns {Array}  all members of ary where result of filter is truthy
    let result = [];
    const ary = str.split(re);
    
    for (let i = 0, len = ary.length; i++ < len;) {
      let member = ary[i] || '';
      
      if (filt && (typeof filt === 'Function') ? filt(member) : member) {
        result.push(member);
      }
    }
    
    return result;
  }
}

module.exports = Translator;
