const UserService = require('../../services/UserService')
const chai = require("chai")
const expect = chai.expect


describe("addOneUser", () => {
    it("Utilisateur correct - S", () => {
        const user_valid = {
            firstName : "Edouard",
            lastName : "Dupont",
            email : "edouard.dupont@gmail.com",
            username : "edupont"
        }
        UserService.addOneUser(user_valid, function(err, value){
            expect(value).to.be.a("object")
            expect(value).to.haveOwnProperty('_id')
        })
    })
    it("Utilisateur incorrect. (Sans firstName) - E", () => {
        var user = {
            lastName: "Dupont",
            email: "edouard.dupont@gmail.com",
            username: "edupont"
        }
        UserService.addOneUser(user, function (err, value) {
            expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1)
            expect(err).to.haveOwnProperty("fields")
            expect(err["fields"]).to.haveOwnProperty("firstName")
            expect(err['fields']['firstName']).to.equal('Path `firstName` is required.')
        }) 
    })
})


// // ------------ addOneUser ------------ //


// // UserService.updateOneUser('1', {lastName: "Maurice"},function(err, value) {
// //     if (err)
// //         console.log("Une erreur s'est produite.", err.msg)
// //     else {
// //         console.log(value)
// //     }
// // }) 
    
// // UserService.updateOneUser('1', {lastName: ""},function(err, value) {
// //     if (err)
// //         console.log("Une erreur s'est produite.", err.msg)
// //     else {
// //         console.log(value)
// //     }
// // })


// // const usersValid = [
// //     {
// //         firstName: "Edouard",
// //         lastName: "Dupont",
// //         email: "edouard.dupont@gmail.com",
// //         username: "edupont"
// //     },{
// //         firstName: "Aurelien",
// //         lastName: "Lisu",
// //         email: "ekfzejofze@gmail.com",
// //         username: ""
// //     },{
// //         firstName: "Kevin",
// //         lastName : "Bertrant",
// //         email: "swagg14@gmail.com",
// //         username : "didi"
// //     }
// // ]

// // UserService.addManyUsers(usersValid, function(err, value) {
// //     if (err)
// //         console.log("Une erreur s'est produite.", err.msg)
// //     else {
// //         console.log(value)
// //     }
    
// // })


// console.log("CHERCHER PLUSIEURS UTILISATEURS")
// const tabIds = ["100","200"]

// UserService.findManyUsers(tabIds, function(err, value){
//     console.log(value)
// })

// const id = "1"

// UserService.deleteOneUser(id, function(err, value){
//     if (err){
//         console.log("Une erreur c'est produite", err.msg)
//     }else{
//         console.log(value.msg)
//     }
// })

// describe("UserService", () => {
//     describe("POST - Function", () => {
//         describe("addOneUser", () =>{
//             it("Utilisateur valide - S", () => {
//                 const user_valid = {
//                     firstName : "Edouard",
//                     lastName : "Dupont",
//                     email : "edouard.dupont@gmail.com",
//                     username : "edupont"
//                 }
//                 UserService.addOneUser(user_valid, function(err, value){
//                     expect(value).to.be.a("object")
//                     expect(value).to.haveOwnProperty('id')
//                 })
//             })
//             it("Sans non d'utilisateur - E", () => {
//                 const user_without_username = {
//                     firstName:"Edouard",
//                     lastName:"Dupont",
//                     email:"edouard.dupont@gmail.com"
//                 }
//                 UserService.addOneUser(user_without_username, function (err, value){
//                     expect(err).to.haveOwnProperty('msg')
//                     expect(err).to.haveOwnProperty("key_required_not_include").with.lengthOf(1)
//                     expect(err).to.haveOwnProperty("key_required_empty").with.lengthOf(0)
//                 })
//             })
//             it ("Avec un champs requis vide - E", () => {
//                 const user_with_require_empty = {
//                     firstName:"Edouard",
//                     lastName : "Bernier",
//                     username: "",
//                     phone: "06.88.88.88.88"
//                 }
//                 UserService.addOneUser(user_with_require_empty, function(err, value){
//                     expect(err).to.haveOwnProperty('msg')
//                     expect(err).to.haveOwnProperty("key_required_empty").with.lengthOf(1)
//                 })
//             })
//             it ("Avec un champs en trop - S", () => {
//                 const user_with_sup_property = {
//                     firstName: "Edouard",
//                     lastName: "Dupont",
//                     username: "edupont",
//                     testing: true,
//                     phone: "0645102340",
//                     email: "edouard.dupont@gmail.com",

