const { Function } = require('../lib/')
const fs = require('fs');
const config = require('../config')
if (config.TERMUX_VPS == true) {

Function({
	pattern: 'setvar ?(.*)',
	fromMe: true,
	desc: 'set config var',
	type: 'termux'
}, async (message, match, client) => {
  if (!match || !match.match(/^[^=:]+[=:]/)) return await message.send('*Invalid match format.*\n_Please use the format *KEY:VALUE* or *KEY=VALUE*_')
  let parts = match.split(/[=:]/);
  let key = parts[0].trim();
  let value = parts.slice(1).join('').trim();

  if (!value) return await message.send('Please specify a new value')
  let data = await fs.readFileSync('config.env', 'utf8');
  let lines = data.split('\n');
  let obj = {};

  let kvArray = lines.map(line => {
    let parts = line.split(/[=:]/);
    let k = parts[0].trim();
    let v = parts.slice(1).join('').trim();
    return {k, v};
  });

  kvArray.forEach(kv => {
    if (obj.hasOwnProperty(kv.k)) {
      obj[kv.k] = kv.v;
    } else {
      obj[kv.k] = kv.v;
    }
  });

  obj[key] = value;
  let updatedData = Object.entries(obj).map(([k, v]) => `${k} = ${v}`).join('\n');
  await fs.writeFileSync('config.env', updatedData, 'utf8');
  await require('dotenv').config({ path: './config.env', override: true });
  return await message.send(`_Updated *${key}* with value *${value}* in config.env file_`)
})

Function({
	pattern: 'getvar ?(.*)',
	fromMe: true,
	desc: 'get config var',
	type: 'termux'
}, async (message, match) => {
  if (!match) return await message.send('*Please specify a key*')
  let data = await fs.readFileSync('config.env', 'utf8');
  let lines = data.split('\n');
  let obj = {};
  
  let kvArray = lines.map(line => {
    let parts = line.split(/[=:]/);
    let k = parts[0].trim();
    let v = parts.slice(1).join('').trim();
    return {k, v};
  });
  
  kvArray.forEach(kv => {
    obj[kv.k] = kv.v;
  });
  
  match = match.toUpperCase();
  let value = obj[match];
  if (!value) return await message.send(`_Key *${match}* not found in config.env file_`)
  return await message.send(`_${match}:${value}_`)
})

Function({
	pattern: 'allvar',
	fromMe: true,
	desc: 'get all config vars',
	type: 'termux'
}, async (message, match) => {
  let data = await fs.readFileSync('config.env', 'utf8');
  let lines = data.split('\n');
  let obj = {};

  let kvArray = lines.map(line => {
    let parts = line.split(/[=:]/);
    let k = parts[0].trim();
    let v = parts.slice(1).join('').trim();
    return {k, v};
  });

  kvArray.forEach(kv => {
    obj[kv.k] = kv.v;
  });

  let str = Object.entries(obj).map(([k, v]) => `${k} = ${v}`).join('\n');
  return await message.send(`*All config vars:*\n${str}`)
})
}