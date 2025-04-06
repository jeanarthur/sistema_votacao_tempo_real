const mongoose = require("mongoose")

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName:'real-time-vote'
        })
        console.log("Conectado ao MongoDB Atlas")
    }catch(err){
        console.log("Erro ao conectar no banco.", err)
        process.exit(1)
    }
}

module.exports = connectDB