//                 }
//                 UserService.addOneUser(user_with_sup_property, function(err, value){
//                     expect(value).to.be.a("object")
//                 })
//             })
//         })
//         describe("addManyUsers", () =>{
//             it("Users valides - S", () => {
//                 const usersValides = [{
//                     firstName : "Edouard",
//                     lastName : "Dupont",
//                     email : "edouard.dupont@gmail.com",
//                     username : "edupont"
//                 },{
//                     firstName : "Aurelien",
//                     lastName : "MOSINI",
//                     email : "mosiaur@gmail.com",
//                     username : "amos"
//                 },{
//                     firstName : "Charles",
//                     lastName : "Tituts",
//                     email : "dsqdsq.fdsfs@gmail.com",
//                     username : "chaTitus"
//                 }]
            
//                 UserService.addManyUsers(usersValides, function(err, value){
//                     value.forEach(e => {
//                         expect(e).to.be.a("object")
//                         expect(e).to.haveOwnProperty("id")
//                         expect(e).to.haveOwnProperty("lastName")
//                     });
//                 })
//             })
//             it("User 1 manque un champs - E", () => {
//                 const usersnotValide = [{
//                     firstName : "Edouard",
//                     email : "edouard.dupont@gmail.com",
//                     username : "edupont"
//                 },{
//                     firstName : "Aurelien",
//                     lastName : "MOSINI",
//                     email : "mosiaur@gmail.com",
//                     username : "amos"
//                 },{
//                     firstName : "Charles",
//                     lastName : "Tituts",
//                     email : "dsqdsq.fdsfs@gmail.com",
//                     username : "chaTitus"
//                 }]
            
//                 UserService.addManyUsers(usersnotValide, function(err, value){
//                     expect(err).to.have.lengthOf(1)
//                     expect(err[0]).to.haveOwnProperty("msg")
//                     expect(err[0]).to.haveOwnProperty("key_required_not_include").with.lengthOf(1)

//                 })
//             })
//             it("User 2 champs en trop - S", () => {
//                 const users_with_unexpected_keys = [{
//                     firstName : "Edouard",
//                     lastName : "Bernier",
//                     email : "edouard.dupont@gmail.com",
//                     username : "edupont"
//                 },{
//                     firstName : "Aurelien",
//                     lastName : "MOSINI",
//                     email : "mosiaur@gmail.com",
//                     hello : "tititititi",
//                     username : "amos"
//                 },{
//                     firstName : "Charles",
//                     lastName : "Tituts",
//                     email : "dsqdsq.fdsfs@gmail.com",
//                     username : "chaTitus"
//                 }]
            
//                 UserService.addManyUsers(users_with_unexpected_keys, function(err, value){
//                     expect(value).to.have.lengthOf(3)
//                     value.forEach(e => {
//                         expect(e).to.be.a("object")
//                         expect(e).to.haveOwnProperty("id")
//                         expect(e).to.not.have.property("hello")
//                     });
//                 })
//             })
//             it("User 2 champs vide - E", () => {
//                 const users_with_unexpected_keys = [{
//                     firstName : "Edouard",
//                     lastName : "Bernier",
//                     email : "edouard.dupont@gmail.com",
//                     username : "edupont"
//                 },{
//                     firstName : "Aurelien",
//                     lastName : "",
//                     email : "mosiaur@gmail.com",
//                     hello : "tititititi",
//                     username : "amos"
//                 },{
//                     firstName : "Charles",
//                     lastName : "Tituts",
//                     email : "dsqdsq.fdsfs@gmail.com",
//                     username : "chaTitus"
//                 }]
            
