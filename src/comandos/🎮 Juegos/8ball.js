const Discord = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
  name: '8ball',
  aliases: [],
  desc: "Haz una pregunta y deja que la 8ball decida la respuesta",
  run: async (client, message, args) => {
    const question = args.join(' ');
    if (!question) return message.reply('¡Por favor escribe una pregunta!');
    let responses = [
        'Es cierto',
        'Es decididamente así',
        'Sin duda',
        'Sí, definitivamente',
        'Puedes confiar en ello',
        'Tal y como yo lo veo, sí',
        'Lo más probable',
        'Seguro',
        'Perspectiva buena',
        'Sí',
        'Los indicios apuntan a que sí',
        'Respuesta confusa, inténtelo de nuevo',
        'Pregunte de nuevo más tarde',
        'Mejor no te lo digo ahora',
        "No puedo predecirlo ahora",
        'Concéntrate y vuelve a preguntar',
        'No cuentes con ello',
        'Mi respuesta es no',
        'Mis fuentes dicen que no',
        'Las perspectivas no son muy buenas',
        'Muy dudoso',
    ];
    const response = Math.floor(Math.random() * responses.length);
    const embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setTitle('🎱 8ball')
      .addField(`Pregunta de ${message.author.username}`, question)
      .addField(`8ball dice`, responses[response])
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};