const {
    Function,
    Imgur,
    isPublic,
    Vector
} = require("../lib/");
const ffmpeg = require('fluent-ffmpeg');

Function({
    pattern: 'url ?(.*)',
    fromMe: isPublic,
    desc: 'Upload files to imgur.com',
    type: 'media'
}, async (message, match, client) => {
    if (!message.reply_message) return message.reply("_Reply to a video/image/audio!_");
    
    if (/image/.test(message.mine)) {
        const media = await message.reply_message.downloadAndSaveMedia();
        const res = await Imgur(media);
        await message.reply(res.link);
    } else if (/video/.test(message.mine)) {
        const media = await message.reply_message.downloadAndSaveMedia();
        const res = await Imgur(media);
        await message.reply(res.link);
    } else if (/audio/.test(message.mine)) {
        try {
            const media = await message.reply_message.downloadAndSaveMedia();
            ffmpeg(media)
                .outputOptions(["-y", "-filter_complex", "[0:a]showvolume=f=1:b=4:w=720:h=68,format=yuv420p[vid]", "-map", "[vid]", "-map 0:a"])
                .save('output.mp4')
                .on('end', async () => {
                    const res = await Imgur('output.mp4');
                    await message.reply(res.link);
                });
        } catch (e) {
            await message.reply(e.message);
        }
    } else {
        return message.reply("_Reply to a video/image/audio!_");
    }
});
