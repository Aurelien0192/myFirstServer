const ArticleService = require('../../services/ArticleService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_article_valid = ""
var tab_id_articles = []
var article_no_valid = {
            name: "rasoir",
            price: 12.50,
            quantity:30,

        }

let articles = []

describe("addOneArticle", () => {
    it("article correct. - S", (done) => {
        var article = {
            name: "rasoir",
            description: "coupe aussi bien qu'un chaudron",
            price: 12.50,
            quantity:30,
        }
        ArticleService.addOneArticle(article, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            id_article_valid = value._id
            articles.push(value)
            // 
            id_article_valid = value._id
            //
            done()
        }) 
    })
    it("article incorrect. (Sans description) - E", () => {
        ArticleService.addOneArticle(article_no_valid, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('description')
            expect(err['fields']['description']).to.equal('Path `description` is required.')

        }) 
    })
    it("article avec champs en trop- E", () => {
        
        ArticleService.addOneArticle(article_no_valid, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('description')
            expect(err['fields']['description']).to.equal('Path `description` is required.')
        }) 
    })
})



describe("addManyArticlesById", () => {
    it("articles à ajouter, non valide. - E", (done) => {
        var articles_tab_error = [{
            name: "rasoir",
            description: "coupe aussi bien qu'un chaudron",
            price: 12.50,
            quantity:30,
        }, {
            name: "rasoir",
            description: "coupe aussi bien qu'un chaudron",
            price: 12.50,
            quantity:30,
            testing: true,
            phone: "0645102340"
        },
        {
            name: "rasoir",
            description: "coupe aussi bien qu'un chaudron",
            price: 12.50,
            quantity:30,
            testing: true,
            phone: "0645102340"
        }, {
            name:"moi"
        }]

        ArticleService.addManyArticles(articles_tab_error, function(err, value) {
            expect(err).to.be.a('array')
            expect(err[0]).to.be.a('object')
            expect(err[0]).to.haveOwnProperty("type_error")
            expect(err[0]["type_error"]).to.be.equal('validator')
            done()
        })
    })
    it("articles à ajouter, valide. - S", (done) => {
        var articles_tab = [{
            name: "rasoir",
            description: "coupe aussi bien qu'un chaudron",
            price: 12.50,
            quantity:30,
        }, {
            name: "rasoir",
            description: "coupe aussi bien qu'un chaudron",
            price: 12.50,
            quantity:30,
        },
        {
            name: "rasoir",
            description: "coupe aussi bien qu'un chaudron",
            price: 12.50,
            quantity:30,
        }]
 
        ArticleService.addManyArticles(articles_tab, function(err, value) {
           tab_id_articles = _.map(value, '_id')
           articles = [...value,...articles]
           expect(value).lengthOf(3)
            done()
        })
    })
})

describe("FindOneArticleById", () => {
    it("Chercher un article existant correct. - S", (done) => {
        ArticleService.FindOneArticleById(id_article_valid, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name') 
            done()
          
        })
    })
    it("Chercher un article non-existant correct. - E", (done) => {
        ArticleService.FindOneArticleById("100", function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findOneArticle", () => {
    it ("Chercher un article existant correct via name -S", (done) => {
        ArticleService.findOneArticle(["name"],articles[3].name,function (err,value){
            expect(value).to.be.a("object")
            expect(value).to.haveOwnProperty("name")
            expect(value["name"]).to.equal(articles[3].name)
            expect(err).to.be.null
           done()
        })
    })
    it ("Chercher un article avec un champ non autorisé - E", (done) => {
        ArticleService.findOneArticle(["description"],articles[0].name, function (err, value){
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            expect(value).to.be.undefined
            done()
        })
    })
    it ("Chercher un article sans talbeau de champs - E", (done) => {
        ArticleService.findOneArticle("name",articles[0].name, function (err, value){
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            expect(value).to.be.undefined
            done()
        })
    })
    it ("Chercher un article inexistant - E", (done) => {
        ArticleService.findOneArticle(["name"],"articles[0].name", function (err, value){
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-found")
            expect(value).to.be.undefined
            done()
        })
    })
})

describe("findManyArticles", () => {
    it("Retourne 3 articles sur les 5 -S", (done) => {
        ArticleService.findManyArticles(null,1,3, function (err, value){
            console.log(err, value)
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(4)
            expect(value["results"]).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it("envoie chaine de caractère sur page - E", (done) => {
        ArticleService.findManyArticles(null,"coucou", 3, function(err, value){
            
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("findManyArticlesById", () => {
    it("Chercher des articles existant correct. - S", (done) => {
        ArticleService.findManyArticlesById(tab_id_articles, function (err, value) {
            expect(value).lengthOf(3)
            done()
        })
    })
})

describe("updateOneArticle", () => {
    it("Modifier un article avec id correct - S", (done) => {
        ArticleService.updateOneArticle(id_article_valid, {name : "tonton", description : "vend mon tonton, très peu servi"}, function(err, value) {
            expect(err).is.null
            expect(value).is.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value['name']).to.equal('tonton')
            done()
        })  
    })
    it("Modification article avec id incorrect - E", (done) => {
        ArticleService.updateOneArticle("100",{name : "tonton", description : "vend mon tonton, très peu servi"},function (err, value){
            expect(err).to.be.a("object")
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err['type_error']).to.equal("no-valid")
            done()
        })
    })
    it("Modification article avec champs requis vide - E", (done) => {
        ArticleService.addOneArticle(article_no_valid, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('description')
            expect(err['fields']['description']).to.equal('Path `description` is required.')
            done()
        }) 
    }) 
})

describe("updateManyArticles", () => {
    it("Modification articles avec id conformes - S", (done) =>{
        ArticleService.updateManyArticles(tab_id_articles,{name:"Boudha"}, function (err, value){
            
            expect(err).to.be.null
            expect(value).to.haveOwnProperty("modifiedCount")
            expect(value).to.haveOwnProperty("matchedCount")
            expect(value["modifiedCount"]).to.equal(tab_id_articles.length)
            expect(value["matchedCount"]).to.equal(tab_id_articles.length)
            done()
        })
    })
    it("Modification articles avec champs requis vide - E", (done) => {
        ArticleService.updateManyArticles(tab_id_articles,{name:""}, function (err, value){
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1)
            expect(err).to.haveOwnProperty("fields")
            expect(err["fields"]).to.haveOwnProperty("name")
            expect(err["fields"]['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe('deleteOneArticle', () => {
    it('suppression un article id valide - S', (done) => {
        ArticleService.deleteOneArticle(id_article_valid, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("_id")
            done()
        })
    })
    it('suppression un article id invalide - E', (done) => {
        ArticleService.deleteOneArticle("100", function(err, value){
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            done()
        })
    })
        it('suppression un article id inexistant - E', (done) => {
        ArticleService.deleteOneArticle("665ee29270f158326232d893", function(err, value){
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-found")
            done()
        })
    })
})

describe('deleteManyArticles', () => {
    it("supression d'article avec ID valide - S", (done) => {
        ArticleService.deleteManyArticles(tab_id_articles, function(err, value){
            expect(err).to.be.null
            expect(value).to.haveOwnProperty("deletedCount")
            expect(value["deletedCount"]).to.equal(tab_id_articles.length)
            done()
        })
    })
    it("supression d'article avec ID non valide - E", (done) => {
        ArticleService.deleteManyArticles(["100","200","300"], function(err, value){
            
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            done()
        })
    })
    it("supression d'article avec ID manquant - E", (done) => {
        ArticleService.deleteManyArticles([], function(err, value){
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            done()
        })
    })
})
