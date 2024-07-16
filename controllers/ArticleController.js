const ArticleService = require('../services/ArticleService')


// ajout d'un article
module.exports.addOneArticle = function (req,res){
    
    req.log.info("Création d'un article")
ArticleService.addOneArticle(req.body, function(err, value) {
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

// ajout de plusieurs articles
module.exports.addManyArticles = function (req,res){
    req.log.info("Ajout plusieurs articles")
    ArticleService.addManyArticles(req.body, function(err, value) {
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

module.exports.FindOneArticle = function (req, res) {
    const opts = {populate: req.query.populate}
    let fields = req.query.fields
    if (fields && !Array.isArray(fields)){
        fields = [fields]
    }
    
    ArticleService.findOneArticle(fields, req.query.value, opts, function(err, value) {
        req.log.info("chercher un article par un champs")
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

// recherche d'un article
module.exports.FindOneArticleById = function (req,res){
    const opts = {populate: req.query.populate}
    ArticleService.FindOneArticleById(req.params.id, opts, function(err, value) { 
        req.log.info("chercher un article par id")
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

module.exports.findManyArticles = function (req,res){
    const opts = {populate: req.query.populate}
    ArticleService.findManyArticles(req.query.q,req.query.page, req.query.limit, opts,function(err, value){
        req.log.info("chercher tous les articles avec limit")
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
// recherche de plusieurs articles
module.exports.findManyArticlesById = function (req, res) {
    const opts = {populate: req.query.populate}
    req.log.info("chercher plusieurs articles")
    let arg = req.query.id
    if (arg && !Array.isArray(arg)){
        arg = [arg]
    }
    ArticleService.findManyArticlesById(arg, opts, function (err, value) {
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

// suppression d'un article
module.exports.deleteOneArticle = function (req,res){
    req.log.info("supprimer un article")
    ArticleService.deleteOneArticle(req.params.id, function (err, value) {
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
// suppression de plusieurs articles
module.exports.deleteManyArticles = function (req,res){
    req.log.info("supprimer plusieurs articles")
    let arg = req.query.id
    if (arg && !Array.isArray(arg)){
        arg = [arg]
    }
    ArticleService.deleteManyArticles(arg, function (err, value) {
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
// modification d'un article
module.exports.updateOneArticle = function (req,res){
    req.log.info("modifier un article")
    ArticleService.updateOneArticle(req.params.id, req.body, function (err, value) {
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
// modification de plusieurs articles
module.exports.updateManyArticles = function (req,res){
    req.log.info("modifier plusieurs articles")
    let arg = req.query.id
    if (arg && !Array.isArray(arg)){
        arg = [arg]
    }
    var updateData = req.body
    ArticleService.updateManyArticles(arg, updateData, function (err, value) {
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