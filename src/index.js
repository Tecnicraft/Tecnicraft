const Discord = require('discord.js');
const config = require('./config/config.json');
const fs = require('fs');
require('colors');
const client = new Discord.Client({ 
    restTimeOffset: 0,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'], 
    intents: [32767]
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slashcommands = new Discord.Collection();
client.color = config.color;
client.guildscount = client.guilds.cache.size;
client.userscount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString();

client.la = {};
let idiomas = fs.readdirSync('./src/idiomas').filter(archivo => archivo.endsWith(".json")).map(idioma => idioma.replace(/.json/, ""));
console.log(idiomas)
for(const idioma of idiomas){
    client.la[idioma] = require(`./idiomas/${idioma}`)
}
Object.freeze(client.la)

function requerirhandlers() {
    ["command", "slashcommand", "events", "distube", "reaccion_roles", "tickets", "sugerencias", "sorteos" /*"bienvenida"*/].forEach(handler => {
        try {
            require(`./handlers/${handler}`)(client, Discord)
        } catch (e) {
            console.warn(e)
        }
    })
}
requerirhandlers();

process.on('unhandledRejection', error => {
    console.error(error);
});
  
client.on('shardError', error => {
    console.error(error);
});

client.login(config.token).catch(() => console.log(`-[X]- NO HAS ESPECIFICADO UN TOKEN VALIDO O TE FALTAN INTENTOS -[X]-\n [-] ACTIVA LOS INTENTOS EN https://discord.dev [-]`.red))