const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {
    translate(text, locale) {
        let translation = '';
        if (locale === 'american-to-british') {
            translation = this.americanToBritish(text);
        } else if (locale === 'british-to-american') {
            translation = this.britishToAmerican(text);
        } else {
            return 'Invalid locale';
        }

        if (translation === text) {
            translation = 'Everything looks good to me!';
        }

        return { translation, text };
    }

    americanToBritish(text) {
        return this.lookupDict(
            this.lookupDict(
                this.lookupDict(
                    this.americanTimeToBritish(text),
                    americanToBritishTitles
                ),
                americanToBritishSpelling
            ),
            americanOnly
        );
    }

    americanTimeToBritish(text) {
        return text.replace(/([0-9]{1,2}):([0-9]{1,2})/g, matched => this.classWrapper(matched.replace(':', '.')));
    }

    britishToAmerican(text) {
        return this.lookupDict(
            this.lookupDict(
                this.lookupDict(
                    this.britishTimeToAmerican(text),
                    britishOnly
                ),
                americanToBritishTitles,
                'value'
            ),
            americanToBritishSpelling,
            'value'
        );
    }

    britishTimeToAmerican(text) {
        return text;
    }

    lookupDict(text, dict, keyValue = 'key') {
        if (keyValue === 'value') {
            return RegExp(Object.values(dict).join('|'), 'g').test(text) ? dict[text] : text;
        } else {
            return text.replace(
                new RegExp(Object.keys(dict).sort((a, b) => b.length - a.length).join('|'), 'gi'),
                matched => {
                    let translated = dict[matched.toLowerCase()];
                    return this.classWrapper(this.capitalized(matched) ? this.capitalize(translated) : translated);
                }
            );
        }
    }

    classWrapper(text) {
        return `<span class="highlight">${text}</span>`;
    }

    capitalize(text) {
        return text[0].toUpperCase().concat(text.slice(1));
    }

    capitalized(text) {
        return text[0].toUpperCase() === text[0];
    }
}

module.exports = Translator;
