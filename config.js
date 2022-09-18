const { Sequelize } = require('sequelize');
const fs = require('fs');

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
const toBool = (x) => x == 'true'
global.apikey = {'https://h-e-r-m-i-t-web.herokuapp.com': 'free'}
global.apiUrl = 'https://h-e-r-m-i-t-web.herokuapp.com/'

const DATABASE_URL = process.env.DATABASE_URL === undefined ? './database.db' : process.env.DATABASE_URL
process.env.NODE_OPTIONS = '--max_old_space_size=2560'
DEBUG = process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG)
module.exports = {
	VERSION: 'v4.3.0', 
    SESSION_ID: process.env.SESSION_ID || '',
    MODE: process.env.MODE || 'public',
    HANDLERS: (process.env.PREFIX || '^[.,!]').trim(),
    SEND_READ: process.env.READ_COMMAND || false, 
    READ_MSG: process.env.READ_MSG === 'true', 
    MSG_LOG: convertToBool(process.env.LOG_MSG) || false, 
    BLOCKCHAT: process.env.BLOCK_CHAT === undefined ? false : process.env.BLOCK_CHAT,
    LANG: process.env.LANGUAGE === undefined ? 'EN' : process.env.LANGUAGE.toUpperCase(),
    ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE),
    BOT_NAME: process.env.BOT_NAME || '𝛨𝛯𝑅𝛭𝛪𝑇',
    AUTOMUTE_MSG: process.env.AUTOMUTE_MSG || '_Group automuted!_\n_(Change this by setting var AUTOMUTE_MSG)_',
    AUTOUNMUTE_MSG: process.env.AUTOUNMUTE_MSG || '_Group autounmuted!_\n_(Change this by setting var AUTOUNMUTE_MSG)_',
    BOT_INFO: process.env.BOT_INFO || '𝛨𝛯𝑅𝛭𝛪𝑇;𝛥𝐷𝛪𝑇𝛨𝑌𝛥𝛮;972528277755;https://i.imgur.com/6oRG106.jpeg',
    AUDIO_DATA: process.env.AUDIO_DATA === undefined ? '𝛨𝛯𝑅𝛭𝛪𝑇;𝛥𝐷𝛪𝑇𝛨𝑌𝛥𝛮;https://i.imgur.com/fj2WE83.jpeg' : process.env.AUDIO_DATA,
    STICKER_DATA: process.env.STICKER_DATA === undefined ? '𝛨𝛯𝑅𝛭𝛪𝑇;𝛥𝐷𝛪𝑇𝛨𝑌𝛥𝛮' : process.env.AUDIO_DATA,
    ERROR_MESSAGE: toBool(process.env.ERROR_MESSAGE), 
    WARN: process.env.WARN || '4',
    HEROKU: {
        HEROKU: process.env.HEROKU === undefined ? false : convertToBool(process.env.HEROKU),
        API_KEY: process.env.HEROKU_API_KEY || '',
        APP_NAME: process.env.HEROKU_APP_NAME || ''
       },
       DATABASE_URL: DATABASE_URL,
       DATABASE:
       DATABASE_URL === './database.db' ? new Sequelize({dialect: 'sqlite', storage: DATABASE_URL, logging: false,}) : new Sequelize(DATABASE_URL, {dialect: 'postgres', ssl: true, protocol: 'postgres', dialectOptions: {native: true, ssl: { require: true, rejectUnauthorized: false },}, logging: false,}),
       RBG_API_KEY: process.env.REMOVE_BG_API_KEY === undefined ? false : process.env.REMOVE_BG_API_KEY,
       BRAIN_ID: process.env.BRAIN_ID === undefined ? false : process.env.BRAIN_ID,
       SUDO: process.env.SUDO || '972528277755,0',
       DEBUG: DEBUG
};


