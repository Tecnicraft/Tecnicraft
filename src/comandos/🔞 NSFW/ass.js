const Discord = require('discord.js');
const NSFW = require('discord-nsfw');
const nsfw = new NSFW();
const ass = nsfw.ass();

module.exports = {
 name: "ass",
 aliases: [],
 desc: "",
 run: async (client, message, args, prefix) => {
  const embed = new Discord.MessageEmbed()
  .setTitle('a')
  .setImage(ass)
  .setColor(client.color)

  message.reply({ embeds: [embed] })
 }
}