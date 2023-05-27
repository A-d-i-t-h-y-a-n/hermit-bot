const {
	Function,
	antiWord,
	antiLink,
	Database
} = require('../lib/');
const antibot = new Database('antibot');

Function({
	pattern: 'antiword ?(.*)',
	fromMe: true,
	desc: 'set antiword',
	type: 'group'
}, async (message, match) => {
	await antiWord(message, match, client)
})

Function({
	pattern: 'antilink ?(.*)',
	fromMe: true,
	desc: 'set antilink',
	type: 'group'
}, async (message, match, client) => {
	await antiLink(message, match, client)
})

Function({
  pattern: 'antibot ?(.*)',
  fromMe: true,
  desc: 'set antibot',
  type: 'group'
}, async (message, match, client) => {
  if (!message.isGroup) return await message.reply('*This cmd only for groups*')
  if (!match || (match !== 'on' && match !== 'off')) return await message.reply('_Please provide a valid match option._ *Use either "on" or "off".*');
  if (match === 'on') {
    await antibot.set(message.chat, true);
    await message.send('_Antibot Activated_');
  } else if (match === 'off') {
    await antibot.delete(message.chat)
    await message.send('_Antibot Deactivated_');
  }
});