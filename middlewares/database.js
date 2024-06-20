const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const Logger = require('../utils/logger').pino

module.exports.controlsBDD = (req, res, next) => {
    if (mongoose.connection.readyState === 1){
        console.log("hello")
        next()
    }else{
        res.statusCode = 500
        res.sand({msg: "La base de donnée est en erreur", type_error:"error connexion DB"})
    }
}