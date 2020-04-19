/* eslint-disable no-await-in-loop */
const discord = require('discord.js');
const { isRegistered, hasPoints, getUserWeapons } = require('../helpers');
const { GAME_CURRENCY } = require('../../config.json');

module.exports.run = async (attr, msg) => {
  function weaponEmbed(weapons, username) {
    const embed = new discord.MessageEmbed().setTitle(`${username} weapon selection`);
    weapons.forEach((weapon) => {
      embed.addField(
        `[${weapon.id}] ${weapon.name}`,
        ` \`info\` : ${weapon.info} \n \`price\` : ${weapon.price} \n \`damage\` : ${weapon.damge} `,
      );
    });
    return embed;
  }
  const [opponent, points] = attr;
  const userObject = msg.author;
  isRegistered(userObject.id, userObject.username, 'player');
  if (!opponent) msg.reply('Please mention the opponent');
  else if (!points) msg.reply('Looks like you want to fight for free?');
  else {
    const filteredOpponentId = opponent.includes('!')
      ? opponent.match('<@!(.*)>')[1]
      : opponent.match('<@(.*)>')[1];
    const { user: opponentObject } = msg.guild.member(filteredOpponentId);
    if (userObject.id === opponentObject.id) {
      msg.reply("I would never let you do that! You're too good of a friend!");
    } else if (opponentObject.bot) {
      msg.reply('Sorry! We bots have to stick together, and that means no fighting other bots!');
    } else {
      await msg.channel.send(
        `Hey ${opponentObject}, ${userObject.username} invited you to a fight to the death for ${points} ${GAME_CURRENCY}, type accept or decline?`,
      );
      try {
        const accepted = await msg.channel.awaitMessages((m) => m.author.id === opponentObject.id, {
          max: 1,
          time: 30000,
        });
        if (accepted.first().content === 'accept') {
          const opponentHasPoints = await hasPoints(opponentObject.id, points, 'player');
          const userHasPoint = await hasPoints(userObject.id, points, 'player');
          if (!opponentHasPoints || !userHasPoint) {
            msg.channel.send(`Double check your ${GAME_CURRENCY} guys!`);
          } else {
            // # TODO ADD PLAYER ATTACKS
            const tempStorage = new Set();
            opponentObject.weapons = await getUserWeapons(opponentObject.id, 'weapon', 'player');
            userObject.weapons = await getUserWeapons(userObject.id, 'weapon', 'player');
            const players = [opponentObject, userObject];
            let i = 0;
            while (i < players.length) {
              const player = players[i];
              msg.channel.send(weaponEmbed(player.weapons, player.username));
              await msg.channel.send(`${player} Choose your weapon!`);
              const weapon = await msg.channel.awaitMessages((m) => m.author.id === player.id, {
                max: 1,
                time: 30000,
              });
              const selectedWeapon = weapon.first().content;
              // eslint-disable-next-line no-shadow
              if (!player.weapons.some((weapon) => weapon.id === +selectedWeapon)) {
                msg.channel.send(
                  `${player} You don't have any weapon with the id of ${selectedWeapon}`,
                );
                i -= 1;
              }
              i += 1;
            }

            /* Game start here */
            /* Number guess */
            // const guessNumber = Math.floor(Math.random() * 2) + 1; // 1
            // msg.channel.send(
            //   'now we start with first attacker phase, i will ask each one of you to give me the hidden number and the winner will start first! (1 or 2)',
            // );
            // console.log(guessNumber);
            // const guessers = [opponentObject, userObject];
            // const guess = 0;
            // let guesser = guessNumber !== 0 ? guessers[guessNumber - 1] : guessers[guessNumber];
            // while (guess !== guessers.length) {
            //   await msg.channel.send(`${guesser} the value of hidden number is 2 or 1 ?`);
            //   const guessAnswer = await msg.channel.awaitMessages(
            //     // eslint-disable-next-line no-loop-func
            //     (m) => m.author.id === guesser.id,
            //     {
            //       max: 1,
            //       time: 30000,
            //     },
            //   );
            //   guesser.hiddenNumber = guessAnswer.first().content;
            //   guessers.splice(guessers.indexOf(guesser), 1);
            //   // eslint-disable-next-line prefer-destructuring
            //   guesser = guessers[0];
            // }
          }
        } else if (accepted.first().content === 'decline') {
          msg.channel.send(`${opponentObject} is too afraid to fight ${userObject}`);
        }
      } catch (err) {
        console.log(err);
        msg.channel.send(
          `The fight between ${userObject} and ${opponentObject} has been canceled automatically`,
        );
      }
    }
  }
};
module.exports.help = {
  name: 'fight',
};
