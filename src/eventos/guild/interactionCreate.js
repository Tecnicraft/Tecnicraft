module.exports = async (client, interaction) => {
 if(!interaction.isCommand()) return;

 const slashcmds = client.slashcommands.get(interaction.commandName)

 if(!slashcmds) return;

 try{
  await slashcmds.run(client, interaction)
 } catch(e) {
  console.error(e)
 }
}