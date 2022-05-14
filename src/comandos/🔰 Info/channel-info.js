const Discord = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
  name: 'channelinfo',
  aliases: ['channel'],
  desc: "Mira la informacion del canal",
  run: async (client, message, args, prefix) => {
    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return (days <= 1 ? ' hace un dia' : `Hace ${days} dias`);
    }
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply('Por favor mencione un canal.');
    let channelType = channel.type;
    if (channelType === 'GUILD_TEXT') {
      channelType = 'Canal de texto';
    }
    if (channelType === 'GUILD_VOICE') {
      channelType = 'Canal de voz';
    }
    if (channelType === 'GUILD_PUBLIC_THREAD') {
      channelType = 'Hilo público';
    }
    if (channelType === 'GUILD_PRIVATE_THREAD') {
      channelType = 'Hilo privado';
    }
    if (channelType === 'GUILD_CATEGORY') {
      channelType = 'Categoria';
    }
    let inline = true;
    try {
      let e = new Discord.MessageEmbed()
        .setTitle(`💬 Informacion del Canal`)
        .setThumbnail(message.guild.iconURL({ dynamic: false }))
        .setDescription(`Information About ${channel}`)
        .addField('Canal creado en (Dias):', `${checkDays(channel.createdAt)}`, inline)
        .addField('ID del Canal:', `${channel.id}`, inline)
        .addField('Tipo de Canal:', `${channelType}`, inline)
        .setFooter(
          `Informacion del Canal | Comando solicitado por ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setColor(config.color);
      message.channel.send({ embeds: [e] });
    } catch (error) {
      message.channel.send(error);
    }
  },
};