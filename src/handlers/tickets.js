const { asegurar_todo } = require("./funciones");
const setupSchema = require(`../modelos/setups`);
const ticketSchema = require(`../modelos/tickets`);
const Discord = require('discord.js');
const html = require('discord-html-transcripts')

module.exports = client => {

    client.on("interactionCreate", async interaction => {
        try {

            if (!interaction.guild || !interaction.channel || !interaction.isButton() || interaction.message.author.id !== client.user.id || interaction.customId !== "crear_ticket") return;
            await asegurar_todo(interaction.guild.id);
            const setup = await setupSchema.findOne({ guildID: interaction.guild.id });
            if (!setup || !setup.sistema_tickets || !setup.sistema_tickets.canal || interaction.channelId !== setup.sistema_tickets.canal || interaction.message.id !== setup.sistema_tickets.mensaje) return;
            let ticket_data = await ticketSchema.find({ guildID: interaction.guild.id, autor: interaction.user.id, cerrado: false });

            for (const ticket of ticket_data) {
                if (interaction.guild.channels.cache.get(ticket.canal)) return interaction.reply({ content: `❌ **Ya tienes un ticket creado en <#${ticket.canal}>**`, ephemeral: true });
            }

            await interaction.reply({ content: "⌛ **Creando tu ticket... Porfavor espere**", ephemeral: true });
            const channel = await interaction.guild.channels.create(`ticket-${interaction.member.user.username}`.substring(0, 50), {
                type: "GUILD_TEXT",
                parent: interaction.channel.parent ?? null,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL"]
                    },
                ]
            });
            channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`Ticket de ${interaction.member.user.tag}`)
                    .setDescription(`Bienvenido al soporte ${interaction.member}\nExplica detallademente tu problema.`)
                    .setColor(client.color)
                ],
                components: [new Discord.MessageActionRow().addComponents(
                    [
                        new Discord.MessageButton().setStyle("DANGER").setLabel("CERRAR").setEmoji("🔒").setCustomId("cerrar_ticket"),
                        new Discord.MessageButton().setStyle("SECONDARY").setLabel("BORRAR").setEmoji("🗑").setCustomId("borrar_ticket"),
                        new Discord.MessageButton().setStyle("PRIMARY").setLabel("GUARDAR").setEmoji("💾").setCustomId("guardar_ticket"),
                    ]
                )]
            });
            let data = new ticketSchema({
                guildID: interaction.guild.id,
                autor: interaction.user.id,
                canal: channel.id,
                cerrado: false,
            });
            data.save();
            await interaction.editReply({ content: `✅ **Ticket creado en ${channel}**`, ephemeral: true })

        } catch (e) {
            console.log(e)
        }
    })

    client.on("interactionCreate", async interaction => {
        try {

            if (!interaction.guild || !interaction.channel || !interaction.isButton() || interaction.message.author.id !== client.user.id) return;
            await asegurar_todo(interaction.guild.id);

            let ticket_data = await ticketSchema.findOne({ guildID: interaction.guild.id, canal: interaction.channel.id})
            switch (interaction.customId) {
                case "cerrar_ticket":{
                    if(ticket_data && ticket_data.cerrado) return interaction.reply({content: `❌ **Este ticket ya estaba cerrado!**`, ephemeral: true});
                    interaction.deferUpdate();
                    const verificar = await interaction.channel.send({
                        embeds: [new Discord.MessageEmbed()
                        .setTitle(`Verificate primero!`)
                        .setColor("GREEN")
                        ],
                        components: [new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅")
                        )]
                    });

                    const collector = verificar.createMessageComponentCollector({
                        filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
                        time: 180e3
                    });

                    collector.on("collect", boton => {
                        if(boton.user.id !== interaction.user.id) return boton.reply({content: `❌ **No puedes hacer eso! Solo ${interaction.user} puede!**`, ephemeral: true});

                        collector.stop();
                        boton.deferUpdate();
                        ticket_data.cerrado = true;
                        ticket_data.save();
                        interaction.channel.permissionOverwrites.edit(ticket_data.autor, { VIEW_CHANNEL: false });
                        interaction.channel.send(`✅ **Ticket Cerrado por \`${interaction.user.tag}\` el <t:${Math.round(Date.now() / 1000)}>**`)
                    });

                    collector.on("end", (collected) => {
                        if(collected && collected.first() && collected.first().customId){
                            verificar.edit({
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅").setDisabled(true)
                                )]
                            })
                        } else {
                            verificar.edit({
                                embeds: [verificar.embeds[0].setColor("RED")],
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("NO VERIFICADO").setStyle("DANGER").setCustomId("verificar").setEmoji("❌").setDisabled(true)
                                )]
                            })
                        }
                    })

                }
                    break;

                case "borrar_ticket": {
                    interaction.deferUpdate();
                    const verificar = await interaction.channel.send({
                        embeds: [new Discord.MessageEmbed()
                        .setTitle(`Verificate primero!`)
                        .setColor("GREEN")
                        ],
                        components: [new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅")
                        )]
                    });

                    const collector = verificar.createMessageComponentCollector({
                        filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
                        time: 180e3
                    });

                    collector.on("collect", boton => {
                        if(boton.user.id !== interaction.user.id) return boton.reply({content: `❌ **No puedes hacer eso! Solo ${interaction.user} puede!**`, ephemeral: true});

                        collector.stop();
                        boton.deferUpdate();
                        ticket_data.delete();
                        interaction.channel.send(`✅ **El ticket será eliminado en menos de \`3 segundos ...\`\nAcción por: \`${interaction.user.tag}\` el <t:${Math.round(Date.now() / 1000)}>**`)
                        setTimeout(() => {
                            interaction.channel.delete();
                        }, 3_000);
                    });

                    collector.on("end", (collected) => {
                        if(collected && collected.first() && collected.first().customId){
                            verificar.edit({
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅").setDisabled(true)
                                )]
                            })
                        } else {
                            verificar.edit({
                                embeds: [verificar.embeds[0].setColor("RED")],
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("NO VERIFICADO").setStyle("DANGER").setCustomId("verificar").setEmoji("❌").setDisabled(true)
                                )]
                            })
                        }
                    })

                }
                break;

                case "guardar_ticket": {
                    interaction.deferUpdate();
                    const mensaje = await interaction.channel.send({
                        content: interaction.user.toString(),
                        embeds: [new Discord.MessageEmbed()
                        .setTitle(`⌛ Guardando Ticket...`)
                        .setColor(client.color)
                        ]
                    });

                    const adjunto = await html.createTranscript(interaction.channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${interaction.channel.name}.html`
                    })

                    mensaje.edit({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(`✅ Ticket Gurdado`)
                            .setColor("GREEN")
                        ],
                        files: [adjunto]
                    })                    
                }
                break;
            
                default:
                    break;
            }

        } catch (e) {
            console.log(e)
        }
    })
}