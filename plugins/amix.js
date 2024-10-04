const { Function } = require('../lib/');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

Function({
  pattern: 'amix ?(.*)',
  fromMe: isPublic,
  desc: 'Mix two audio files',
  type: 'media'
}, async (message, match, client) => {
  const mixDir = './media/amix';

  await fs.mkdir(mixDir, { recursive: true }).catch(err => {
    return message.reply('Error creating directory');
  });

  const usage = `Usage:
  *.amix a* - _Add main audio_
  *.amix bg* - _Add background audio_
  *.amix clean* - Clean the amix directory_
  *.amix mix* [--a volume] [--bg volume] - Mix audios _(optional: adjust volumes)_
  *Example* : .amix mix --a 1 --bg 0.5`;

  if (!match) return await message.reply(usage);

  const command = match.split(' ')[0].toLowerCase();

  switch (command) {
    case 'a':
    case 'bg':
      if (!message.reply_message || !message.reply_message.audio) {
        return await message.reply(`_Reply to an audio message to add as ${command === 'a' ? 'main' : 'background'} audio_`);
      }

      const media = await message.reply_message.downloadAndSaveMedia();
      const fileName = `${command === 'a' ? 'main' : 'background'}_audio.mp3`;

      await fs.writeFile(path.join(mixDir, fileName), await fs.readFile(media))
        .then(() => message.reply(`_${fileName.split('_').join(' ')} added_`))
        .catch(err => message.reply('Error saving audio file'));

      break;

    case 'mix':
      const mainAudio = path.join(mixDir, 'main_audio.mp3');
      const backgroundAudio = path.join(mixDir, 'background_audio.mp3');
      const output = path.join(mixDir, 'mixed_audio.mp3');

      if (!await fileExists(mainAudio) || !await fileExists(backgroundAudio)) {
        return await message.reply('_Both main and background audio files must be added before mixing_');
      }

      const options = match.split(' ');
      let mainVolume = 1;
      let bgVolume = 0.3;

      for (let i = 1; i < options.length; i += 2) {
        if (options[i] === '--a' && options[i + 1]) {
          mainVolume = parseFloat(options[i + 1]);
        } else if (options[i] === '--bg' && options[i + 1]) {
          bgVolume = parseFloat(options[i + 1]);
        }
      }

      await mixAudio(mainAudio, backgroundAudio, output, mainVolume, bgVolume)
        .then(async () => {
          await message.reply('Audio mixing completed. Sending the result...');
          await client.sendMessage(message.jid, {
            audio: { url: output },
            mimetype: 'audio/mpeg',
            ptt: true
          });
        })
        .catch(err => message.reply(`Error during audio mixing: ${err.message}`));

      break;

    case 'clean':
      await cleanDirectory(mixDir)
        .then(() => message.reply('_amix directory cleaned_'))
        .catch(err => message.reply('Error cleaning directory'));

      break;

    case 'help':
    default:
      await message.reply(usage);
  }
});

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function cleanDirectory(directory) {
  const files = await fs.readdir(directory);
  await Promise.all(files.map(file => fs.unlink(path.join(directory, file))));
}

function mixAudio(mainAudio, backgroundMusic, output, mainVolume = 1, bgVolume = 0.3) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-i', mainAudio,
      '-i', backgroundMusic,
      '-filter_complex', `[0:a]volume=${mainVolume}[main];[1:a]volume=${bgVolume}[bg];[main][bg]amerge=inputs=2[out]`,
      '-map', '[out]',
      '-c:a', 'libmp3lame',
      output
    ]);

    ffmpeg.stderr.on('data', (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
}
