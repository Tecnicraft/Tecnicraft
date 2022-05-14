const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guild } = require('../config/config.json');
const config = require('../config/config.json');
const slashcmd = []

module.exports = (client) => {
 try {
  console.log('Cargando los slashcommands...'.yellow)
  let slashcomandos = 0
  fs.readdirSync('./src/slashcommands/').forEach((carpeta) => {
   const slashcommands = fs.readdirSync(`./src/slashcommands/${carpeta}`).filter((archivo) => archivo.endsWith('.js'));
   for (let archivo of slashcommands){
    let slashcommand = require(`../slashcommands/${carpeta}/${archivo}`);
    slashcmd.push(slashcommand.data.toJSON())
    if(slashcommand.data.name) {
     client.slashcommands.set(slashcommand.data.name, slashcommand);
     slashcomandos++
    } else {
     console.log(`SLASHCOMMANDS [/${carpeta}/${archivo}]`, `error => el slashcommand no esta configurado`.brightRed)
     continue;
    }
   }
  });

const rest = new REST({ version: "9" }).setToken(config.token)

createSlash()

async function createSlash(){
 try{
  await rest.put(
   Routes.applicationCommands(clientId, guild), {
    body: slashcmd
   }
  )
  console.log(`${slashcomandos} Slashcommands agregados`.brightGreen)
 } catch(e) {
  console.error(e)
 }
}

  console.log(`${slashcomandos} Slashcommands Cargados`.brightGreen);
 } catch(e){
  console.log(e)
 }
}