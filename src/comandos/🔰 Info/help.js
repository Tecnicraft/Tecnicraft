const { readdirSync } = require('fs');
const Discord = require('discord.js');
module.exports = {
    name: "help",
    aliases: ["h", "ayuda", "bothelp"],
    desc: "Sirve para ver la información del Bot",
    run: async (client, message, args, prefix) => {
        const categorias = readdirSync('./src/comandos');
        
        if (args[0]) {
            const comando = client.commands.get(args[0].toLowerCase()) || client.commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase()));
            const categoria = categorias.find(categoria => categoria.toLowerCase().endsWith(args[0].toLowerCase()));
            if (comando) {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Comando \`${comando.name}\``)
                    .setFooter({ text: `© desarollado por xXSirCarlosPXx#1528 | 2022`, iconURL: `https://cdn.discordapp.com/avatars/852360638541594716/bafc468078c3f45689322e71e195aa31.png?size=4096&ignore=true` })
                    .setColor(client.color);
                if (comando.desc) embed.addField(`✍ Descripción`, `\`\`\`${comando.desc}\`\`\``);
                if (comando.aliases && comando.aliases.length >= 1) embed.addField(`✅ Alias`, `${comando.aliases.map(alias => `\`${alias}\``).join(", ")}`);
                if (comando.permisos && comando.permisos.length >= 1) embed.addField(`👤 Permisos requeridos`, `${comando.permisos.map(permiso => `\`${permiso}\``).join(", ")}`);
                if (comando.permisos_bot && comando.permisos_bot.length >= 1) embed.addField(`🤖 Permisos de BOT requeridos`, `${comando.permisos_bot.map(permiso => `\`${permiso}\``).join(", ")}`);
                return message.reply({ embeds: [embed] })
            } else if (categoria) {
                const comandos_de_categoria = readdirSync(`./src/comandos/${categoria}`).filter(archivo => archivo.endsWith('.js'));
                return message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(`${categoria.split(" ")[0]} ${categoria.split(" ")[1]} ${categoria.split(" ")[0]}`)
                        .setColor(client.color)
                        .setDescription(comandos_de_categoria.length >= 1 ? `>>> *${comandos_de_categoria.map(comando => `\`${comando.replace(/.js/, "")}\``).join(" - ")}*` : `>>> *Todavía no hay comandos en esta categoría...*`)
                    ]
                })
            } else {
                return message.reply(`❌ **No se ha encontrado el comando que has especificado!**\nUsa \`${prefix}help\` para ver los comandos y categorías!`)
            }
        } else {
            var paginaActual = 0;

            let ayuda_embed = new Discord.MessageEmbed()
            .setTitle(`Ayuda de __${client.user.tag}__`)
            .setColor(client.color)
            .setDescription(`Bot Multifuncional en Desarollo por \`xXSirCarlosPXx#1528\`\n **El prefix del Servidor es** \`${prefix}\``)
            .addField(`❓ **__¿Quién soy?__**`, `👋 Hola **${message.author.username}**, mi nombre es **__${client.user.username}__**\n🤯 Soy un BOT MULTIFUNCIONAL Incluyendo:\n> **ADMINISTRACIÓN\n> MODERACIÓN\n> MÚSICA**\n*y mucho más!*`)
            .addField(`📈 **__ESTADÍSTICAS__**`, `⚙ **${client.commands.size} Comandos**\n📁 en **${client.guilds.cache.size} Servidores**\n📶 **\`${client.ws.ping}ms\` Ping**\n👤 Desarollado por **[xXSirCarlosPXx#1528](https://discord.gg/e4CDVyjHrU)**`)
            .addField(`✍ **__CÓDIGO PÚBLICO__**`, `[\`DESCARGA EL CÓDIGO GRATIS!\`](https://github.com/Tecnicraft/Tecnicraft)`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter({ text: `Página 1 / ${categorias.length+1}\n© desarollado por xXSirCarlosPXx#1528 | 2022`, iconURL: `https://cdn.discordapp.com/avatars/852360638541594716/bafc468078c3f45689322e71e195aa31.png?size=4096&ignore=true` })
            let embeds_pages = [ayuda_embed];

            categorias.map((categoria, index) => {
                const comandos_de_categoria = readdirSync(`./src/comandos/${categoria}`).filter(archivo => archivo.endsWith('.js'));

                let embed = new Discord.MessageEmbed()
                    .setTitle(`${categoria.split(" ")[0]} ${categoria.split(" ")[1]} ${categoria.split(" ")[0]}`)
                    .setColor(client.color)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setDescription(comandos_de_categoria.length >= 1 ? `>>> *${comandos_de_categoria.map(comando => `\`${comando.replace(/.js/, "")}\``).join(" - ")}*` : `>>> *Todavía no hay comandos en esta categoría...*`)
                    .setFooter({ text: `Página ${index+2} / ${categorias.length+1}\n© desarollado por dewstouh#1088 | 2022`, iconURL: `https://cdn.discordapp.com/avatars/852360638541594716/bafc468078c3f45689322e71e195aa31.png?size=4096&ignore=true` })
                embeds_pages.push(embed)
            })

            const seleccion = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu()
                .setCustomId(`SelecciónMenuAyuda`)
                .setMaxValues(5)
                .setMinValues(1)
                .addOptions(categorias.map(categoria => {
                    let objeto = {
                        label: categoria.split(" ")[1].substring(0, 50),
                        value: categoria,
                        description: `Mira los comandos de ${categoria.split(" ")[1].substring(0, 50)}`,
                        emoji: categoria.split(" ")[0],
                    }
                    return objeto;
                }))
            )

            const botones = new Discord.MessageActionRow().addComponents([
                new Discord.MessageButton().setStyle('SUCCESS').setLabel("Atrás").setCustomId("Atrás").setEmoji("929001012176507040"),
                new Discord.MessageButton().setStyle('PRIMARY').setLabel("Inicio").setCustomId("Inicio").setEmoji("🏠"),
                new Discord.MessageButton().setStyle('SUCCESS').setLabel("Avanzar").setCustomId("Avanzar").setEmoji("929001012461707335"),
            ])

            let mensaje_ayuda = await message.reply({ embeds: [ayuda_embed], components: [seleccion, botones] });

            const collector = mensaje_ayuda.createMessageComponentCollector({ filter: i => i.isButton() || i.isSelectMenu() && i.user && i.message.author.id == client.user.id, time: 180e3 });

            collector.on("collect", async (interaccion) => {
                if (interaccion.isButton()) {
                    if(interaccion.user.id !== message.author.id) return interaccion.reply({content: `❌ **No puedes hacer eso! Solo ${message.author}**`, ephemeral: true})
                    switch (interaccion.customId) {
                        case "Atrás": {
                            collector.resetTimer();
                            if (paginaActual !== 0) {
                                paginaActual -= 1
                                await mensaje_ayuda.edit({ embeds: [embeds_pages[paginaActual]] }).catch(() => { });
                                await interaccion?.deferUpdate();
                            } else {
                                paginaActual = embeds_pages.length - 1
                                await mensaje_ayuda.edit({ embeds: [embeds_pages[paginaActual]] }).catch(() => { });
                                await interaccion?.deferUpdate();
                            }
                        }
                            break;
    
                        case "Inicio": {
                            collector.resetTimer();
                            paginaActual = 0;
                            await mensaje_ayuda.edit({ embeds: [embeds_pages[paginaActual]] }).catch(() => { });
                            await interaccion?.deferUpdate();
                        }
                            break;
    
                        case "Avanzar": {
                            collector.resetTimer();
                            if (paginaActual < embeds_pages.length - 1) {
                                paginaActual++
                                await mensaje_ayuda.edit({ embeds: [embeds_pages[paginaActual]] }).catch(() => { });
                                await interaccion?.deferUpdate();
                            } else {
                                paginaActual = 0
                                await mensaje_ayuda.edit({ embeds: [embeds_pages[paginaActual]] }).catch(() => { });
                                await interaccion?.deferUpdate();
                            }
                        }
                            break;
    
                        default:
                            break;
                    }
                } else {
                    let embeds = [];
                    for (const seleccionado of interaccion.values) {
                        const comandos_de_categoria = readdirSync(`./src/comandos/${seleccionado}`).filter(archivo => archivo.endsWith('.js'));

                        let embed = new Discord.MessageEmbed()
                        .setTitle(`${seleccionado.split(" ")[0]} ${seleccionado.split(" ")[1]} ${seleccionado.split(" ")[0]}`)
                        .setColor(client.color)
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setDescription(comandos_de_categoria.length >= 1 ? `>>> *${comandos_de_categoria.map(comando => `\`${comando.replace(/.js/, "")}\``).join(" - ")}*` : `>>> *Todavía no hay comandos en esta categoría...*`)
                        .setFooter({text: `© desarollado por xXSirCarlosPXx#1528 | 2022`, iconURL: `https://cdn.discordapp.com/avatars/852360638541594716/bafc468078c3f45689322e71e195aa31.png?size=4096&ignore=true` })

                        embeds.push(embed)
                    }
                    interaccion.reply({ embeds, ephemeral: true })
                }

            });

            collector.on("end", () => {
                mensaje_ayuda.edit({ content: `Tu tiempo ha expirado! Vuelve a escribir \`${prefix}help\` para verlo de nuevo!`, components: [] }).catch(() => { });
            })
        }
    }
}