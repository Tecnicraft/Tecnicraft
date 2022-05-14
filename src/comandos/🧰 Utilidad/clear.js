const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
    name: 'clear',
    aliases: ['cls', 'purge'],
    desc: 'Borrar y eliminar mensajes',
    run: async (client, message, args) => {
        const amount = Number(args[0], 10) || parseInt(args[0]);
        if (isNaN(amount) || !Number.isInteger(amount))
            return message.reply({
                content: `¡Por favor escriba el numero de mensajes a borrar!`,
            });
        if (amount <= 1 || amount > 100)
            return message.reply({
                content: `Por favor escriba un numero del 1 al 100`,
            });
        try {
            await message.delete();
            await message.channel.bulkDelete(amount).then(async (m) => {
            let embed = new MessageEmbed()
            .setColor(config.color)
            .setDescription(
                `✅ ¡**${m.size}**/**${amount}** mensajes borrados!`
            );

            message.channel.send({ embeds: [embed] })
                .then((msg) => msg.delete({ timeout: 4000 }));
            });
        } catch (e) {
            console.log(e);
            message.channel.send({
                content: `Solo puedes borrar mensajes con 14 dias en el chat`,
            });
        }
    },
};