const {
	Function,
	truecaller,
	isPublic
} = require('../lib/');

Function({
	pattern: 'true ?(.*)',
	fromMe: isPublic,
	desc: 'search number on truecaller',
	type: 'search'
}, async (m, match, client) => {
	try {
		if (!match && !m.quoted) return await m.reply('_Enter the number you want to search_');
		const number = m.quoted ? m.quoted.sender : match.replace(/[^0-9]/g, '')
		const result = await truecaller(number, m.user_id)
		if (!result) return await m.reply('_Internal Server Busy!_')
		if (result == 500) return await m.reply('_Truecaller limit over!\n(20/20)')
		await m.reply(result);
	} catch (error) {
		await m.reply("_Daily limit over_")
	}
})