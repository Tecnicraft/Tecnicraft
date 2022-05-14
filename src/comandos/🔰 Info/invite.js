const Discord = require("discord.js");

module.exports = {
  name: "invite",
  aliases: [],
  desc: "Invita al Bot",
  run: async (client, message, args, prefix) => {
    const embed = new Discord.MessageEmbed()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setTitle("Invitame a tu server!")
      .setDescription(
        `[Invitame!](https://discord.com/api/oauth2/authorize?client_id=971833113728647168&permissions=8&scope=bot%20applications.commands) | [Visita mi Website](https://tecnicraft.github.io/Tecnicraft/) | [Unete al Servidor de Soporte](https://discord.gg/7y5yYXPKkx)\n\n[Votame en Top.gg](https://top.gg/bot/848232775798226996)`
      )
      .setFooter(
        `${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      );

    message.channel.send({ embeds: [embed] });
  },
};