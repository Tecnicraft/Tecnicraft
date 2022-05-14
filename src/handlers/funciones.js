const serverSchema = require(`../modelos/servidor.js`);
const setupSchema = require(`../modelos/setups.js`);
const warnSchema = require(`../modelos/warns.js`);
const ecoSchema = require(`../modelos/economia.js`);
const config = require(`../config/config.json`);
const Discord = require('discord.js')

module.exports = {
    asegurar_todo,
    paginacion
}

async function asegurar_todo(guildid, userid) {
    if (guildid) {
        let serverdata = await serverSchema.findOne({ guildID: guildid })
        if (!serverdata) {
            console.log(`Asegurado: Config de Server`.green);
            serverdata = await new serverSchema({
                guildID: guildid,
                prefijo: config.prefix
            });
            await serverdata.save();
        }
        let setupsdata = await setupSchema.findOne({ guildID: guildid })
        if (!setupsdata) {
            console.log(`Asegurado: Setups`.green);
            setupsdata = await new setupSchema({
                guildID: guildid,
                reaccion_roles: [],
            });
            await setupsdata.save();
        }
    }
    if (userid) {
        let ecodata = await ecoSchema.findOne({ userID: userid })
        if (!ecodata) {
            console.log(`Asegurado: Economia de ${userid}`.green);
            ecodata = await new ecoSchema({
                userID: userid
            });
            await ecodata.save();
        }
    }
    if(guildid && userid){
        let warn_data = await warnSchema.findOne({ guildID: guildid, userID: userid })
        if (!warn_data) {
            console.log(`Asegurado: Warnings de ${userid} en ${guildid}`.green);
            warn_data = await new warnSchema({
                guildID: guildid,
                userID: userid,
                warnings: [],
            });
            await warn_data.save();
        }
    }
}


async function paginacion(client, message, texto, titulo = "Paginación", elementos_por_pagina = 5) {


    var embeds = [];
    var dividido = elementos_por_pagina;
    for(let i = 0; i < texto.length; i+= dividido) {
        let desc = texto.slice(i, elementos_por_pagina);
        elementos_por_pagina+= dividido;
        let embed = new Discord.MessageEmbed()
        .setTitle(titulo.toString())
        .setDescription(desc.join(" "))
        .setColor(client.color)
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        embeds.push(embed)
    }

    let paginaActual = 0;
    if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(() => { });
    let boton_atras = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('Atrás').setEmoji('929001012176507040').setLabel('Atrás')
    let boton_inicio = new Discord.MessageButton().setStyle('DANGER').setCustomId('Inicio').setEmoji('🏠').setLabel('Inicio')
    let boton_avanzar = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('Avanzar').setEmoji('929001012461707335').setLabel('Avanzar')
    let embedpaginas = await message.channel.send({
        content: `**Haz click en los __Botones__ para cambiar de páginas**`,
        embeds: [embeds[0].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })],
        components: [new Discord.MessageActionRow().addComponents([boton_atras, boton_inicio, boton_avanzar])]
    });
    const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == message.author.id && i?.message.author.id == client.user.id, time: 180e3 });
    collector.on("collect", async b => {
        if (b?.user.id !== message.author.id) return b?.reply({ content: `❌ **Solo la persona que ha escrito \`${prefix}queue\` puede cambiar de páginas!` });

        switch (b?.customId) {
            case "Atrás": {
                collector.resetTimer();
                if (paginaActual !== 0) {
                    paginaActual -= 1
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                } else {
                    paginaActual = embeds.length - 1
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            case "Inicio": {
                collector.resetTimer();
                paginaActual = 0;
                await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                await b?.deferUpdate();
            }
                break;

            case "Avanzar": {
                collector.resetTimer();
                if (paginaActual < embeds.length - 1) {
                    paginaActual++
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                } else {
                    paginaActual = 0
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            default:
                break;
        }
    });
    collector.on("end", () => {
        embedpaginas.components[0].components.map(boton => boton.disabled = true)
        embedpaginas.edit({ content: `El tiempo ha expirado!`, embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
    });
}