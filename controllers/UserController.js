const UserService = require('../services/UserService')


// ajout d'un utilisateur
module.exports.addOneUser = function (req,res){
    
    req.log.info("Création d'un utilisateur")
UserService.addOneUser(req.body, function(err, value) {
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
    UserService.addManyUsers(req.body, function(err, value) {
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
    let fields = req.query.fields
    if (fields && !Array.isArray(fields)){
        fields = [fields]
    }
    
    UserService.findOneUser(fields, req.query.value, function(err, value) {
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
    UserService.FindOneUserById(req.params.id, function(err, value) { 
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
    
    UserService.findManyUsers(req.query.page, req.query.limit, function(err, value){
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
    UserService.findManyUsersById(arg, function (err, value) {
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
    UserService.deleteOneUser(req.params.id, function (err, value) {
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
    UserService.deleteManyUsers(arg, function (err, value) {
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
    UserService.updateOneUser(req.params.id, req.body, function (err, value) {
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
    UserService.updateManyUsers(arg, updateData, function (err, value) {
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