//                 UserService.addManyUsers(users_with_unexpected_keys, function(err, value){
//                     expect(err).to.have.lengthOf(1)
//                     expect(err[0]).to.haveOwnProperty("msg")
//                     expect(err[0]).to.haveOwnProperty("key_required_empty").with.lengthOf(1)
//                 })
//             })
//             it("User 1 et 2 champs absent et vide - E", () => {
//                 const users_with_unexpected_keys = [{
//                     firstName : "Edouard",
//                     email : "edouard.dupont@gmail.com",
//                     username : "edupont"
//                 },{
//                     firstName : "Aurelien",
//                     lastName : "",
//                     email : "mosiaur@gmail.com",
//                     hello : "tititititi",
//                     username : "amos"
//                 },{
//                     firstName : "Charles",
//                     lastName : "Tituts",
//                     email : "dsqdsq.fdsfs@gmail.com",
//                     username : "chaTitus"
//                 }]
            
//                 UserService.addManyUsers(users_with_unexpected_keys, function(err, value){
//                     expect(err).to.have.lengthOf(2)
//                     expect(err[0]).to.haveOwnProperty("msg")
//                     expect(err[0]).to.haveOwnProperty("key_required_not_include").with.lengthOf(1)
//                     expect(err[1]).to.haveOwnProperty("msg")
//                     expect(err[1]).to.haveOwnProperty("key_required_empty").with.lengthOf(1)
//                     expect(err[1]).to.haveOwnProperty("key_required_not_include").with.lengthOf(0)
//                 })
//             })
//         })
//     })
//     describe("UPDATE - Function", () => {
//         describe("updateOneUser", () => {
//             it("modification valide - S",() => {
//                 UserService.updateOneUser("1",{username:"bertrand"},function(err,value){
//                     expect(value).to.be.a("object")
//                     expect(value).to.haveOwnProperty("id")
//                     expect(value).to.haveOwnProperty("username")
//                     expect(value.username).to.equal("bertrand")
//                 })
//             })
//             it("modification avec champs vide sur lastName -E", () => {
//                 UserService.updateOneUser("1",{lastName :""}, function (err,value){
//                     expect(err).to.haveOwnProperty("msg")
//                     expect(err).to.haveOwnProperty("key_required_empty").with.lengthOf(1, "Le tableau n'a pas retourne le nombre de correcte d'element empty.")
//                 })
//             })
//             it("modification avec ID invalide -E", () => {
//                 UserService.updateOneUser("",{lastName :"Thierry"}, function (err,value){
//                     expect(err).to.haveOwnProperty("msg")
//                     expect(err).to.not.have.property("key_required_empty")
//                     expect(err).to.not.have.property("key_required_not_include")
//                 })
//             })
//         })
//     })
//     describe("DELETE - Function", () => {
//         describe("deleteOneUser", () => {
//             it("suppression réussi - S",() => {
//                 UserService.deleteOneUser("1", function(err, value){
//                     expect(value).has.ownProperty("msg")
//                     value.newTab.forEach((e) => {
//                         expect(e).not.have.property("id","1")
//                     })
//                 })
//             })
//             it("suppression ID manquant - E",() => {
//                 UserService.deleteOneUser("10", function(err, value){
//                     expect(err).haveOwnProperty("msg")
//                 })
//             })
//         })
//     })
//     describe("GET - Function", () => {
//         describe("findOneUser", () => {
//             it("Chercher un utilisateur existant correct - S", () => {
//                 UserService.findOneUser("0", function(err, value){
//                     console.log(value)
//                     expect(value).to.be.a("object")
//                     expect(value).to.haveOwnProperty("id")
//                     expect(value).to.haveOwnProperty("lastName")
//                     expect(value["id"]).to.equal("1")
//                 })
//             })
//             it("Checher un utilisateur non-existant correct - E", () => {
//                 UserService.findOneUser("100", function(err, value){
//                     expect(err).to.haveOwnProperty("msg")
//                     expect(err).to.haveOwnProperty('error_type')
//                     expect(err["error_type"]).to.equal('Not_Found')
//                 })
//             })
//         })
//     })

// })