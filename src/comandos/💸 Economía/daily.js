const ecoSchema = require(`../../modelos/economia.js`);
const duration = require('humanize-duration');
module.exports = {
    name: "daily",
    aliases: ["diario"],
    desc: "Sirve para reclamar tu recompensa diaria",
    run: async (client, message, args, prefix) => {
        let data = await ecoSchema.findOne({userID: message.author.id});
        let tiempo_ms = 24 * 60 * 60 * 1000
        let recompensa = 1200;
        if(tiempo_ms - (Date.now() - data.daily) > 0) {
            let tiempo_restante = duration(Date.now() - data.daily - tiempo_ms,
            {
                language: "es",
                units: ["h", "m", "s"],
                round: true,
            })
            return message.reply(`🕑 **Tienes que esperar \`${tiempo_restante}\` para volver a reclamar tu recompensa diaria!**`)
        }
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc: {
                dinero: recompensa
            },
            daily: Date.now()
        })
        return message.reply(`✅ **Has reclamado tu recompensa diaria de \`${recompensa} monedas\`!**`)
    }
}