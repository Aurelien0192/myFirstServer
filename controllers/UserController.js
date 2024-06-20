const UserService = require('../services/UserService')
const LoggerHttp = require('../utils/logger').http

// ajout d'un utilisateur
module.exports.addOneUser = function (req,res){
    LoggerHttp(req, res)
    req.log.info("Création d'un utilisateur")
UserService.addOneUser(req.body, function(err, value) {
        if(err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }else if(err && err.type_error == "validator") {
            res.statusCode = 405
            res.send(err)
        }else {
            res.statusCode = 201 //création réussit
            res.send(value)
        }
    })
}

// ajout de plusieurs utilisateurs
module.exports.addManyUsers = function (req,res){
    LoggerHttp(req, res)
    req.log.info("Ajout plusieurs utilisateurs")
    UserService.addManyUsers(req.body, function(err, value) {
        if(err) {
            res.statusCode = 405
            res.send(err)
        }else {
            res.statusCode = 201
            res.send(value)
        }
    })
}
// recherche d'un utilisateur
module.exports.findOneUser = function (req,res){
    UserService.findOneUser(req.params.userId, function(err, value) {
        LoggerHttp(req, res)
        req.log.info("chercher un utilisateur")
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
            res.statusCode = 200
            res.send(value)
        }
    })
}
// recherche de plusieurs utilisateurs
module.exports.findManyUsers = function (req, res) {
    LoggerHttp(req, res)
        req.log.info("chercher plusieurs utilisateurs")
    let arg = req.query.id
    if (arg && !Array.isArray(arg)){
        arg = [arg]
    }
    UserService.findManyUsers(arg, function (err, value) {
        // console.log(err)
        if(err && err.type_error == "no-found") {
            res.statusCode = 404;
            res.send(err);
        }else if (err && err.type_error == "no-valid") {
            res.statusCode = 405;
            res.send(err);
        }else if(err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }else {
            res.statusCode = 200;
            res.send(value);
        }
    });
  };

// suppression d'un utilisateur
module.exports.deleteOneUser = function (req,res){
    LoggerHttp(req, res)
    req.log.info("supprimer un utilisateur")
    UserService.deleteOneUser(req.params.userId, function (err, value) {
        // console.log(err)
        if(err && err.type_error == "no-found") {
            res.statusCode = 404;
            res.send(err);
        }else if (err && err.type_error == "no-valid") {
            res.statusCode = 405;
            res.send(err);
        }else if(err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }else {
            res.statusCode = 200;
            res.send(value);
        }
    });
}
// suppression de plusieurs utilisateurs
module.exports.deleteManyUsers = function (req,res){
    LoggerHttp(req, res)
    req.log.info("supprimer plusieurs utilisateurs")
    let arg = req.query.id
    if (arg && !Array.isArray(arg)){
        arg = [arg]
    }
    UserService.deleteManyUsers(arg, function (err, value) {
        // console.log(err)
        if(err && err.type_error == "no-found") {
            res.statusCode = 404;
            res.send(err);
        }else if (err && err.type_error == "no-valid") {
            res.statusCode = 405;
            res.send(err);
        }else if(err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }else {
            res.statusCode = 204;
            res.send(value);
        }
    });
}
// modification d'un utilisateur
module.exports.updateOneUser = function (req,res){
    LoggerHttp(req, res)
    req.log.info("modifier un utilisateur")
    console.log(req.body)
    UserService.updateOneUser(req.params.userId, req.body, function (err, value) {
        // console.log(err)
        if(err && err.type_error == "no-found") {
            res.statusCode = 404;
            res.send(err);
        }else if (err && err.type_error == "no-valid") {
            res.statusCode = 405;
            res.send(err);
        }else if(err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }else {
            res.statusCode = 201;
            res.send(value);
        }
    });
}
// modification de plusieurs utilisateurs
module.exports.updateManyUsers = function (req,res){
    LoggerHttp(req, res)
    req.log.info("modifier plusieurs utilisateurs")
    let arg = req.query.id
    if (arg && !Array.isArray(arg)){
        arg = [arg]
    }
    var updateData = req.body
    UserService.updateManyUsers(arg, updateData, function (err, value) {
        // console.log(err)
        if(err && err.type_error == "no-found") {
            res.statusCode = 404;
            res.send(err);
        }else if (err && err.type_error == "no-valid") {
            res.statusCode = 405;
            res.send(err);
        }else if(err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }else {
            res.statusCode = 201;
            res.send(value);
        }
    });
}