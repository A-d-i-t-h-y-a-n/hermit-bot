const {
    Function
} = require('../lib/');

var AFK = {
    isAfk: false,
    reason: false,
    lastseen: 0
};

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

Function({
    on: 'text',
    fromMe: false
}, async (message, match) => {
    if (AFK.isAfk && ((!message.jid.includes('@g.us')) || (message.jid.includes('@g.us') &&
            ((message.mention !== false && message.mention.length !== 0) || message.reply_message !== false)))) {
        if (message.jid.includes('@g.us') && (message.mention !== false && message.mention.length !== 0)) {
            message.mention.map(async (jid) => {
                if (message.client.user.jid.split('@')[0] === jid.split('@')[0]) {
                    await message.send("I'm currently away from keyboard." +
                        (AFK.reason !== false ? '\n*Reason:* ```' + AFK.reason + '```' : '') +
                        (AFK.lastseen !== 0 ? '\n*Last Seen:* ```' + secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen) + ' ago```' : ''), {
                            quoted: message.data
                        });
                }
            })
        } else if (message.jid.includes('@g.us') && message.reply_message !== false) {
            if (message.reply_message.jid.split('@')[0] === message.client.user.jid.split('@')[0]) {
                await message.send("I'm currently away from keyboard." +
                    (AFK.reason !== false ? '\n*Reason:* ```' + AFK.reason + '```' : '') +
                    (AFK.lastseen !== 0 ? '\n*Last Seen:* ```' + secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen) + ' ago```' : ''), {
                        quoted: message.data
                    });
            }
        } else {
            await message.send("I'm currently away from keyboard." +
                (AFK.reason !== false ? '\n*Reason:* ```' + AFK.reason + '```' : '') +
                (AFK.lastseen !== 0 ? '\n*Last Seen:* ```' + secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen) + ' ago```' : ''), {
                    quoted: message.data
                });
        }
    }
});

Function({
    on: 'text',
    fromMe: true
}, async (message, match) => {
    if (AFK.isAfk && !message.id.startsWith('3EB0')) {
        AFK.lastseen = 0;
        AFK.reason = false;
        AFK.isAfk = false;
        await message.send("I'm no longer away from keyboard.");
    }
});

Function({
    pattern: 'afk ?(.*)',
    fromMe: true,
    desc: "Sets your status as away from keyboard (AFK)."
}, async (message, match) => {
    if (!AFK.isAfk) {
        AFK.lastseen = Math.round((new Date()).getTime() / 1000);
        if (match !== '') {
            AFK.reason = match;
        }
        AFK.isAfk = true;

        await message.send("I'm now away from keyboard." + (AFK.reason !== false ? ('\n*Reason:* ```' + AFK.reason + '```') : ''));
    }
});

module.exports = {
    secondsToHms
};
