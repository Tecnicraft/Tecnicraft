const Discord = require('discord.js');

module.exports = {
  name: 'slowmode',
  aliases: ['set-slowmode'],
  desc: "Pone en modo lento el canal que se asigne",
  run: async (client, message, args, prefix) => {
    const amount = parseInt(args[0]);
    if (isNaN(amount))
      return message.reply({ content: ":x:No existe ser un valor válido" });
    if (args[0] === amount + 's') {
      message.channel.setRateLimitPerUser(amount);
      if (amount > 1) {
        message.channel.send({
          content: 'El modo lento ahora es de ' + amount + ' segundos',
        });
        return;
      } else {
        message.channel.send({
          content: 'El modo lento ahora es de ' + amount + ' segundo',
        });
        return;
      }
    }
    if (args[0] === amount + 'm') {
      message.channel.setRateLimitPerUser(amount * 60);
      if (amount > 1) {
        message.channel.send({
          content: 'El modo lento ahora es de ' + amount + ' minutos',
        });
        return;
      } else {
        message.channel.send({
          content: 'El modo lento ahora es de ' + amount + ' minuto',
        });

        return;
      }
    }
    if (args[0] === amount + 'h') {
      message.channel.setRateLimitPerUser(amount * 60 * 60);
      if (amount > 1) {
        message.channel.send({
          content: 'El modo lento ahora es de ' + amount + ' horas',
        });
        return;
      } else {
        message.channel.send({
          content: 'El modo lento ahora es de ' + amount + ' hora',
        });
        return;
      }
    } else {
      message.channel.send({
        content: 'Solo puede configurar segundos(s), minutos(m) y horas (h)',
      });
    }
  },
};