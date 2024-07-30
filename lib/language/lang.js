const fs = require('fs');
const path = require('path');

const Config = require('../../config');
const LANG_FILE_PATH = path.join(__dirname, `${Config.LANG}.json`);

let langData = {};

if (fs.existsSync(LANG_FILE_PATH)) {
  langData = JSON.parse(fs.readFileSync(LANG_FILE_PATH));
  console.log(`hermit-md ${Config.VERSION}`);
} else {
  console.log('You entered an invalid language. English language was chosen.');
  langData = JSON.parse(fs.readFileSync(path.join(__dirname, 'EN.json')));
}

function getString(key) {
  return langData.STRINGS[key];
}

module.exports = {
  language: langData,
  getString,
};
