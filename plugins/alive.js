const {
	Function,
	isPublic,
	sendAlive,
	runtime,
	chatBot,
	isChatBot,
	chatbot
} = require("../lib/");
const config = require('../config')

Function({
	pattern: 'ping ?(.*)',
	fromMe: isPublic,
	desc: 'Bot response in second.',
	type: 'info'
}, async (message, match, client) => {
	var start = new Date().getTime();
	var msg = await message.reply('*Pinging...*');
	var end = new Date().getTime();
	var responseTime = end - start;
	await msg.edit(`*Pong!*\nLatency: ${responseTime}ms`);
	return await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: config.ALIVE_MSG},{quoted: mek})
}catch(e){
});

Function({
	const config = require('../config')
const {cmd , commands} = require('../command')
cmd({
    pattern: "alive",
    react: "🌐",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
return await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: config.ALIVE_MSG},{quoted: mek})
}catch(e){
console.log(e)
reply(`${e}`)
}
})

Function({
	pattern: 'jid',
	fromMe: isPublic,
	desc: 'to get remoteJid',
	type: 'whatsapp'
}, async (message) => {
	await message.reply(message.mentionedJid[0] ? message.mentionedJid[0] : message.quoted ? message.quoted.sender : message.chat)
});

Function({
	pattern: 'runtime',
	fromMe: isPublic,
	desc: 'get bots runtime',
	type: 'info'
}, async (message, match, client) => {
	await message.send(await runtime(process.uptime()));
});

Function({
	pattern: 'chatbot ?(.*)',
	fromMe: true,
	desc: 'set chat bot',
	type: 'ai'
}, async (message, match) => {
	await chatBot(message, match)
});

Function({
	on: 'text',
	fromMe: false
}, async (message, match) => {
	if (!await isChatBot(message)) return
	if (!message.reply_message) return
	if (!message.reply_message.data.key.fromMe) return
	await message.reply(await chatbot(message))
})
