const ecoSchema = require(`../../modelos/economia.js`);
const duration = require('humanize-duration');
var trabajos = [
    "Camionero",
    "Desarollador",
    "Mecánico",
    "Taxista"
];
module.exports = {
    name: "work",
    aliases: ["trabajar"],
    desc: "Sirve para trabajar y conseguir monedas cada 3h",
    run: async (client, message, args, prefix) => {
        let data = await ecoSchema.findOne({userID: message.author.id});
        let tiempo_ms = 3 * 60 * 60 * 1000
        let recompensa = Math.floor(Math.random() * 800) + 200;
        let trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];
        if(tiempo_ms - (Date.now() - data.work) > 0) {
            let tiempo_restante = duration(Date.now() - data.work - tiempo_ms,
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
            work: Date.now()
        })
        return message.reply(`✅ **Has trabajado como \`${trabajo}\` y has recibido una recompensa de \`${recompensa} monedas\`!**`)
    }
}