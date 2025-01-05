const {
    Function,
    isPublic,
    instagram,
    getJson,
    postJson,
    getUrl
} = require('../lib/');

Function({
    pattern: 'insta ?(.*)',
    fromMe: isPublic,
    desc: 'Download Instagram posts or reels',
    type: 'download'
}, async (message, match, client) => {
    match = getUrl(match || message.reply_message.text);
    if (!match) return await message.reply('*Need an Instagram link!*');
    
    try {
        const { result, status } = await getJson('https://api-25ca.onrender.com/api/instagram?url=' + match);
        if (!status || result.length < 1) return await message.reply('*No media found!*');
        
        for (const url of result) {
            await message.sendFromUrl(url);
        }
    } catch (error) {
        console.error(error);
        await message.reply('*Failed to fetch media.*\n_Please try again later._');
    }
});

Function({
    pattern: 'story ?(.*)',
    fromMe: isPublic,
    desc: 'Download Instagram stories',
    type: 'download'
}, async (message, match) => {
    try {
        match = match || message.reply_message.text;
        if (!match || (!match.includes("/stories/") && !match.startsWith("http"))) {
            return await message.reply('*Provide a valid URL or username.*');
        }
        
        if (match.includes("/stories/")) {
            const index = match.indexOf("/stories/") + 9;
            const lastIndex = match.lastIndexOf("/");
            match = match.substring(lastIndex, index);
        }
        
        const response = await getJson(apiUrl + 'story?url=https://instagram.com/stories/' + match);
        if (!response.status || response.result.length < 1) return await message.reply('*No media found!*');
        
        for (const url of response.result) {
            await message.sendFromUrl(url);
        }
    } catch (error) {
        console.error(error);
        await message.send('*Failed to download.*\n_Server may be down_\n_Please try again later._');
    }
});

Function({
    pattern: 'ig ?(.*)',
    fromMe: isPublic,
    desc: 'Get Instagram profile information',
    type: 'info'
}, async (message, match, client) => {
    match = match.match(/instagram\.com\/([a-zA-Z0-9_]+)/)?.[1] || match;
    if (!match) return await message.reply('*Provide an Instagram profile URL or username.*');
    
    try {
        const result = await getJson(apiUrl + 'ig/' + match);
        if (!result.status) return await message.send('*Invalid username or URL.*');
        
        await message.send(result.profile, 'image', {
            caption: `*Name:* ${result.name}\n*Username:* ${result.username}\n*Followers:* ${result.followers}\n*Following:* ${result.following}\n*Posts:* ${result.post}\n*Bio:* ${result.bio}`
        });
    } catch (error) {
        console.error(error);
        await message.send('*Failed to fetch profile information.*\n_Please try again later._');
    }
});

Function({
    pattern: 'fb ?(.*)',
    fromMe: isPublic,
    desc: 'Download Facebook videos',
    type: 'download'
}, async (message, match) => {
    match = getUrl(match || message.reply_message.text);
    if (!match) return await message.reply('*Need a Facebook link!*');
    
    try {
        const response = await getJson(apiUrl + 'api/convert?url=' + match);
        if (!response.status || (!response.hd && !response.sd)) return await message.reply('*No media found!*');
        
        await message.send(response.hd?.url || response.sd?.url, 'video', { caption: response.meta?.title || '' });
    } catch (error) {
        console.error(error);
        await message.reply('*Failed to fetch video.*\n_Please try again later._');
    }
});
