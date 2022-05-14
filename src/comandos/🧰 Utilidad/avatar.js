const Discord = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
    name: 'avatar',
    aliases: ['pfp'],
    desc: "Mira el avatar de los usuarios",
    run: async (client, message, args, prefix) => {
        const userId = args.join(' ');
        const user = message.mentions.members.first() || client.users.cache.get(userId) || message.member;
        const pngFormat = user.user.displayAvatarURL({ format: 'png' });
        const jpgFormat = user.user.displayAvatarURL({ format: 'jpg' });
        const webpFormat = user.user.displayAvatarURL();
        const avatar = user.user.displayAvatarURL({
            dynamic: true,
            size: 512
        });
        const embed = new Discord.MessageEmbed()
        .setTitle(`Avatar de ${user.user.username}`)
        .setDescription(`[PNG](${pngFormat}) | [JPG](${jpgFormat}) | [WEBP](${webpFormat})`)
        .setImage(avatar)
        .setColor(config.color)

        message.channel.send({ embeds: [embed] });
    }
};