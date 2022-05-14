const schema = require(`../../modelos/servidor.js`);
const config = require('../../config/config.json')

module.exports = {
    name: "reset-prefix",
    aliases: ["rprefix", "reset-prefijo", "rprefijo"],
    desc: "Sirve para resetear el Preijo del Bot en el Servidor",
    permisos: ["ADMINISTRATOR"],
    run: async (client, message, args, prefix, idioma) => {
        await schema.findOneAndUpdate({guildID: message.guild.id}, {
            prefijo: config.prefix
        })
        return message.reply('El prefix se ha reseteado')
    }
}