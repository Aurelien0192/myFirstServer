const UserService = require('../../services/UserService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_user_valid = ""
var tab_id_users = []
var user_no_valid = {
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "edupont"
        }

let users = []

describe("addOneUser", () => {
    it("Utilisateur correct. - S", (done) => {
        var user = {
            firstName: "Edouard",
            lastName: "Dupont",
            email: "edouard.dupont2@gmail.com",
            username: "edupont2"
        }
        UserService.addOneUser(user, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            id_user_valid = value._id
            users.push(value)
            // 
            id_user_valid = value._id
            //
            done()
        }) 
    })
    it("Utilisateur incorrect. (Sans firstName) - E", () => {
        UserService.addOneUser(user_no_valid, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('firstName')
            expect(err['fields']['firstName']).to.equal('Path `firstName` is required.')

        }) 
    })
    it("Utilisateur avec champs en trop- E", () => {
        
        UserService.addOneUser(user_no_valid, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('firstName')
            expect(err['fields']['firstName']).to.equal('Path `firstName` is required.')
        }) 
    })
})



describe("addManyUsersById", () => {
    it("Utilisateurs à ajouter, non valide. - E", (done) => {
        var users_tab_error = [{
            firstName: "Edouard",
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "edupont"
        }, {
            firstName: "Edouard",
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "",
            testing: true,
            phone: "0645102340"
        },
        {
            firstName: "Edouard",
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "edupont",
            testing: true,
            phone: "0645102340"
        }, {
            firstName: "Edouard",
            email: "edouard.dupont@gmail.com"
        }]

        UserService.addManyUsers(users_tab_error, function(err, value) {
            done()
        })
    })
    it("Utilisateurs à ajouter, valide. - S", (done) => {
        var users_tab = [{
            firstName: "Louison",
            lastName: "Dupont",
            email: "lafraise@despres.com",
            username: "treue"
        }, {
            firstName: "Jordan",
            lastName: "Dupont",
            email: "Element.rush@adaz.fr",
            username: "La",
            testing: true,
            phone: "0645102340"
        },
        {
            firstName: "Mathis",
            lastName: "Dupont",
            email: "mafezo@zgeoifze.fr",
            username: "lalala",
            testing: true,
            phone: "0645102340"
        }]
 
        UserService.addManyUsers(users_tab, function(err, value) {
           tab_id_users = _.map(value, '_id')
           users = [...value,...users]
           expect(value).lengthOf(3)
            done()
        })
    })
})

