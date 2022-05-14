const Discord = require('discord.js');

module.exports = {
    name: 'say',
    aliases: ['echo'],
    desc: "El Bot dice lo que tu le pidas",
    run: async (client, message, args, prefix) => {
        const arg = args.join(' ');
        if (!arg) return;
        message.channel.send({ content: arg });
        message.delete();
    },
};