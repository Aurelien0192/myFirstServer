const mongoose = require('mongoose')

module.exports.controlsBDD = (req, res, next) => {
    if (mongoose.connection.readyState === 1){
        req.log.info("Vérification de la connection à la base de donnée : OK")
        next()
    }else{
        req.log.error("Vérification de la connection à la base de donnée : NOK")
        res.statusCode = 500
        res.send({msg: `La base de donnée est en erreur ${mongoose.connection.readyState}`, type_error:"error connexion DB"})
    }
}