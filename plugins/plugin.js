const {
	Function,
	getString,
	PluginDB,
	Plugin,
	removeCommand,
	getJson
} = require('../lib/');
const Config = require('../config');
const axios = require('axios');
const fs = require('fs');
const Lang = getString('_plugin');

Function({
	pattern: 'plugin ?(.*)',
	fromMe: true,
	desc: Lang.PLUGIN_DESC,
	type: 'user'
}, async (m, text) => {
	text = text || m.reply_message.text
	await Plugin(text, m)
});

Function({
	pattern: 'remove ?(.*)',
	fromMe: true,
	desc: 'Remove a specific plugin or all plugins',
	type: 'user'
}, async (message, match, client) => {
	if (!match) return await message.reply('*Need plugin name!*\n_Example :_\n.remove mforward\n.remove all');
	try {
		if (match.toLowerCase() === 'all') {
			const plugins = await PluginDB.PluginDB.findAll();
			for (const plugin of plugins) {
				const pluginName = plugin.dataValues.name;
				await removeCommand(pluginName);
				await plugin.destroy();
			}
			return await message.reply('_All plugins successfully deleted!_\n*Reboot the BOT*');
		}
		const plugin = await PluginDB.PluginDB.findAll({ where: { name: match } });
		if (plugin.length < 1) return await message.reply(`Plugin *${match}* not found.`);
		await removeCommand(plugin[0].dataValues.name);
		await plugin[0].destroy();
		delete require.cache[require.resolve(`./${match}.js`)];
		fs.unlinkSync(`./plugins/${match}.js`);
		await message.reply('_Plugin successfully deleted!_\n*Reboot the BOT*');
	} catch (error) {
		console.error(error);
		await message.reply('An error occurred while removing the plugin(s).\n*Error:' + error.message + '*');
	}
});


Function({
	pattern: 'cmdrm ?(.*)',
	fromMe: true,
	desc: 'delete a command',
	type: 'user'
}, async (message, match, client) => {
	const response = await removeCommand(match)
	if (response) {
		await message.send('_Deleted_')
	} else {
		await message.send('*Not found*')
	}
})