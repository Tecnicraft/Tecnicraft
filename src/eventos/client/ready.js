const Discord = require('discord.js');
const mongoose = require('mongoose');
const config = require('../../config/config.json');
const fs = require("fs");

module.exports = (client, prefix) => {

    client.channels.cache.get("971860396963155988").send(`${client.guilds.cache.size}`)
    client.channels.cache.get("971860396963155988").send(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`)
    client.channels.cache.get("971860396963155988").send('Estoy encendido!')

    const estados = [
        {
            name: 'Minecraft',
            type: 'PLAYING'
        },
        {
            name: `${config.prefix}help`,
            type: 'LISTENING'
        },
        {
            name: `a ${client.guilds.cache.size} Servidor`,
            type: 'WATCHING'
        }
        /*{
            name: 'Jugando en mi servidor de Minecraft',
            type: 'STREAMING',
            url: 'https://www.twitch.tv/xxsircarlospxx'
        },
        {
            name: 'Reaccionando a videos ramdom',
            type: 'STREAMING',
            url: 'https://www.twitch.tv/xxsircarlospxx'
        }*/
    ]
    const aleatorio =
    estados[Math.floor(Math.random() * estados.length)]

    setInterval(() => {
        function Presence(){
            client.user.setPresence({
                activities: [aleatorio],
                status: "online"
            })
        }
        Presence()
    }, 10000)

    let palo = 53;

    mongoose.connect(config.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║       Conectado a la base de datos de MONGODB!      ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.blue)
    }).catch((err) => {
        console.log(`☁ ERROR AL CONECTAR A LA BASE DE DATOS DE MONGODB`.red);
        console.log(err)
    })

    console.log(`╔═════════════════════════════════════════════════════╗`.green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`║ `.green + `      Conectado como ${client.user.tag}`.green + " ".repeat(-1 + palo - 1 - `      Conectado como ${client.user.tag}`.length) + " ║".green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`╚═════════════════════════════════════════════════════╝`.green)
}