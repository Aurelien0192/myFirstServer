const { values } = require('lodash')
const { addManyUsers } = require('../../controllers/UserController')
const UserService = require('../../services/UserService')
const chai = require("chai")
const expect = chai.expect


// // ------------ addOneUser ------------ //
// //Avec un utilsiateur valide
// var user_valid = {
//     firstName: "Edouard",
//     lastName: "Dupont",
//     email: "edouard.dupont@gmail.com",
//     username: "edupont"
// }
// UserService.addOneUser(user_valid, function(err, value) {
//     if (err)
//         console.log("Une erreur s'est produite.", err.msg)
//     else {
//         console.log(value)
//     }
// }) 

// // // Sans nom d'utilisateur
// var user_without_username = {
//     firstName: "Edouard",
//     lastName: "Dupont",
//     email: "edouard.dupont@gmail.com"
// }
// UserService.addOneUser(user_without_username, function(err, value) {
//     if (err)
//         console.log("Une erreur s'est produite.", err.msg)
//     else {
//         console.log(value)
//     }
// })
// // // Avec un champs en trop
// var user_with_not_authorized_key = {
//     firstName: "Edouard",
//     lastName: "Dupont",
//     email: "edouard.dupont@gmail.com",
//     username: "edupont",
//     testing: true,
//     phone: "0645102340"
// }
//  UserService.addOneUser(user_with_not_authorized_key, function(err, value) {
//     if (err)
//         console.log("Une erreur s'est produite.", err.msg)
//     else {
//         console.log(value)
//     }
// })

// // // Avec un champs requis vide
// var user_with_not_authorized_key = {
//     firstName: "Edouard",
//     lastName: "Dupont",
//     email: "edouard.dupont@gmail.com",
//     username: "",
//     testing: true,
//     phone: "0645102340"
// }
// UserService.addOneUser(user_with_not_authorized_key, function(err, value) {
//     if (err)
//         console.log("Une erreur s'est produite.", err.msg)
//     else {
//         console.log(value)
//     }
// }) 


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

describe("UserService", () => {
    it("addOneUser - Utilisateur valide", () => {
        const user_valid = {
            firstName : "Edouard",
            lastName : "Dupont",
            email : "edouard.dupont@gmail.com",
            username : "edupont"
        }
        UserService.addOneUser(user_valid, function(err, value){
            expect(value).to.be.a("object")
            expect(value).to.haveOwnProperty('id')
        })
    })
    it("addOneUser - Sans non d'utilisateur", () => {
        const user_without_username = {
            firstName:"Edouard",
            lastName:"Dupont",
            email:"edouard.dupont@gmail.com"
        }
        UserService.addOneUser(user_without_username, function (err, value){
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty("key_required_not_include").with.lengthOf(1)
        })
    })
})