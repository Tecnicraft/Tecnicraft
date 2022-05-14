const setupSchema = require(`../modelos/setups.js`);
const votosSchema = require(`../modelos/votos-sugs.js`);
const { asegurar_todo } = require(`../handlers/funciones.js`);
const Discord = require('discord.js');
module.exports = client => {
    client.on("messageCreate", async message => {
        try {
            if (!message.guild || !message.channel || message.author.bot) return;
            let setup_data = await setupSchema.findOne({ guildID: message.guild.id });
            if (!setup_data || !setup_data.sugerencias || !message.guild.channels.cache.get(setup_data.sugerencias) || message.channel.id !== setup_data.sugerencias) return;
            message.delete().catch(() => { });
            let botones = new Discord.MessageActionRow().addComponents([
                new Discord.MessageButton().setStyle("SECONDARY").setLabel("0").setEmoji("✅").setCustomId("votar_si"),
                new Discord.MessageButton().setStyle("SECONDARY").setLabel("0").setEmoji("❌").setCustomId("votar_no"),
                new Discord.MessageButton().setStyle("PRIMARY").setLabel("¿Quién ha votado?").setEmoji("❓").setCustomId("ver_votos"),
            ])
            let msg = await message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor({ name: "Sugerencia de " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`>>> ${message.content}`)
                        .addField(`✅ Votos positivos`, "0 votos", true)
                        .addField(`❌ Votos negativos`, "0 votos", true)
                        .setColor(client.color)
                        .setFooter({ text: "Quieres sugerir algo? Simplemente envía la sugerencia aquí!", iconURL: "https://images.emojiterra.com/google/android-pie/512px/1f4a1.png" })
                ],
                components: [botones]
            })
            let data_msg = new votosSchema({
                messageID: msg.id,
                autor: message.author.id,
            })
            data_msg.save();
        } catch (e) { console.log(e) }
    })

    client.on("interactionCreate", async interaction => {
        try {
            if (!interaction.guild || !interaction.channel || !interaction.message || !interaction.user) return;
            asegurar_todo(interaction.guild.id, interaction.user.id);
            let setup_data = await setupSchema.findOne({ guildID: interaction.guild.id });
            let msg_data = await votosSchema.findOne({ messageID: interaction.message.id });
            if (!msg_data || !setup_data || !setup_data.sugerencias || interaction.channelId !== setup_data.sugerencias) return;
            switch (interaction.customId) {
                case "votar_si": {
                    if (msg_data.si.includes(interaction.user.id)) return interaction.reply({ content: `Ya has votado SÍ en la sugerencia de <@${msg_data.autor}>`, ephemeral: true});
                    if (msg_data.no.includes(interaction.user.id)) msg_data.no.splice(msg_data.no.indexOf(interaction.user.id), 1)
                    msg_data.si.push(interaction.user.id);
                    msg_data.save();

                    interaction.message.embeds[0].fields[0].value = `${msg_data.si.length} votos`;
                    interaction.message.embeds[0].fields[1].value = `${msg_data.no.length} votos`;

                    interaction.message.components[0].components[0].label = msg_data.si.length.toString();
                    interaction.message.components[0].components[1].label = msg_data.no.length.toString();

                    await interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]] });
                    interaction.deferUpdate();
                }
                    break;

                case "votar_no": {
                    if (msg_data.no.includes(interaction.user.id)) return interaction.reply({ content: `Ya has votado SÍ en la sugerencia de <@${msg_data.autor}>` , ephemeral: true});
                    if (msg_data.si.includes(interaction.user.id)) msg_data.si.splice(msg_data.si.indexOf(interaction.user.id), 1)
                    msg_data.no.push(interaction.user.id);
                    msg_data.save();

                    interaction.message.embeds[0].fields[0].value = `${msg_data.si.length} votos`;
                    interaction.message.embeds[0].fields[1].value = `${msg_data.no.length} votos`;

                    interaction.message.components[0].components[0].label = msg_data.si.length.toString();
                    interaction.message.components[0].components[1].label = msg_data.no.length.toString();

                    await interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]] });
                    interaction.deferUpdate();

                }
                    break;
                    
                case "ver_votos": {
                    interaction.reply({
                        embeds: [new Discord.MessageEmbed()
                        .setTitle(`Votos de la sugerencia`)
                        .addField(`✅ Votos positivos`, msg_data.si.length >= 1 ? msg_data.si.map(u => `<@${u}>\n`).toString() : "No hay votos", true)
                        .addField(`❌ Votos negativos`, msg_data.no.length >= 1 ? msg_data.no.map(u => `<@${u}>\n`).toString() : "No hay votos", true)
                        .setColor(client.color)
                        ],
                        ephemeral: true,
                    })
                }
                    break;

                default:
                    break;
            }
        } catch (e) { console.log(e) }
    })
}