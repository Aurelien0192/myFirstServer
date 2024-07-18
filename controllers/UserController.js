const UserService = require('../services/UserService')
const LoggerHttp = require('../utils/logger').http
const passport = require('passport')

//La fonction pour gerer l'authentification depuis passport
module.exports.loginUser = function(req, res, next){
    passport.authenticate('login', {badRequestMessage: "Les champs sont manquants."}, async function (err, user){
        if(err){
            res.statusCode=401
            return res.send({msg: "Le nom d'utilisateur ou mot de passe n'est pas correct", type_error:"no-valid-login"})
        }else{
            req.logIn(user, async function(err){
                if (err) {
                    res.statusCode=500
                    return res.send({msg:"Problème d'authentification sur le serveur", type_error:"internal"})
                }else{
                    return res.send(user)
                }
            })
        }
    })(req,res,next)
}

// ajout d'un utilisateur
module.exports.addOneUser = function (req,res){
    
    req.log.info("Création d'un utilisateur")
UserService.addOneUser(req.body, null,function(err, value) {
        if(err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }else if(err && err.type_error === "duplicate"){
            res.statusCode = 405
            res.send(err)
        }else if(err && (err.type_error == "validator")) {
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
    req.log.info("Ajout plusieurs utilisateurs")
    UserService.addManyUsers(req.body, null, function(err, value) {
        if(err && err.type_error == "no-found"){
            res.statusCode = 404
            res.send(err)
        }else if(err && err[0].type_error === "duplicate"){
            res.statusCode = 405
            res.send(err)
        }else if(err && err[0].type_error == "validator") {
            res.statusCode = 405
            res.send(err)
        }else {
            res.statusCode = 201 //création réussit
            res.send(value)
        }
    })
}

module.exports.FindOneUser = function (req, res) {
    LoggerHttp(req, res)

    let fields = req.query.fields
    if (fields && !Array.isArray(fields)){
        fields = [fields]
    }
    const opts = {populate: req.query.populate}
    UserService.findOneUser(fields, req.query.value, null, function(err, value) {
        req.log.info("chercher un utilisateur par un champs")
        if (err && err.type_error === "no-found"){
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error === "no-valid"){
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error === "no-valid"){
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

// recherche d'un utilisateur
module.exports.FindOneUserById = function (req,res){
    const opts = {populate: req.query.populate}
    UserService.FindOneUserById(req.params.id, opts, function(err, value) { 
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
            res.statusCode = 200
            res.send(value)
        }
    })
}

module.exports.findManyUsers = function (req,res){
    const opts = {populate: req.query.populate}
    UserService.findManyUsers(req.query.page, req.query.limit, req.query.q, opts, function(err, value){
        req.log.info("chercher tous les utilisateurs avec limit")
        if(err && err.type_error == "no-valid"){
            res.statusCode = 405
            res.send(err)
        }else if(err && err.type_error == "error-mongo"){
            res.statusCode = 500
            res.send(err)
        }
        else{
            res.statusCode = 200
            res.send(value)
        }
    })
}
// recherche de plusieurs utilisateurs
module.exports.findManyUsersById = function (req, res) {
    req.log.info("chercher plusieurs utilisateurs")
    let arg = req.query.id
    if (arg && !Array.isArray(arg)){
        arg = [arg]
    }
    const opts = {populate: req.query.populate}
    UserService.findManyUsersById(arg, opts, function (err, value) {
        if(err && err.type_error == "no-found") {
            res.statusCode = 404;
            res.send(err);
        }else if (err && err.type_error == "no-valid") {
            res.statusCode = 405;
            res.send(err);
        }else if(err && err.type_error === "duplicate"){
            res.statusCode = 405
            res.send(err)
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
    req.log.info("supprimer un utilisateur")
    UserService.deleteOneUser(req.params.id, null, function (err, value) {
        if(err && err.type_error === "no-found") {
            res.statusCode = 404;
            res.send(err);
        }else if (err && err.type_error === "no-valid") {
            res.statusCode = 405;
            res.send(err);
        }else if(err && err.type_error === "error-mongo") {
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
    req.log.info("supprimer plusieurs utilisateurs")
    let arg = req.query.id
    if (arg && !Array.isArray(arg)){
        arg = [arg]
    }
    UserService.deleteManyUsers(arg, null, function(err, value) {
        if(err && err.type_error == "no-found"){
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
// modification d'un utilisateur
module.exports.updateOneUser = function (req,res){
    req.log.info("modifier un utilisateur")
    UserService.updateOneUser(req.params.id, req.body, null, function(err, value) {
        if(err && err.type_error == "no-found") {
            res.statusCode = 404;
            res.send(err);
        }else if(err && err.type_error === "duplicate") {
            res.statusCode = 405
            res.send(err)
        }else if(err && (err.type_error == "validator" | err.type_error === "no-valid")) {
            res.statusCode = 405
            res.send(err)
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
    req.log.info("modifier plusieurs utilisateurs")
    let arg = req.query.id
    if (arg && !Array.isArray(arg)){
        arg = [arg]
    }
    var updateData = req.body
    UserService.updateManyUsers(arg, updateData, null, function(err, value) {
        if(err && err.type_error == "no-found") {
            res.statusCode = 404;
            res.send(err);
        }else if(err && (err.type_error == "validator" | err.type_error === "no-valid")) {
            res.statusCode = 405
            res.send(err)
        }else if(err && err.type_error === "duplicate") {
            res.statusCode = 405
            res.send(err)
        }else if(err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }else {
            res.statusCode = 201;
            res.send(value);
        }
    });
}