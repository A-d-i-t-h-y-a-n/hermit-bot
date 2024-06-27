const fs = require('fs');
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './config.env', override: true });

const toBool = (value, defaultValue = false) => 
    value === undefined ? defaultValue : value.toLowerCase() === 'true';

const getEnv = (key, defaultValue = '') => process.env[key] || defaultValue;

const config = {
    VERSION: 'v4.4.1',
    SESSION_ID: getEnv('SESSION_ID'),
    MODE: getEnv('MODE', 'public').toLowerCase(),
    HANDLERS: getEnv('PREFIX', '^[.,!]').trim(),
    SEND_READ: toBool(getEnv('READ_COMMAND'), false),
    READ_MSG: toBool(getEnv('READ_MSG'), false),
    MSG_LOG: toBool(getEnv('LOG_MSG'), false),
    BLOCKCHAT: toBool(getEnv('BLOCK_CHAT'), false),
    LANG: getEnv('LANGUAGE', 'EN').toUpperCase(),
    ALWAYS_ONLINE: toBool(getEnv('ALWAYS_ONLINE')),
    BOT_NAME: getEnv('BOT_NAME', 'ʜᴇʀᴍɪᴛ'),
    AUTOMUTE_MSG: getEnv('AUTOMUTE_MSG', '_Group automuted!_\n_(Change this by setting var AUTOMUTE_MSG)_'),
    AUTOUNMUTE_MSG: getEnv('AUTOUNMUTE_MSG', '_Group autounmuted!_\n_(Change this by setting var AUTOUNMUTE_MSG)_'),
    ANTILINK_MSG: getEnv('ANTILINK_MSG', '_Link Not Allowed!_\n_(Change this by setting var ANTILINK_MSG)_'),
    BOT_INFO: getEnv('BOT_INFO', 'ʜᴇʀᴍɪᴛ;ᴀᴅɪᴛʜyᴀɴ;972528277755;https://i.imgur.com/6oRG106.jpeg'),
    AUDIO_DATA: getEnv('AUDIO_DATA', 'ʜᴇʀᴍɪᴛ;ᴀᴅɪᴛʜyᴀɴ;https://i.imgur.com/fj2WE83.jpeg'),
    STICKER_DATA: getEnv('STICKER_DATA', 'ʜᴇʀᴍɪᴛ;ᴀᴅɪᴛʜyᴀɴ'),
    ERROR_MESSAGE: toBool(getEnv('ERROR_MESSAGE'), true),
    SONG_THUMBNAIL: toBool(getEnv('SONG_THUMBNAIL')),
    WARN: getEnv('WARN', '4'),
    REJECT_CALL: toBool(getEnv('REJECT_CALL')),
    KOYEB_API_KEY: getEnv('KOYEB_API_KEY', false),
    KOYEB_APP_NAME: getEnv('KOYEB_APP_NAME'),
    TERMUX_VPS: toBool(getEnv('TERMUX') || getEnv('VPS')),
    AUTO_STATUS_VIEW: toBool(getEnv('AUTO_STATUS_VIEW')),
    APIKEY: getEnv('APIKEY', 'free'),
    AUTH_FILE: toBool(getEnv('AUTH_FILE'), false),
    START_MSG: toBool(getEnv('START_MSG'), true),
    HEROKU: {
        HEROKU: toBool(getEnv('HEROKU'), false),
        API_KEY: getEnv('HEROKU_API_KEY'),
        APP_NAME: getEnv('HEROKU_APP_NAME')
    },
    DATABASE_URL: getEnv('DATABASE_URL', './database.db'),
    RBG_API_KEY: getEnv('REMOVE_BG_API_KEY', false),
    BRAIN_ID: getEnv('BRAIN_ID', 'bid=168613&key=EfbnX54Iy9PFIFp3'),
    SUDO: getEnv('SUDO', '972528277700,0'),
    DEBUG: toBool(getEnv('DEBUG'), false)
};

global.apiUrl = 'https://hermit-api.koyeb.app/';

config.DATABASE = config.DATABASE_URL === './database.db' 
    ? new Sequelize({dialect: 'sqlite', storage: config.DATABASE_URL, logging: false})
    : new Sequelize(config.DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    });

module.exports = config;