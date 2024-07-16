const { default: mongoose } = require('mongoose')
const UserService = require('../services/UserService')

module.exports.ControleIdUser = (req, res, next) => {
    let id = ''
    if(Array.isArray(req.body)){
        id = req.body[0].user_id
        let notConforme = 0
        req.body.forEach((user) => {
            id !== user.user_id ? notConforme = notConforme + 1 : notConforme = notConforme
        })
        notConforme > 0 ? id = null : id = id
    }else{
        id = req.body.user_id
    }
    

    UserService.FindOneUserById(id,null, function(err,value) {
        req.log.info("chercher un utilisateur par id")
        if(err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }else if(err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }else if(err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }else {
            next()
        }
        
    })
}