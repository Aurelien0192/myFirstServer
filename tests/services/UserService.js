const UserService = require('../../services/UserService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_user_valid = ""
var tab_id_users = []

describe("addOneUser", () => {
    it("Utilisateur correct. - S", () => {
        var user = {
            firstName: "Edouard",
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "edupont"
        }
        UserService.addOneUser(user, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            id_user_valid = value._id
            //console.log(value)
        }) 
    })
     it("Utilisateur incorrect. (Sans firstName) - E", () => {
        var user_no_valid = {
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "edupont"
        }
        UserService.addOneUser(user_no_valid, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('firstName')
            expect(err['fields']['firstName']).to.equal('Path `firstName` is required.')

        }) 
    }) 
})

describe("addMultiUsers", () => {

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

        UserService.addMultiUsers(users_tab_error, function(err, value) {
            done()
        })
    })
    it("Utilisateurs à ajouter, valide. - S", (done) => {
        var users_tab = [{
            firstName: "Louison",
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "edupont"
        }, {
            firstName: "Jordan",
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "La",
            testing: true,
            phone: "0645102340"
        },
        {
            firstName: "Mathis",
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "edupont",
            testing: true,
            phone: "0645102340"
        }]
 
        UserService.addMultiUsers(users_tab, function(err, value) {
           tab_id_users = _.map(value, '_id')
           expect(value).lengthOf(3)
            done()
        })
    })
})

describe("findOneUser", () => {
    it("Chercher un utilisateur existant correct. - S", (done) => {
        UserService.findOneUser(id_user_valid, function (err, value) {
            expect(value).to.be.a('object');
             expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('lastName') 
            done()
          
        })
    })
    it("Chercher un utilisateur non-existant correct. - E", (done) => {
        UserService.findOneUser("100", function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyUsers", () => {
    it("Chercher des utilisateurs existant correct. - S", (done) => {
        UserService.findManyUsers(tab_id_users, function (err, value) {
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
        UserService.updateOneUser(id_user_valid,{firstName : "", lastName : "richard"},function (err, value){
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
            expect(err).to.be.null
            expect(value).to.haveOwnProperty("deletedCount")
            expect(value["deletedCount"]).to.equal(1)
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
            console.log(err)
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
            expect(err["type_error"]).to.equal("no-valid-entry")
            done()
        })
    })
})
