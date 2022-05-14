const Discord = require('discord.js');
const akinator = require('discord.js-akinator');
const config = require('../../config/config.json');

module.exports = {
    name: "nator",
    aliases: ["aki"],
    desc: "Juega akinator desde discord",
    run: async (client, message, args, prefix) => {

        const language = "es";
        const childMode = false;
        const gameType = "character";
        const useButtons = true;
        const embedColor = config.color;

        akinator(message, {
            language: language,
            childMode: childMode,
            gameType: gameType,
            useButtons: useButtons,
            embedColor: embedColor
        })
    }
}