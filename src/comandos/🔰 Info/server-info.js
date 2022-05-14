const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'serverinfo',
  aliases: ['server'],
  desc: 'Te muestra la información del Servidor',
  run: async (client, message, args, prefix) => {
    const vanityCode = message.guild.vanityURLCode;
    let vanityInvite = `https://discord.gg/${vanityCode}`;
    if (vanityCode === null) vanityInvite = 'No URL personalizada';
    const members = message.guild.members.cache;
    const roles = message.guild.roles.cache
      .filter((r) => r.id !== message.guild.id)
      .map((role) => role.toString());
    const embed = new Discord.MessageEmbed()
      .setTimestamp()
      .setTitle(message.guild.name)
      .setColor(client.color)
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
      .addField(
        `Información General`,
        `<:partnernew:863214932585873438> Nombre : ${
          message.guild.name
        }\n🆔 ID : ${message.guild.id}\n👑 Owner : ${
          (await message.guild.fetchOwner()).user
        }`
      )
      .addField(
        `Counts`,
        `<:members:863214932883800138> Miembros Totales : ${message.guild.memberCount.toString()}\n<:role:863214921574907915> Role : ${
          roles.length
        }\n💬 Canales : ${
          message.guild.channels.cache.filter(
            (ch) => ch.type === 'text' || ch.type === 'voice'
          ).size
        } total (Texto : ${
          message.guild.channels.cache.filter((ch) => ch.type === 'text').size
        }, Voz : ${
          message.guild.channels.cache.filter((ch) => ch.type === 'voice').size
        })\n<:add_reaction:863214931599818783> Emojis : ${
          message.guild.emojis.cache.size
        } (Regular : ${
          message.guild.emojis.cache.filter((e) => !e.animated).size
        }, Animados : ${
          message.guild.emojis.cache.filter((e) => e.animated).size
        })`
      )
      .addField(
        `Información Adicional`,
        `📅 Fecha de creación : ${moment(message.guild.createdTimestamp).format(
          'LLL'
        )} | \`${moment(
          message.guild.createdTimestamp
        ).fromNow()}\`\n🗺️ Region : ${
          message.guild.region
        }\n<a:boostr:864431598567817216> Boost Tier : ${
          message.guild.premiumTier
            ? `Tier ${message.guild.premiumTier}`
            : 'ninguno'
        }\n<:boost:862677231696347146> Boost Count : ${
          message.guild.premiumSubscriptionCount.toString() || '0'
        }\n🔐 Nivel de verificación : ${message.guild.verificationLevel.toString()}\n🔗 Vanity URL : ${vanityInvite}`
      )
      .addField(
        `Roles [${roles.length}]`,
        roles.length < 15
          ? roles.join(' | ')
          : roles.length > 15
          ? `${roles.slice(0, 15).join(' | ')} | \`+ ${
              roles.length - 15
            } roles...\``
          : 'ninguno'
      );
    message.channel.send({ embeds: [embed] });
  },
};