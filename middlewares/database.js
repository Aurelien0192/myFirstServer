const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()

module.exports.controlsBDD = (req, res, next) => {
    if (mongoose.connection.readyState === 1){
        console.req
        req.log.info("Vérification de la connection à la base de donnée : OK")
        next()
    }else{
        req.log.error("Vérification de la connection à la base de donnée : NOK")
        res.statusCode = 500
        res.send({msg: "La base de donnée est en erreur", type_error:"error connexion DB"})
    }
}