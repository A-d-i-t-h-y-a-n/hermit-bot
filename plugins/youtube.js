const {
  Function,
  addAudioMetaData,
  isUrl,
  getBuffer,
  prefix,
  isPublic,
  ytIdRegex,
  getJson,
  toAudio,
  h2k
} = require('../lib/');
const yts = require("yt-search");
const config = require('../config');
const fs = require('fs');

Function({
  pattern: 'play ?(.*)',
  fromMe: isPublic,
  desc: 'play youtube audio',
  type: 'download'
}, async (message, match, client) => {
  match = match || message.reply_message.text;
  if (!match) return await message.reply('*Need text!*\n_Example: .play astronaut in the ocean_');
  
  try {
    const search = await yts(match);
    if (search.videos.length < 1) return await message.reply('_No results found_');
    
    const video = search.videos[0];
    const apiUrl = `https://api-25ca.onrender.com/api/yta?url=${encodeURIComponent(video.url)}&format=mp3`;
    
    await message.reply(`_Downloading: ${video.title}_`);
    
    const result = await getJson(apiUrl);
    
    if (!result.status) {
      return await message.reply('_Failed to download audio_');
    }
    
    const audioBuffer = await getBuffer(result.result.download);
    const thumbBuffer = await getBuffer(result.result.thumbnail);
    
    const writer = await addAudioMetaData(
      await toAudio(audioBuffer),
      thumbBuffer,
      result.result.title,
      `${config.BOT_INFO.split(";")[0]}`,
      'Hermit Official'
    );
    
    await message.client.sendMessage(message.jid, {
      audio: writer,
      mimetype: 'audio/mpeg'
    }, { quoted: message.data });
    
  } catch (error) {
    console.error('Error:', error);
    return message.reply(`Error: ${error.message || 'Unknown error occurred'}`);
  }
});

Function({
  pattern: 'song ?(.*)',
  fromMe: isPublic,
  desc: 'Download audio from YouTube',
  type: 'download'
}, async (message, match, client) => {
  match = match || message.reply_message.text;
  if (!match) return message.reply('_Need URL or song name!_\n*Example: .song URL/song name*');
  
  try {
    let videoUrl;
    
    if (isUrl(match) && match.includes('youtu')) {
      videoUrl = match;
    } else {
      const search = await yts(match);
      if (search.videos.length < 1) return await message.reply('_No results found_');
      videoUrl = search.videos[0].url;
    }
    
    const apiUrl = `https://api-25ca.onrender.com/api/yta?url=${encodeURIComponent(videoUrl)}&format=mp3`;
    
    await message.reply('_Downloading audio..._');
    
    const result = await getJson(apiUrl);
    
    if (!result.status) {
      return await message.reply('_Failed to download audio_');
    }
    
    const audioBuffer = await getBuffer(result.result.download);
    const thumbBuffer = await getBuffer(result.result.thumbnail);
    
    const writer = await addAudioMetaData(
      await toAudio(audioBuffer),
      thumbBuffer,
      result.result.title,
      `${config.BOT_INFO.split(";")[0]}`,
      'Hermit Official'
    );
    
    await message.client.sendMessage(message.jid, {
      audio: writer,
      mimetype: 'audio/mpeg'
    }, { quoted: message.data });
    
  } catch (error) {
    console.error('Error:', error);
    return message.reply(`Error: ${error.message || 'Unknown error occurred'}`);
  }
});

Function({
  pattern: 'video ?(.*)',
  fromMe: isPublic,
  desc: 'Download video from YouTube',
  type: 'download'
}, async (message, match, client) => {
  match = match || message.reply_message.text;
  if (!match) return message.reply('_Need URL or video name!_\n*Example: .video URL/video name*');
  
  try {
    let videoUrl;
    
    if (isUrl(match) && match.includes('youtu')) {
      videoUrl = match;
    } else {
      const search = await yts(match);
      if (search.videos.length < 1) return await message.reply('_No results found_');
      videoUrl = search.videos[0].url;
    }
    
    const apiUrl = `https://api-25ca.onrender.com/api/ytv?url=${encodeURIComponent(videoUrl)}&format=360`;
    
    await message.reply('_Downloading video..._');
    
    const result = await getJson(apiUrl);
    
    if (!result.status) {
      return await message.reply('_Failed to download video_');
    }
    
    await message.send(result.result.download, 'video', {
      quoted: message.data,
      caption: result.result.title
    });
    
  } catch (error) {
    console.error('Error:', error);
    return message.reply(`Error: ${error.message || 'Unknown error occurred'}`);
  }
});

Function({
  pattern: 'yta ?(.*)',
  fromMe: isPublic,
  desc: 'Download audio from YouTube',
  type: 'download'
}, async (message, match, client) => {
  match = match || message.reply_message.text;
  if (!match) return message.reply('_Need URL or song name!_\n*Example: .yta URL/song name*');
  
  try {
    let videoUrl;
    let format = 'mp3';
    
    if (match.includes('format:')) {
      const parts = match.split('format:');
      match = parts[0].trim();
      format = parts[1].trim();
    }
    
    if (isUrl(match) && match.includes('youtu')) {
      videoUrl = match;
    } else {
      const search = await yts(match);
      if (search.videos.length < 1) return await message.reply('_No results found_');
      videoUrl = search.videos[0].url;
    }
    
    const apiUrl = `https://api-25ca.onrender.com/api/yta?url=${encodeURIComponent(videoUrl)}&format=${format}`;
    
    await message.reply('_Downloading audio..._');
    
    const result = await getJson(apiUrl);
    
    if (!result.status) {
      return await message.reply('_Failed to download audio_');
    }
    
    const audioBuffer = await getBuffer(result.result.download);
    const thumbBuffer = await getBuffer(result.result.thumbnail);
    
    const writer = await addAudioMetaData(
      await toAudio(audioBuffer),
      thumbBuffer,
      result.result.title,
      `${config.BOT_INFO.split(";")[0]}`,
      'Hermit Official'
    );
    
    await message.client.sendMessage(message.jid, {
      audio: writer,
      mimetype: 'audio/mpeg'
    }, { quoted: message.data });
    
  } catch (error) {
    console.error('Error:', error);
    return message.reply(`Error: ${error.message || 'Unknown error occurred'}`);
  }
});

Function({
  pattern: 'ytv ?(.*)',
  fromMe: isPublic,
  desc: 'Download video from YouTube',
  type: 'download'
}, async (message, match, client) => {
  match = match || message.reply_message.text;
  if (!match) return message.reply('_Need URL or video name!_\n*Example: .ytv URL/video name*');
  
  try {
    let videoUrl;
    let format = '360';
    
    if (match.includes('format:')) {
      const parts = match.split('format:');
      match = parts[0].trim();
      format = parts[1].trim();
    }
    
    if (isUrl(match) && match.includes('youtu')) {
      videoUrl = match;
    } else {
      const search = await yts(match);
      if (search.videos.length < 1) return await message.reply('_No results found_');
      videoUrl = search.videos[0].url;
    }
    
    const apiUrl = `https://api-25ca.onrender.com/api/ytv?url=${encodeURIComponent(videoUrl)}&format=${format}`;
    
    await message.reply('_Downloading video..._');
    
    const result = await getJson(apiUrl);
    
    if (!result.status) {
      return await message.reply('_Failed to download video_');
    }
    
    await message.send(result.result.download, 'video', {
      quoted: message.data,
      caption: result.result.title
    });
    
  } catch (error) {
    console.error('Error:', error);
    return message.reply(`Error: ${error.message || 'Unknown error occurred'}`);
  }
});