describe("FindOneUserById", () => {
    it("Chercher un utilisateur existant correct. - S", (done) => {
        UserService.FindOneUserById(id_user_valid, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('lastName') 
            done()
          
        })
    })
    it("Chercher un utilisateur non-existant correct. - E", (done) => {
        UserService.FindOneUserById("100", function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findOneUser", () => {
    it ("Chercher un utilisateur existant correct via username -S", (done) => {
        UserService.findOneUser(["username"],users[3].username,function (err,value){
            expect(value).to.be.a("object")
            expect(value).to.haveOwnProperty("username")
            expect(value["username"]).to.equal(users[3].username)
            expect(err).to.be.null
           done()
        })
    })
    it ("Chercher un utilisateur existant correct via email -S", (done) => {
        UserService.findOneUser(["email"],users[3].email,function (err,value){
            expect(value).to.be.a("object")
            expect(value).to.haveOwnProperty("email")
            expect(value["email"]).to.equal(users[3].email)
            expect(err).to.be.null
            done()
        })
    })
    it ("Chercher un utilisateur existant correct via email et username -S", (done) => {
        UserService.findOneUser(["username","email"],"edupont",function (err,value){
            expect(value).to.be.a("object")
            expect(value).to.haveOwnProperty("username")
            expect(value["username"]).to.include("dupont")
            expect(err).to.be.null
            done()
        })
    })
    it ("Chercher un utilisateur avec un champ non autorisé - E", (done) => {
        UserService.findOneUser(["email", "firstName"],users[0].username, function (err, value){
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            expect(value).to.be.undefined
            done()
        })
    })
    it ("Chercher un utilisateur sans talbeau de champs - E", (done) => {
        UserService.findOneUser("email",users[0].username, function (err, value){
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            expect(value).to.be.undefined
            done()
        })
    })
    it ("Chercher un utilisateur inexistant - E", (done) => {
        UserService.findOneUser(["email"],"users[0].username", function (err, value){
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-found")
            expect(value).to.be.undefined
            done()
        })
    })
})

describe("findManyUsers", () => {
    it("Retourne 3 utilisateurs sur les 5 -S", (done) => {
        UserService.findManyUsers(1,3,"" ,function (err, value){
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(5)
            expect(value["results"]).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it("envoie chaine de caractère sur page - E", (done) => {
        UserService.findManyUsers(null,"coucou", 3, function(err, value){
            
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("findManyUsersById", () => {
    it("Chercher des utilisateurs existant correct. - S", (done) => {
        UserService.findManyUsersById(tab_id_users, function (err, value) {
            expect(value).lengthOf(3)
            done()
        })
    })
})

describe("updateOneUser", () => {
    it("Modifier un utilisateur avec id correct - S", (done) => {
        UserService.updateOneUser(id_user_valid, {firstName : "tonton", lastName : "richard"}, function(err, value) {
            expect(err).is.null
            expect(value).is.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('lastName')
            expect(value['lastName']).to.equal('richard')
            done()
        })  
    })
    it("Modification utilisateur avec id incorrect - E", (done) => {
        UserService.updateOneUser("100",{firstName : "tonton", lastName : "richard"},function (err, value){
            expect(err).to.be.a("object")
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err['type_error']).to.equal("no-valid")
            done()
        })
    })
    it("Modification utilisateur avec champs requis vide - E", (done) => {
        UserService.addOneUser(user_no_valid, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('firstName')
            expect(err['fields']['firstName']).to.equal('Path `firstName` is required.')
            done()
        }) 
    }) 
})

describe("updateManyUsers", () => {
    it("Modification utilisateurs avec id conformes - S", (done) =>{
        UserService.updateManyUsers(tab_id_users,{firstName:"Boudha"}, function (err, value){
            
            expect(err).to.be.null
            expect(value).to.haveOwnProperty("modifiedCount")
            expect(value).to.haveOwnProperty("matchedCount")
            expect(value["modifiedCount"]).to.equal(tab_id_users.length)
            expect(value["matchedCount"]).to.equal(tab_id_users.length)
            done()
        })
    })
    it("Modification utilisateurs avec champs requis vide - E", (done) => {
        UserService.updateManyUsers(tab_id_users,{firstName:""}, function (err, value){
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1)
            expect(err).to.haveOwnProperty("fields")
            expect(err["fields"]).to.haveOwnProperty("firstName")
            expect(err["fields"]['firstName']).to.equal('Path `firstName` is required.')
            done()
        })
    })
})

describe('deleteOneUser', () => {
    it('suppression un utilisateur id valide - S', (done) => {
        UserService.deleteOneUser(id_user_valid, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("_id")
            done()
        })
    })
    it('suppression un utilisateur id invalide - E', (done) => {
        UserService.deleteOneUser("100", function(err, value){
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            done()
        })
    })
        it('suppression un utilisateur id inexistant - E', (done) => {
        UserService.deleteOneUser("665ee29270f158326232d893", function(err, value){
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-found")
            done()
        })
    })
})

describe('deleteManyUsers', () => {
    it("supression d'utilisateur avec ID valide - S", (done) => {
        UserService.deleteManyUsers(tab_id_users, function(err, value){
            expect(err).to.be.null
            expect(value).to.haveOwnProperty("deletedCount")
            expect(value["deletedCount"]).to.equal(tab_id_users.length)
            done()
        })
    })
    it("supression d'utilisateur avec ID non valide - E", (done) => {
        UserService.deleteManyUsers(["100","200","300"], function(err, value){
            
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            done()
        })
    })
    it("supression d'utilisateur avec ID manquant - E", (done) => {
        UserService.deleteManyUsers([], function(err, value){
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty("msg")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.equal("no-valid")
            done()
        })
    })
})
