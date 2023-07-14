const { Function, isPublic, getJson } = require('../lib/');
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
    if (!(match || message.quoted.text)) return await message.reply('_Need Text!_\n_Example: tts Hello_\n_tts Hello {en}_');
    let LANG = config.LANG.toLowerCase();
    const lang = match.match("\\{([a-z]+)\\}");
    if (lang) {
      match = match.replace(lang[0], '');
      LANG = lang[1];
      if (message.quoted.text) match = message.reply_message.text;
    }
    const audioData = await convertTextToSound(match, LANG);
    await message.client.sendMessage(message.chat, { audio: audioData, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: message.data });
});

const _0x454191=_0x2f47;!function(e,t){const n=_0x2f47,a=_0xd7e2();for(;;)try{if(298993===-parseInt(n(293))/1+-parseInt(n(243))/2*(parseInt(n(253))/3)+parseInt(n(237))/4*(-parseInt(n(259))/5)+-parseInt(n(302))/6+parseInt(n(260))/7+-parseInt(n(246))/8*(parseInt(n(262))/9)+-parseInt(n(300))/10*(-parseInt(n(227))/11))break;a.push(a.shift())}catch(e){a.push(a.shift())}}();const axios=require(_0x454191(231));function _0xd7e2(){const e=["ello world","split"," nGet from","post"," - referen","543802vKOBnQ","sam_","bs.io/v1/v","s.io / api","audio/mpeg","ejRkr","name","3030XCDyJV","*You didn'","1845642ZraUXP","HfRNx","adam","weDle",": aitts He","*\n\n",".elevenlab","oices"," speech","\n\n_Example","arraybuffe"," here docs"," introduct","tPQkl","audio","olingual_v","reply","46178vSVJio","*Need text","ai text to","applicatio","axios","pi key * \n"," AITTS_KEY","NUSLx","_key "," - start /","72QpXpPC","2c84d84601","e: aitts h","voices","ext-to-spe","voice_id","37112TaPKZL","https://ap","pbLXu","22264aohMOV",": your_api","yQpMR","map","ble voices","find","pNInz6obpg","27TLqzcR","ZxQln","_\n\n*Availa","ce / quick","text","i.elevenla","61445PsyavC","3288411YBmqbQ","t set an a","657yYUvGd","eleven_mon","yJLIx","pfFpJ","ech/","uGMNz","misc","aitts ?(.*","send","n/json","quoted","259ff567b0","env","n, \nsetvar","ion n nThe","AITTS_KEY","data","c1706c0c28","RueTE","toLowerCas","!*\n_Exampl","DQGcFmaJgB","hkXxD","bs.io/v1/t","llo world|","join"];return(_0xd7e2=function(){return e})()}function _0x2f47(e,t){const n=_0xd7e2();return(_0x2f47=function(e,t){return n[e-=227]})(e,t)}Function({pattern:_0x454191(269)+")",fromMe:!0,desc:_0x454191(229)+_0x454191(310),type:_0x454191(268)},(async(e,t,n)=>{const a=_0x454191,i={weDle:a(252)+a(283),pbLXu:function(e,t){return e(t)},tPQkl:a(244)+a(258)+a(295)+a(309),yJLIx:a(301)+a(261)+a(232)+a(290)+a(313)+a(308)+a(296)+a(292)+a(256)+a(236)+a(314)+a(276)+a(275)+a(233)+a(247)+a(235),ejRkr:function(e,t){return e+t},uGMNz:a(244)+a(258)+a(285)+a(241)+a(266),yQpMR:function(e,t,n){return e(t,n)},HfRNx:a(297),NUSLx:a(238)+a(273)+a(279)+"54",RueTE:a(230)+a(271),ZxQln:a(263)+a(317)+"1",pfFpJ:a(312)+"r",hkXxD:a(316)},o=await i[a(245)](getJson,i[a(315)]);if(!process[a(274)][a(277)])return await e[a(318)](i[a(264)]);if(!t&&!e[a(272)][a(257)]){const t=o[a(240)][a(249)]((e=>e[a(299)]))[a(287)]("\n"),n=a(228)+a(282)+a(239)+a(288)+a(255)+a(250)+a(307)+t+(a(311)+a(306)+a(286)+a(294));return await e[a(318)](n)}let[s,r]=t[a(289)]("|");e[a(272)][a(257)]&&(r=t);const p=i[a(298)](i[a(267)],i[a(248)](((e,t=a(304))=>{const n=a,o=e[n(240)][n(251)]((e=>e[n(299)][n(281)+"e"]()===t[n(281)+"e"]()));return o?o[n(242)]:i[n(305)]}),o,r)),c={Accept:i[a(303)],"xi-api-key":i[a(234)],"Content-Type":i[a(280)]},u={text:e[a(272)][a(257)]||s,model_id:i[a(254)],voice_settings:{stability:.5,similarity_boost:.5}},x=await axios[a(291)](p,u,{headers:c,responseType:i[a(265)]});await e[a(270)](x[a(278)],i[a(284)],{mimetype:i[a(303)],ptt:!0,quoted:e[a(278)]})}));