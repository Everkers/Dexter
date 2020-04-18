/* eslint-disable no-await-in-loop */
const { isAdmin, saveToDb } = require('../helpers');
const { GAME_CHARACTERS } = require('../../config.json');

module.exports.run = async (attr, msg) => {
  if (!isAdmin(msg.author.id)) {
    /* check if the user is an admin of the bot */
    msg.reply("You don't have the keys of the blacksmith room ");
  } else {
    /* get the current user */
    const filter = (m) => m.author.id === msg.author.id;
    msg.reply(
      `Hello my name is ${GAME_CHARACTERS.blacksmith.name} the blacksmith of this village, 
      you have 30 seconds to answer each question!`,
    );
    /* values array */
    const VALUES = [];
    /* blacksmith questions */
    const questions = [
      { q: 'What you would like to call your new weapon?', column: 'name', type: 'text' },
      { q: 'How much damage you want it to deal ?', column: 'damge', type: 'int' },
      { q: 'Give me a short description of the weapon', column: 'info', type: 'text' },
      { q: 'How much do you want to sell for?', column: 'price', type: 'int' },
      { q: 'How it should look like (image-url)?', column: 'icon', type: 'text' },
      { q: 'Last question, In what class you want to add it?', column: 'class', type: 'text' },
    ];
    /* loop trough all the questions  */
    let i = 0;
    let error = null;
    while (i < questions.length) {
      try {
        /* ask question */
        await msg.channel.send(questions[i].q);
        /* collect the answer  */
        const collected = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });
        /* set data to VALUES object */
        VALUES.push(
          questions[i].type === 'text'
            ? `'${collected.first().content.replace("'", "''")}'`
            : collected.first().content,
        );
        i += 1;
      } catch (err) {
        /* handling error if the answer of some question is late,
         then stop the loop from running  */
        msg.reply('Sorry buddy, i have to go now, make sure to answer faster next time');
        error = true;
        break;
      }
    }
    if (!error) {
      try {
        saveToDb('weapon', ['name', 'damge', 'info', 'price', 'icon', 'class'], [...VALUES]);
      } catch (err) {
        msg.reply('Sorry somthing goes wrong while i was trying to build the weapon!');
      }
    }
  }
};
module.exports.help = {
  name: 'addWeapon',
};
