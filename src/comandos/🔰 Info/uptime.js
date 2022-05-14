const Discord = require("discord.js");
const pretty = require("pretty-ms");

module.exports = {
  name: "uptime",
  aliases: [],
  desc: "Te muestra el tiempo que lleva encendido el Bot",
  run: async (client, message, args, prefix) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(`🕘 Tecnicraft Uptime`)
      .setDescription(
        `\`\`\`yml\nStatus : Online\nUptime : ${pretty(client.uptime)}\n\`\`\``
      )
      .setColor(client.color/*message.guild.me.displayHexColor*/);

    message.reply({ embeds: [embed] });
  },
};