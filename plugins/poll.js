const { Function } = require('../lib/')
const { randomBytes } = require('crypto')
const { WAProto } = require('@adiwajshing/baileys')
Function({
	pattern: 'poll ?(.*)',
	fromMe: true,
	desc: 'send poll message',
	type: 'whatsapp'
}, async (message, match) => {
if (!match) return await message.send('_Need options!_\n*Example: poll head,option1,option2,option3....*')
const m = {}
match = match.split(',')
const buttons = []
for (let i = 1; i < match.length; i++) {
buttons.push(match[i])
}
const arr = randomBytes(32)
m.messageContextInfo = {
messageSecret: arr
}
m.pollCreationMessage = WAProto.Message.PollCreationMessage.fromObject({
name: match[0],
selectableOptionsCount: 0,
options: buttons.map(
value => WAProto.Message.PollCreationMessage.Option.fromObject({
optionName: value
}),
)
})
await message.client.relayMessage(message.jid, m, {});
})