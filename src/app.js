/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
require('dotenv').config();
const discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const { PREFIX, DISCORD_KEY } = require('../config.json');

const client = new discord.Client({ disableEveryone: true });
client.commands = new discord.Collection();
fs.readdir(path.join(__dirname, 'commands'), (err, files) => {
  if (err) console.log(err);
  /* filter no js files */
  const jsfile = files.filter((f) => f.split('.').pop() === 'js');
  /* check if there is no files */
  if (jsfile.length <= 0) {
    return;
  }
  /* loop trough all the js files */
  jsfile.forEach((file) => {
    /* get the files */
    const props = require(`./commands/${file}`);
    /* get the name of the command from help object if it exist */
    if (props.help) {
      client.commands.set(props.help.name, props);
    }
  });
});
// addWeapon sword-70-a super powerfull weapon-250-https://img/sword.png-vikings weapon
//
// listen to message events
client.on('message', (msg) => {
  /* check if the message has no prefix or the author is a bot */
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
  /* get command from message */
  const [command, attr] = helpers.getCommand(msg.content, PREFIX);
  /* get command file */
  const commandFile = client.commands.get(command);
  /* if command files is exists then run it */
  if (commandFile) commandFile.run(attr, msg);
});

//  pass log when the bot is ready and has no errors
client.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log('THE BOT IS READY TO GO!');
});
client.login(DISCORD_KEY);
