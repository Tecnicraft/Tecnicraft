const Discord = require('discord.js');

module.exports = {
  name: 'clear-slowmode',
  aliases: ['unset-slowmode'],
  desc: "Quita el modo lento en el canal que se asigne",
  run: async (client, message, args, prefix) => {
    message.channel.setRateLimitPerUser(0);
    message.channel.send('Se quito el modo lento')
  }
}