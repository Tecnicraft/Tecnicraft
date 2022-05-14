const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('ping')
 .setDescription('El Bot responderá con su ping en ms.'),

 run: async (client, interaction) => {
  //interaction.reply({ content: `Pong! **${client.ws.ping}ms**`})
  let values = {
   "high": 200,
   "medium": 100,
   "low": 50
}

let ping = Date.now() - interaction.createdTimestamp

let color;
   if (ping > values.high) {
       color = '🔴'
   } else if (ping > values.medium) {
       color = '🟡'
   } else {
       color = '🟢'
   }

let colores;
   if (ping > values.high) {
       colores = 'RED'/*'df0101'*/
   } else if (ping > values.medium) {
       colores = 'ORANGE'/*'df7401'*/
   } else {
       colores = 'GREEN'/*'01df01'*/
   }

   let embed = new Discord.MessageEmbed()
   .setColor(`${colores}`)
   .setDescription("Pong!")
   .setTitle(`Ping ${client.user.username}\n`)
   .addField("**> Ping | :**",`> ${color} \`|\` Mi ping es: \`${ping}ms\`\n`)  
   .addField("**> API | :**",`> 🛰️ \`|\` Ping DiscordAPI: \`${client.ws.ping}ms\``)
   .setTimestamp()

   interaction.reply({ embeds: [embed] })
 }
}