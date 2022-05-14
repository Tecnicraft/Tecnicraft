const Discord = require('discord.js');

module.exports = {
  name: 'nuke',
  aliases: ['nuclear'],
  desc: 'Nuke a Channel',
  permisos: ['ADMINISTRATOR'],
  run: async (client, message, args) => {
    message.channel.clone().then((ch) => {
      ch.setParent(message.channel.parentId);
      ch.setPosition(message.channel.position);
      message.channel.delete();

      ch.send({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle('This channel has been nuked!')
            .setImage(
              'https://tenor.com/view/explosion-mushroom-cloud-atomic-bomb-bomb-boom-gif-4464831'
            )
            .setColor(client.color)
            .setFooter(`Action performed by ${message.author.tag}`),
        ],
      }).then((m) => m.delete({ timeout: 7000 }));
    });
  },
};