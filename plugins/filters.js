const {
	Function,
	getString,
	parseMessage
} = require('../lib/');
const FilterDb = require('../lib/database/filters');
const Lang = getString('filters');

Function({
	pattern: 'filter ?(.*)',
	fromMe: true,
	desc: Lang.FILTER_DESC,
	type: 'group'
}, async (message, text, client) => {
	match = text.match(/[\'\"\“](.*?)[\'\"\“]/gsm);

	if (match === null) {
		filtreler = await FilterDb.getFilter(message.jid);
		if (filtreler === false) {
			await message.reply(Lang.NO_FILTER)
		} else {
			var msg = Lang.FILTERS + '\n';
			filtreler.map((filter) => msg += '```' + filter.dataValues.pattern + '```\n');
			await message.reply(msg);
		}
	} else {
		if (match.length < 2) {
			return await message.reply(`*Need text!*\nExample: filter 'hi' 'hello'`)
		}
		await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), match[1].replace(/['"“]+/g, ''), match[0][0] === "'" ? true : false);
		await message.reply(Lang.FILTERED.replace('{}', match[0].replace(/['"]+/g, '')));
	}
});

Function({
	pattern: 'stop ?(.*)',
	fromMe: true,
	desc: Lang.STOP_DESC,
	type: 'group'
}, async (message, match, client) => {
	if (!match) return await message.reply(`*Need text!*\nExample: stop hi`)
	del = await FilterDb.deleteFilter(message.jid, match);
	if (!del) return await message.reply(Lang.ALREADY_NO_FILTER)
	await message.reply(Lang.DELETED)
});


Function({
	on: 'text',
	fromMe: false
}, async (message, text, client) => {
	var filtreler = await FilterDb.getFilter(message.jid);
	if (!filtreler) return;
	filtreler.map(
		async (filter) => {
			pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
			if (pattern.test(message.text)) {
				await client.sendMessage(message.jid, await parseMessage(message.jid, message.sender, client, filter.dataValues.text), {
					quoted: message.data
				})
			}
		}
	);
});