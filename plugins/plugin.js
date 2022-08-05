const {Function,getString,PluginDB} = require('../lib/');
const Config = require('../config');
const axios = require('axios');
const fs = require('fs');
const Lang = getString('_plugin');

Function({pattern: 'install ?(.*)', fromMe: true, desc: Lang.INSTALL_DESC, type: 'misc'}, async (m, text, client) => {
if (text === '') return await m.reply('```' + Lang.NEED_URL + '.install https://gist.github.com/Quiec/cd5af0c153a613ba55c24f8c6b6f5565```')
try {var url = new URL(text);} catch (e) {return await m.reply(Lang.INVALID_URL);}
if (url.host === 'gist.github.com') {
url.host = 'gist.githubusercontent.com';
url = url.toString() + '/raw'
} else {url = url.toString()}
try {var response = await axios(url);} catch (e) {return await m.reply(Lang.INVALID_PLUGIN + ' ```' + e + '```')}
let plugin_name = /pattern: ["'](.*)["'],/g.exec(response.data)
plugin_name = plugin_name[1].split(" ")[0]
fs.writeFileSync('./plugins/' + plugin_name + '.js', response.data);
try {require('./' + plugin_name);} catch (e) {
fs.unlinkSync('./plugins/' + plugin_name + '.js')
return await m.reply(Lang.INVALID_PLUGIN + e);}
await PluginDB.installPlugin(url, plugin_name);
await m.reply(Lang.INSTALLED.replace('{}', plugin_name));
});

Function({pattern: 'plugin', fromMe: true, desc: Lang.PLUGIN_DESC, type: 'misc'}, async (m, text, client) => {
var mesaj = Lang.INSTALLED_FROM_REMOTE;
var plugins = await PluginDB.PluginDB.findAll();
if (plugins.length < 1) {return await m.reply(Lang.NO_PLUGIN);} else {plugins.map((plugin) => {mesaj += '*' + plugin.dataValues.name + '*: ' + plugin.dataValues.url + '\n';}); return await m.reply(mesaj);
}});

Function({pattern: 'remove(?: |$)(.*)', fromMe: true, desc: Lang.REMOVE_DESC, type: 'misc'}, (async (m, text, client) => {
if (text === '') return await m.reply(Lang.NEED_PLUGIN);
var plugin = await PluginDB.PluginDB.findAll({where: {name: text}});
if (plugin.length < 1) { return await m.reply(Lang.NOT_FOUND_PLUGIN);} else {await plugin[0].destroy();
delete require.cache[require.resolve('./' + text + '.js')]
fs.unlinkSync('./plugins/' + text + '.js');
await m.reply(Lang.DELETED.replace('{}', text));}
}));
