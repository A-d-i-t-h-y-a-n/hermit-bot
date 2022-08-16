const {Function,getString,PREFIX} = require('../lib/')
const sql = require('../lib/database/greetings');
const Lang = getString('greetings');
Function({pattern: 'welcome ?(.*)', fromMe: true, desc: 'it sets the welcome message', type: 'group'}, async (m, text, client) => {
if (!text) {
client.sendMessage(m.chat, { text: 'Welcome Message Manager', templateButtons: [
{index: 1, quickReplyButton: {displayText: 'ON', id: PREFIX + 'welcome on'}},
{index: 2, quickReplyButton: {displayText: 'OFF', id: PREFIX + 'welcome off'}},
{index: 3, quickReplyButton: {displayText: 'GET', id: PREFIX + 'welcome get'}},
]})
return;
}
if (text === "on") {
let msg = await sql.enableMessage(m.jid);
if (!msg) return m.reply(Lang.NOT_SET_WELCOME)
await sql.enableMessage(m.jid);
await m.reply(`_Welcome ${text == 'on' ? 'Activated' : 'Deactivated'}_`)
} else if (text === "off") {
let msg = await sql.getMessage(m.jid);
if (!msg) return m.reply(Lang.NOT_SET_WELCOME)
await m.reply(`_Welcome ${text == 'on' ? 'Activated' : 'Deactivated'}_`)
await sql.disableMessage(m.jid);
} else if (text === "delete") {
let msg = await sql.getMessage(m.jid);
if (!msg) return m.reply(Lang.NOT_SET_WELCOME)
await sql.deleteMessage(m.jid, 'welcome');
await m.reply(Lang.WELCOME_DELETED); 
} else if (text === "get") {
let msg = await sql.getMessage(m.jid);
if (!msg) return m.reply(Lang.NOT_SET_WELCOME)
const update = {}
update.id = m.chat
update.participants = [m.sender]
update.action = 'add'
await client.ev.emit('group-participants.update', update)
m.reply(msg.message)
} else {
await sql.setMessage(m.jid, 'welcome', text);
const update = {}
update.id = m.chat
update.participants = [m.sender]
update.action = 'add'
await client.ev.emit('group-participants.update', update)
await m.reply('_Welcome Updated_')
}
})

Function({pattern: 'goodbye ?(.*)', fromMe: true, desc: 'it sets the goodbye message', type: 'group'}, async (m, text, client) => {
if (!text) {
client.sendMessage(m.chat, { text: 'goodbye Message Manager', templateButtons: [
{index: 1, quickReplyButton: {displayText: 'ON', id: 'goodbye on'}},
{index: 2, quickReplyButton: {displayText: 'OFF', id: 'goodbye off'}},
{index: 3, quickReplyButton: {displayText: 'GET', id: 'goodbye get'}},
]})
return;
}
if (text === "on") {
let msg = await sql.enableMessage(m.jid);
if (!msg) return m.reply(Lang.NOT_SET_GOODBYE)
await sql.enableMessage(m.jid);
await m.reply(`_goodbye ${text == 'on' ? 'Activated' : 'Deactivated'}_`)
} else if (text === "off") {
let msg = await sql.getMessage(m.jid, 'goodbye');
if (!msg) return m.reply(Lang.NOT_SET_GOODBYE)
await m.reply(`_goodbye ${text == 'on' ? 'Activated' : 'Deactivated'}_`)
await sql.disableMessage(m.jid);
} else if (text === "delete") {
let msg = await sql.getMessage(m.jid, 'goodbye');
if (!msg) return m.reply(Lang.NOT_SET_GOODBYE)
await sql.deleteMessage(m.jid, 'goodbye');
await m.reply(Lang.goodbye_DELETED); 
} else if (text === "get") {
let msg = await sql.getMessage(m.jid, 'goodbye');
if (!msg) return m.reply(Lang.NOT_SET_GOODBYE)
const update = {}
update.id = m.chat
update.participants = [m.sender]
update.action = 'remove'
await client.ev.emit('group-participants.update', update)
m.reply(msg.message)
} else {
await sql.setMessage(m.jid, 'goodbye', text);
const update = {}
update.id = m.chat
update.participants = [m.sender]
update.action = 'remove'
await client.ev.emit('group-participants.update', update)
await m.reply('_goodbye Updated_')
}
})