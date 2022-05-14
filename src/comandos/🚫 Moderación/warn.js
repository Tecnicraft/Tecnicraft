const Discord = require('discord.js');
const {asegurar_todo} = require(`../../handlers/funciones.js`)
const warnSchema = require(`../../modelos/warns.js`)
module.exports = {
    name: "warn",
    aliases: ["warnear", "avisar"],
    desc: "Sirve para enviar un aviso a un usuario del Servidor",
    permisos: ["ADMINISTRATOR", "BAN_MEMBERS"],
    permisos_bot: ["ADMINISTRATOR", "BAN_MEMBERS"],
    run: async (client, message, args, prefix) => {
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(`❌ **No se ha encontrado al usuario que has especificado!**`);
        await asegurar_todo(message.guild.id, usuario.id);
        let razon = args.slice(1).join(" ");
        if(!razon) razon = "No se ha especificado ninguna razón!"

        if(usuario.id == message.guild.ownerId) return message.reply(`❌ **No puedes avisar al DUEÑO del Servidor!**`);

        if (message.guild.me.roles.highest.position > usuario.roles.highest.position) {
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                usuario.send({embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(`Has sido avisado de __${message.guild.name}__`)
                    .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                    .setColor(client.color)
                    .setTimestamp()
                ]}).catch(() => {message.reply(`No se le ha podido enviar el DM al usuario!`)});

                message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`✅ Usuario avisado`)
                .setDescription(`**Se ha avisado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)* del servidor!**`)
                .addField(`Razón`, `\n\`\`\`yml\n${razon}\`\`\``)
                .setColor(client.color)
                .setTimestamp()
                ]})
                let objeto_warn = {
                    fecha: Date.now(),
                    autor: message.author.id,
                    razon
                }
                await warnSchema.findOneAndUpdate({guildID: message.guild.id, userID: usuario.id}, {
                    $push: {
                        warnings: objeto_warn
                    }
                })
            } else {
                return message.reply(`❌ **Tu Rol está por __debajo__ del usuario que quieres avisar!**`)
            }
        } else {
            return message.reply(`❌ **Mi Rol está por __debajo__ del usuario que quieres avisar!**`)
        }


    }
}