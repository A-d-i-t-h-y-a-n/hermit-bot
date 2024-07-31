const translate = require("translate-google-api");
const { Function, isPublic } = require('../lib/');
const config = require('../config');

Function({
    pattern: 'trt ?(.*)',
    fromMe: isPublic,
    desc: 'Google Translate',
    type: 'search'
}, async (message, match) => {
    if (!message.quoted.text) {
        return await message.reply('_Reply to a text message_\n*Example: trt en|ml*');
    }
    
    const [to, from] = match.split(' ');
    const targetLang = to || config.LANG;
    const sourceLang = from || 'auto';

    try {
        const translated = await translate(message.quoted.text, { tld: "co.in", to: targetLang, from: sourceLang });
        await message.reply(translated?.join());
    } catch (error) {
        await message.reply('_' + error.message + '_');
    }
});
