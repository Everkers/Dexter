const discord = require('discord.js');
const { isRegistered, hasPoints, getUserWeapons } = require('../helpers');
const { GAME_CURRENCY } = require('../../config.json');

module.exports.run = async (attr, msg) => {
  function weaponEmbed(weapon, username) {
    const embed = new discord.MessageEmbed()
      .setTitle(`${username} weapon selection`)
      .addField(
        `[${weapon.id}] ${weapon.name}`,
        ` \`info\` : ${weapon.info} \n \`price\` : ${weapon.price} \n \`damage\` : ${weapon.damge} `,
      );
    return embed;
  }
  const [opponent, points] = attr;
  const { id: userid, username: userUsername } = msg.author;
  isRegistered(userid, userUsername, 'player');
  if (!opponent) msg.reply('Please mention the opponent');
  else if (!points) msg.reply('Looks like you want to fight for free?');
  else {
    const filteredOpponentId = opponent.includes('!')
      ? opponent.match('<@!(.*)>')[1]
      : opponent.match('<@(.*)>')[1];
    const { user: opponentObject } = msg.guild.member(filteredOpponentId);
    if (userid === opponentObject.id) {
      msg.reply("I would never let you do that! You're too good of a friend!");
    } else if (opponentObject.bot) {
      msg.reply('Sorry! We bots have to stick together, and that means no fighting other bots!');
    } else {
      await msg.channel.send(
        `Hey ${opponentObject}, ${userUsername} invited you to a fight to the death for ${points} ${GAME_CURRENCY}, type accept or decline?`,
      );
      try {
        const accepted = await msg.channel.awaitMessages((m) => m.author.id === opponentObject.id, {
          max: 1,
          time: 30000,
        });
        if (accepted.first().content === 'accept') {
          const opponentHasPoints = await hasPoints(opponentObject.id, points, 'player');
          const userHasPoint = await hasPoints(userid, points, 'player');
          if (!opponentHasPoints || !userHasPoint) {
            msg.channel.send(`Double check your ${GAME_CURRENCY} guys!`);
          } else {
            const tempStorage = new Set();
            const opponentWeapons = await getUserWeapons(opponentObject.id, 'weapon', 'player');
            const userWeapons = await getUserWeapons(userid, 'weapon', 'player');
            msg.channel.send(weaponEmbed(opponentWeapons, opponentObject.username));
            await msg.channel.send(`${opponentObject} Choose your weapon!`);
            const choosedOponenetWeapon = await msg.channel.awaitMessages(
              (m) => m.author.id === opponentObject.id,
              { max: 1, time: 30000 },
            );
            msg.channel.send(weaponEmbed(userWeapons, userUsername));
            await msg.channel.send(`<@${userid}> Choose your weapon!`);
            const choosedUserWeapon = await msg.channel.awaitMessages(
              (m) => m.author.id === userid,
              { max: 1, time: 30000 },
            );
            if (opponentWeapons.id !== +choosedOponenetWeapon) {
              msg.channel.send(
                `${opponentObject} You don't have any weapon with the id of ${choosedOponenetWeapon.id}`,
              );
            }
            if (userWeapons.id !== +choosedOponenetWeapon) {
              msg.channel.send(
                `<@${userid}> You don't have any weapon with the id of ${choosedUserWeapon.id}`,
              );
            }
          }
        } else if (accepted.first().content === 'decline') {
          msg.channel.send(`${opponentObject} is too afraid to fight <@${userid}>`);
        }
      } catch (err) {
        console.log(err);
        msg.channel.send(
          `The fight between <@${userid}> and ${opponentObject} has been canceled automatically`,
        );
      }
    }
  }
};
module.exports.help = {
  name: 'fight',
};
