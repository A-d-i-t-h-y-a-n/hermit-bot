const {
    Function,
    isPublic,
    Fancy,
    prefix,
    formatBytes,
    commands
} = require('../lib/');

const {
    BOT_INFO,
    MODE,
    PREFIX,
    VERSION
} = require('../config');
const os = require('os');

Function({
    pattern: 'menu',
    fromMe: isPublic,
    type: 'info'
}, async (message) => {
    const commandslist = {};

    commands.forEach(command => {
        if (command.dontAddCommandList === false && command.pattern !== undefined) {
            let match;
            let mmatch;

            try {
                match = command.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/);
                mmatch = command.pattern.toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
            } catch {
                match = [command.pattern];
            }

            const HANDLER = /\[(\W*)\]/.test(PREFIX) ? PREFIX.match(/\[(\W*)\]/)[1][0] : '.';
            if (!commandslist[command.type]) commandslist[command.type] = [];
            commandslist[command.type].push((match.length >= 3 ? (HANDLER + mmatch) : command.pattern).trim());
        }
    });

    let msg = `╭━━━〔 ${BOT_INFO.split(";")[0]} ⁩〕━━━┈⊷
┃✵╭──────────────
┃✵│ Owner : ${BOT_INFO.split(";")[1]}
┃✵│ User : ${message.pushName.replace(/[\r\n]+/gm, "")}
┃✵│ Plugins : ${commands.length}
┃✵│ Runtime : ${runtime(process.uptime())}
┃✵│ Mode : ${MODE}
┃✵│ Platform : ${os.platform()}
┃✵│ Ram : ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}
┃✵│ Version : ${VERSION}
┃✵╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
`;

    for (const command in commandslist) {
        msg += `╭─────────────┈⊷
│ 「 *${await Fancy(command.toUpperCase(), 32)}* 」 
╰┬────────────┈⊷\n┌┤\n`;

        for (const plugin of commandslist[command]) {
            msg += `││◦➛ ${await Fancy(plugin.toLowerCase(), 32)}\n`;
        }

        msg += `│╰────────────┈⊷
╰─────────────┈⊷
`;
    }

    await message.send(msg);
});


const runtime = function(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " d " : " d ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " h " : " h ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " m " : " m ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

exports.runtime = runtime;