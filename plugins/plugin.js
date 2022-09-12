const {Function,getString,PluginDB,Plugin,removeCommand} = require('../lib/');
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
if (plugin.length < 1) { return await m.reply(Lang.NOT_FOUND_PLUGIN);} else {
const got = require('got')
const res = await got(plugin[0].dataValues.url)
if (res.statusCode == 200) {
let name = /pattern: ["'](.*)["'],/g.exec(res.body)
name = name[1].split(' ')[0]
await removeCommand(name)
}
await plugin[0].destroy();
delete require.cache[require.resolve('./' + text + '.js')]
fs.unlinkSync('./plugins/' + text + '.js');
await m.reply(Lang.DELETED.replace('{}', text));}
});

Function({pattern: 'cmdrm ?(.*)', fromMe: true, desc: 'delete a command', type: 'user'}, async (message, match, client) => {
const response = await removeCommand(match)
if (response) {
await message.send('_Deleted_')
} else {
await message.send('*Not found*')
}
})