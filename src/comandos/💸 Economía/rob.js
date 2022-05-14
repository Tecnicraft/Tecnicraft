const { asegurar_todo } = require(`../../handlers/funciones.js`);
const ecoSchema = require(`../../modelos/economia.js`);
const duration = require('humanize-duration');
module.exports = {
    name: "rob",
    aliases: ["steal", "robar"],
    desc: "Sirve para robar monedas a un usuario",
    run: async (client, message, args, prefix) => {
        if (!args.length) return message.reply("❌ **Tienes que especificar al usuario para robar!**")
        const usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply("❌ **No se ha encontrado al usuario que has especificado**")
        await asegurar_todo(null, usuario.id);
        let data = await ecoSchema.findOne({ userID: message.author.id });
        let tiempo_ms = 5 * 60 * 1000;
        if (tiempo_ms - (Date.now() - data.rob) > 0) {
            let tiempo_restante = duration(Date.now() - data.rob - tiempo_ms,
                {
                    language: "es",
                    units: ["h", "m", "s"],
                    round: true,
                })
            return message.reply(`🕑 **Tienes que esperar \`${tiempo_restante}\` para volver a robar a un usuario!**`)
        }
        let data_usuario = await ecoSchema.findOne({ userID: usuario.id });
        if (data_usuario.dinero < 500) return message.reply("❌ **No puedes robar al usuario ya que, tiene menos de \`500 monedas\`**")
        let cantidad = Math.floor(Math.random() * 400) + 100
        if (cantidad > data_usuario.dinero) return message.reply("❌ **El usuario no tiene suficiente dinero para ser robado!**")
        await ecoSchema.findOneAndUpdate({ userID: message.author.id }, {
            $inc: {
                dinero: cantidad
            },
            rob: Date.now()
        })
        await ecoSchema.findOneAndUpdate({ userID: usuario.id }, {
            $inc: {
                dinero: -cantidad
            },
        })
        return message.reply(`✅ **Has robado \`${cantidad} monedas\` a \`${usuario.user.tag}\`**`)
    }
}