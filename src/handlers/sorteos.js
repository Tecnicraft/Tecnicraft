const { GiveawaysManager } = require('discord-giveaways');
const sorteosSchema = require(`../modelos/sorteos.js`);

module.exports = async client => {
    let db = await sorteosSchema.findOne({ ID: "sorteos" });
    if (!db || db == null) {
        db = await new sorteosSchema();
        await db.save();
    }

    const SorteosConMongoDB = class SorteosMongoDB extends GiveawaysManager {

        async getAllGiveaways() {
            let db = await sorteosSchema.findOne({ ID: "sorteos" });
            return db.data;
        }

        async saveGiveaway(messageID, datoSorteo) {
            await sorteosSchema.findOneAndUpdate({ ID: "sorteos" }, {
                $push: {
                    data: datoSorteo
                }
            });
            return true;
        }

        async editGiveaway(messageID, datoSorteo) {
            let db = await sorteosSchema.findOne({ ID: "sorteos" });
            let sorteos = db.data;

            let sorteoIndex = -1;
            sorteos.map((sorteo, index) => {
                if (sorteo.messageId.includes(messageID)) return sorteoIndex = index;
            })
            console.log(sorteoIndex);
            if (sorteoIndex > -1) {
                db.data[sorteoIndex] = datoSorteo;
                await sorteosSchema.findOneAndUpdate({ ID: "sorteos" }, db)
                return true;
            }
        }

        async deleteGiveaway(messageID) {
            let db = await sorteosSchema.findOne({ ID: "sorteos" });
            let sorteos = db.data;
            let sorteoIndex = -1;
            sorteos.map((sorteo, index) => {
                if (sorteo.messageId.includes(messageID)) return sorteoIndex = index;
            })
            if (sorteoIndex > -1) {
                db.data.splice(sorteoIndex, 1)
                await sorteosSchema.findOneAndUpdate({ ID: "sorteos" }, db)
                return true;
            }
        }
    }

    client.giveawaysManager = new SorteosConMongoDB(client, {
        default: {
            botsCanWin: false,
            embedColor: client.color,
            embedColorEnd: "#000000",
            reaction: "🎉"
        }
    })
}