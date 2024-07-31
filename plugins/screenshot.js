const { Function, isPublic, getUrl } = require("../lib/");

Function({
    pattern: 'ss ?(.*)',
    fromMe: isPublic,
    desc: 'Take a website screenshot',
    type: 'download'
}, async (message, match) => {
    match = getUrl(match || message.reply_message.text);
    if (!match) return await message.send('_Need a URL_\n*Example: ss https://example.com/*');
    
    const screenshotUrl = `https://hermit-api.koyeb.app/screenshot?url=${encodeURIComponent(match)}`;
    await message.send(screenshotUrl, 'image');
});

Function({
    pattern: 'fullss ?(.*)',
    fromMe: isPublic,
    desc: 'Take a full website screenshot',
    type: 'download'
}, async (message, match) => {
    match = getUrl(match || message.reply_message.text);
    if (!match) return await message.send('_Need a URL_\n*Example: fullss https://example.com/*');
    
    const fullScreenshotUrl = `https://hermit-api.koyeb.app/screenshot?full=true&url=${encodeURIComponent(match)}`;
    await message.send(fullScreenshotUrl, 'image');
});
