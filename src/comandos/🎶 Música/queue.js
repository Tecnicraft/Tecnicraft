const Discord = require('discord.js');
module.exports = {
    name: "queue",
    aliases: ["q", "cola"],
    desc: "Sirve para ver la lista de canciones",
    run: async (client, message, args, prefix) => {
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`❌ **No hay ninguna canción reproduciéndose!**`);
        if (!message.member.voice?.channel) return message.reply(`❌ **Tienes que estar en un canal de voz para ejecutar este comando!**`);
        if (message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel.id) return message.reply(`❌ **Tienes que estar en el mismo canal de voz __QUE YO__ para ejecutar este comando!**`);

        let listaqueue = [];
        var maximascanciones = 10;
        for (let i = 0; i < queue.songs.length; i += maximascanciones) {
            let canciones = queue.songs.slice(i, i + maximascanciones);
            listaqueue.push(canciones.map((cancion, index) => `**\`${i + ++index}\`** - [\`${cancion.name}\`](${cancion.url})`).join("\n "));
        }

        var limite = listaqueue.length;
        var embeds = [];
        for (let i = 0; i < limite; i++) {
            let desc = String(listaqueue[i]).substring(0, 2048);
            let embed = new Discord.MessageEmbed()
                .setTitle(`🎶 Cola de ${message.guild.name} - \`[${queue.songs.length} ${queue.songs.length > 1 ? "Canciones" : "Canción"}]\``)
                .setColor("#8400ff")
                .setDescription(desc)
            if (queue.songs.length > 1) embed.addField(`💿 Canción Actual`, `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**`)
            await embeds.push(embed)
        }
        return paginacion();

        async function paginacion() {
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
                        collector.resetTimer()
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
                embedpaginas.edit({content: `El tiempo ha expirado! escribe de nuevo \`${prefix}queue para volver a ver la cola de canciones!\``, embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
            });
        }
    }
}