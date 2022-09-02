const {Function,getString,parseMessage} = require('../lib/');
const FilterDb = require('../lib/database/filters');
const Lang = getString('filters');

Function({pattern: 'filter ?(.*)', fromMe: true, desc: Lang.FILTER_DESC, type: 'user'}, async (message, text, client) => {
    match = text.match(/[\'\"\“](.*?)[\'\"\“]/gsm);

    if (match === null) {
        filtreler = await FilterDb.getFilter(message.jid);
        if (filtreler === false) {
            await message.reply(Lang.NO_FILTER)
        } else {
            var mesaj = Lang.FILTERS + '\n';
            filtreler.map((filter) => mesaj += '```' + filter.dataValues.pattern + '```\n');
            await message.reply(mesaj);
        }
    } else {
        if (match.length < 2) {
            return await message.reply(Lang.NEED_REPLY + ' ```.filter "sa" "as"');
        }
        await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), match[1].replace(/['"“]+/g, ''), match[0][0] === "'" ? true : false);
        await message.reply(Lang.FILTERED.replace('{}', match[0].replace(/['"]+/g, '')));
    }
});

Function({pattern: 'stop ?(.*)', fromMe: true, desc: Lang.STOP_DESC, type: 'user'}, async (message, text, client) => {
    match = text.match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (match === null) {
        return await message.reply(Lang.NEED_REPLY + '\n*Example:* ```.stop "hello"```')
    }

    del = await FilterDb.deleteFilter(message.jid, match[0].replace(/['"“]+/g, ''));
    
    if (!del) {
        await message.reply(Lang.ALREADY_NO_FILTER)
    } else {
        await message.reply(Lang.DELETED)
    }
});


Function({on: 'text', fromMe: false}, async (message, text, client) => {
    var filtreler = await FilterDb.getFilter(message.jid);
    if (!filtreler) return; 
    filtreler.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(message.text)) {
            	await client.sendMessage(message.jid, await parseMessage(message.jid, message.sender, client, filter.dataValues.text), { quoted: message.data })
            }
        }
    );
});
