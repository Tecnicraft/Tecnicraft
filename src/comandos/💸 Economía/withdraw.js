const ecoSchema = require(`../../modelos/economia.js`);
module.exports = {
    name: "withdraw",
    aliases: ["wd", "sacar"],
    desc: "Sirve para depositar dinero en el banco",
    run: async (client, message, args, prefix) => {
        let data = await ecoSchema.findOne({userID: message.author.id});
        let cantidad = args[0];
        if(["todo", "all-in", "all"].includes(args[0])) {
            cantidad = data.banco
        } else {
            if(isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return message.reply("❌ **No has especificado una cantidad válida para sacar!**");
            if(cantidad > data.banco) return message.reply("❌ **No tienes tanto dinero para sacar!**");
        }
       await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
           $inc: {
               banco: -cantidad,
               dinero: cantidad,
           }
       });
       return message.reply(`✅ **Has sacado \`${cantidad} monedas\` de tu banco!**`);
    }
}