const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'roleinfo',
  aliases: ['role', 'roleinf'],
  run: async (client, message, args) => {
    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return (days <= 1 ? ' hace un dia' : `Hace ${days} dias`);
    }

    const mentionedRole =
      message.mentions.roles.first() ||
      client.guilds.cache.get(message.guild.id).roles.cache.get(args[0]);
    const guildIcon = client.guilds.cache
      .get(message.guild.id)
      .iconURL({ dynamic: true, size: 512 });
    if (!mentionedRole)
      return message.reply('¡Mencione o pegue la identificación del rol!');
    const embed = new Discord.MessageEmbed()
      .setTitle(
        `ℹ️ Indormacion del Rol ${mentionedRole.name}`
      )
      .setColor(client.color)
      .setThumbnail(guildIcon)
      .addField('ID del Rol', `${mentionedRole.id}`)
      .addField('Posición del Rol', `${mentionedRole.rawPosition}`)
      .addField('Color del Rol', `${mentionedRole.hexColor}`)
      .addField('Usuarios', `${mentionedRole.members.size}`)
      .addField('Mencionable', `${mentionedRole.mentionable ? 'Si' : 'No'}`)
      .addField('Izar', `${mentionedRole.hoist ? 'Verdadero' : 'Falso'}`)
      .addField(
        'Fecha de creación',
        `${moment(mentionedRole.createdAt).format('LLLL')} (${checkDays(
          mentionedRole.createdAt
        )})`
      )
      .setFooter(message.author.tag)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};