const {Function,getString} = require('../lib/')
const sql = require('../lib/database/greetings');
const Lang = getString('greetings');
Function({pattern: 'welcome ?(.*)', fromMe: true, desc: Lang.WELCOME_DESC, type: 'group'}, async (m, text, client) => {
if (!text) {
client.sendMessage(m.chat, { text: 'Welcome Message Manager', templateButtons: [
{index: 1, quickReplyButton: {displayText: 'ON', id: 'welcome on'}},
{index: 2, quickReplyButton: {displayText: 'OFF', id: 'Welcome off'}},
{index: 3, quickReplyButton: {displayText: 'GET', id: 'Welcome get'}},
]})
return;
}
if (m.match[0] === "on") {
let msg = await sql.enableMessage(m.jid);
if (!msg) return m.reply(Lang.NOT_SET_WELCOME)
await sql.enableMessage(m.jid);
await m.reply(`_Welcome ${m.match[0] == 'on' ? 'Activated' : 'Deactivated'}_`)
} else if (m.match[0] === "off") {
let msg = await sql.getMessage(m.jid);
if (!msg) return m.reply(Lang.NOT_SET_WELCOME)
await m.reply(`_Welcome ${m.match[0] == 'on' ? 'Activated' : 'Deactivated'}_`)
await sql.disableMessage(m.jid);
} else if (m.match[0] === "delete") {
let msg = await sql.getMessage(m.jid);
if (!msg) return m.reply(Lang.NOT_SET_WELCOME)
await sql.deleteMessage(m.jid, 'welcome');
await m.reply(Lang.WELCOME_DELETED); 
} else if (m.match[0] === "get") {
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

Function({pattern: 'goodbye ?(.*)', fromMe: true, desc: Lang.goodbye_DESC, type: 'group'}, async (m, text, client) => {
if (!text) {
client.sendMessage(m.chat, { text: 'goodbye Message Manager', templateButtons: [
{index: 1, quickReplyButton: {displayText: 'ON', id: 'goodbye on'}},
{index: 2, quickReplyButton: {displayText: 'OFF', id: 'goodbye off'}},
{index: 3, quickReplyButton: {displayText: 'GET', id: 'goodbye get'}},
]})
return;
}
if (m.match[0] === "on") {
let msg = await sql.enableMessage(m.jid);
if (!msg) return m.reply(Lang.NOT_SET_GOODBYE)
await sql.enableMessage(m.jid);
await m.reply(`_goodbye ${m.match[0] == 'on' ? 'Activated' : 'Deactivated'}_`)
} else if (m.match[0] === "off") {
let msg = await sql.getMessage(m.jid, 'goodbye');
if (!msg) return m.reply(Lang.NOT_SET_GOODBYE)
await m.reply(`_goodbye ${m.match[0] == 'on' ? 'Activated' : 'Deactivated'}_`)
await sql.disableMessage(m.jid);
} else if (m.match[0] === "delete") {
let msg = await sql.getMessage(m.jid, 'goodbye');
if (!msg) return m.reply(Lang.NOT_SET_GOODBYE)
await sql.deleteMessage(m.jid, 'goodbye');
await m.reply(Lang.goodbye_DELETED); 
} else if (m.match[0] === "get") {
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