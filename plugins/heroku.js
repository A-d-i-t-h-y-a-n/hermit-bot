const simpleGit = require('simple-git');
const git = simpleGit();
const Config = require('../config');
const {Function,updatecheck,updatestart,formatTime,addCommand} = require("../lib/");
const Heroku = require('heroku-client');
const heroku = new Heroku({token: Config.HEROKU.API_KEY})
let baseURI = "/apps/" + Config.HEROKU.APP_NAME
Function({pattern: "restart ?(.*)", fromMe: true, desc: 'Restart the bot', type: 'heroku'}, async (m, client) => {
 await m.reply("_Restarting_")
console.log(baseURI)
await heroku.delete(baseURI + "/dynos").catch(async (error) => {
await m.reply("*Check Heroku app name in Heroku app settings*\n*Update Heroku api key in Heroku app settings*")
});
});

Function({pattern: 'shutdown ?(.*)', fromMe: true, type: 'heroku'}, async (m, client) => {
await heroku.get(baseURI + '/formation').then(async (formation) => {
forID = formation[0].id;
await m.reply("*Shutting down.. ❌*")
await heroku.patch(baseURI + '/formation/' + forID, {
body: {
quantity: 0
}});
}).catch(async (err) => {
await m.reply(error.message)
});
});

Function({pattern: 'setvar ?(.*)', fromMe: true, desc: "Set heroku config var", type: 'heroku'}, async (m, text, client) => {
if (text === "") return await m.reply("```Either Key or Value is missing```")
if ((varKey = text.split(":")[0]) && (varValue = text.split(":")[1])) {
await heroku.patch(baseURI + '/config-vars', {
body: {
[varKey.toUpperCase()]: varValue
}}).then(async (app) => {
done = 'Successfully Set ' + '```' + varKey + '➜' + varValue + '```'
await m.reply(done);
});} else {await m.reply("*Check Heroku app name in Heroku app settings*\n*Update Heroku api key in Heroku app settings*");}
});
Function({pattern: 'delvar ?(.*)', fromMe: true, desc: "Delete heroku config var", type: 'heroku'}, async (m, text, client) => {
if (text === "") return await m.reply("```Either Key or Value is missing```");
await heroku.get(baseURI + '/config-vars').then(async (vars) => {
key = text.trim();
for (vr in vars) {
if (key == vr) {
await heroku.patch(baseURI + '/config-vars', {
body: {
[key.toUpperCase()]: null
}}); return await m.reply("```{} successfully deleted```".replace('{}', key));
}}
await m.reply("```No results found for this key```");}).catch(async (error) => {await m.reply("*Check Heroku app name in Heroku app settings*\n*Update Heroku api key in Heroku app settings*");
});
});

Function({pattern: 'getvar ?(.*)', fromMe: true, desc: "Get heroku config var", type: 'heroku'}, async (m, text, client) => {
if (text === "") return await m.reply("```Either Key or Value is missing```")
await heroku.get(baseURI + '/config-vars').then(async (vars) => {
for (vr in vars) {
if (text.trim().toUpperCase() == vr) return await m.reply('_{} : {}_'.replace('{}', vr).replace('{}', vars[vr]));
}
await m.reply("```No results found for this key```");
}).catch(async (error) => {
await m.reply("*Check Heroku app name in Heroku app settings*\n*Update Heroku api key in Heroku app settings*");
});
});

Function({pattern: "allvar ?(.*)", fromMe: true, desc: "Shows all vars in Heroku APP settings.", type: 'heroku'}, async (m, text, client) => {
let msg = "```Here your all Heroku vars\n\n\n"
await heroku.get(baseURI + "/config-vars")
.then(async (keys) => {
for (let key in keys) {
msg += `${key} : ${keys[key]}\n\n`}
return await m.reply(msg + "```")
}).catch(async (error) => {
await m.reply("*Check Heroku app name in Heroku app settings*\n*Update Heroku api key in Heroku app settings*")
})
});

Function({pattern: 'update ?(.*)', fromMe: true, dontAddCommandList: true, desc: "Checks or start bot updates", type: 'heroku'}, async (m, text, client) => {
if (!text || text === "check") {
let n = await updatecheck()
if (n === 500) return await m.reply('Bot is completely up-to-date!')
var up = "ɴᴇᴡ ᴜᴘᴅᴀᴛᴇ ᴀᴠᴀɪʟᴀʙʟᴇ ғᴏʀ ʙᴏᴛ!\n\nᴄʜᴀɴɢᴇs:\n"
n['all'].map((c) => {up += '[' + c.date.substring(0, 10) + ']: ' + c.message + '\n';});
await client.sendMessage(m.chat, { text: up})
} else if (text === "start") {
let n = await updatecheck()
if (n === 500) return await m.reply('Bot is completely up-to-date!')
await m.reply("_Build started_")
let us = await updatestart(m)
if (n === 404) return await m.reply("*Your Heroku information is wrong!*")
if (n === 408) return await m.reply("_Your account has reached its concurrent builds limit!. Please wait for the other app to finish its deploy_")
if (n === 200) return await m.reply("_Successfully Updated!_")
} else {
await client.sendMessage(m.chat, { text: 'Update Manager', templateButtons: [{index: 1, quickReplyButton: {displayText: 'Update Check', id: 'update check'}},{index: 2, quickReplyButton: {displayText: 'Update Start', id: '.update start'}},]})
}
});