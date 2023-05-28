const { Function, isPublic } = require('../lib/');
const config = require('../config');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const googleTTS = require('google-tts-api');

const convertTextToSound = async (text, lang) => {
  try {
    const options = {
      lang: lang,
      slow: false,
      host: 'https://translate.google.com'
    };

    const audioBase64Array = await googleTTS.getAllAudioBase64(text, options);
    const base64Data = audioBase64Array.map((audio) => audio.base64).join();
    const fileData = Buffer.from(base64Data, 'base64');
    fs.writeFileSync('tts.mp3', fileData, { encoding: 'base64' });

    return new Promise((resolve) => {
      ffmpeg('tts.mp3')
        .audioCodec('libopus')
        .save('tts.opus')
        .on('end', async () => {
          resolve(fs.readFileSync('tts.opus'));
        });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

Function({
    pattern: 'tts ?(.*)',
    fromMe: isPublic,
    desc: 'It converts text to sound.',
    type: 'misc'
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('_Need Text!_\n_Example: tts Hello_\n_tts Hello {en}_');
    let LANG = config.LANG.toLowerCase();
    const lang = match.match("\\{([a-z]+)\\}");
    if (lang) {
      match = match.replace(lang[0], '');
      LANG = lang[1];
    }
    const audioData = await convertTextToSound(match, LANG);
    await message.client.sendMessage(message.chat, { audio: audioData, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: message.data });
});
