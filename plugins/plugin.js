const {Function,getString,PluginDB,Plugin} = require('../lib/');
const Config = require('../config');
const axios = require('axios');
const fs = require('fs');
const Lang = getString('_plugin');

Function({pattern: 'plugin ?(.*)', fromMe: true, desc: Lang.PLUGIN_DESC, type: 'user'}, async (m, text) => {
text = text || m.reply_message.text
await Plugin(text, m)
});

Function({pattern: 'remove ?(.*)', fromMe: true, desc: Lang.REMOVE_DESC, type: 'user'}, async (m, text, client) => {
if (text === '') return await m.reply(Lang.NEED_PLUGIN);
var plugin = await PluginDB.PluginDB.findAll({where: {name: text}});
if (plugin.length < 1) { return await m.reply(Lang.NOT_FOUND_PLUGIN);} else {await plugin[0].destroy();
delete require.cache[require.resolve('./' + text + '.js')]
fs.unlinkSync('./plugins/' + text + '.js');
await m.reply(Lang.DELETED.replace('{}', text));}
require('pm2').restart('index.js');
});
