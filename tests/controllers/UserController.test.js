const chai = require('chai')
const chaiHttp = require('chai-http')
const { first } = require('lodash')
let expect = chai.expect
let should = chai.should()
const server = require("./../../server")
const _ = require("lodash")

let user = []
let users = []



chai.use(chaiHttp)

describe("POST - /user", () => {
    it("Ajouter un utilisateur - S", (done) => {
        chai.request(server).post('/user').send({
            firstName : "Dominique",
            lastName : "US",
            username : "domdom6",
            email: "diesel6@tatoine.com"
        }).end ((err, res) => {
            res.should.have.status(201)
            user.push(res.body)
            done()
        })
    })
    it("Ajouter un utilisateur avec champs duplicate - E", (done) => {
        chai.request(server).post('/user').send({
            firstName : "kiwi",
            lastName : "tit",
            username : "Ninin",
            email : "gegeo@zeklfjzoe.com"
        }).end((err,res) => {
            res.should.have.status(405)
            expect(res).to.haveOwnProperty("text")
            done()
        })
    })
    it("Ajouter utilisateur avec champs manquant - E", (done) => {
        chai.request(server).post('/user').send({
            firstName:"Aventador",
            username:"Piwiq",
            email: "gto@onizuka.jp"
        }).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Ajouter utilisateur avec champs vide - E", (done) => {
        chai.request(server).post('/user').send({
            firstName:"Aventador",
            lastname:"",
            username:"Piwiq",
            email: "gto@onizuka.jp"
        }).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("POST - /users", () => {
    it("Ajouter des utilisateurs - S", (done) => {
        chai.request(server).post('/users').send([{
            firstName : "edouard",
            lastName : "Till",
            username : "drfeeezfsqo5",
            email: "dezoleeefz@tatsqdsqoine.com5"
        },{
            firstName : "caapuce",
            lastName :"Poter",
            username : "kHeeffzeiP5",
            email : "eee.@poudlard.com5"
        }]).end ((err, res) => {
            res.should.have.status(201)
            users.push(res.body)
            done()
        })
    })
    it("Ajouter des utilisateurs avec chanmps duplicate - E", (done) => {
        chai.request(server).post('/users').send([{
            firstName : "Mathis",
            lastName : "Boisson",
            username : "footdu21",
            email: "fekofze"
        },{
            firstName : "dracaufeu",
            lastName : "Till",
            username : "baleck",
            email : "poketruffe@gmail.com"
        }]).end((err,res) => {
            res.should.have.status(405)
            expect(res).to.haveOwnProperty("text")
            done()
        })
    })
    it("Ajouter des utilisateurs avec champs manquant - E", (done) => {
        chai.request(server).post('/users').send([{
            firstName : "Mathis",
            lastName : "BOisson",
            username : "footdu21",
            email: "fe,kofze"
        },{
            firstName : "dracaufeu",
            username : "baleck",
            email : "poketruffe@gmail.com"
        }]).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Ajouter des utilisateurs avec champs vide - E", (done) => {
        chai.request(server).post('/users').send([{
            firstName : "Mathis",
            lastName : "BOisson",
            username : "footdu21",
            email: "fe,kofze"
        },{
            firstName : "dracaufeu",
            lastname : "",
            username : "baleck",
            email : "poketruffe@gmail.com"
        }]).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("GET - /user", () => {
    it("trouver un utilisateur via username correct - S", (done) => {
        chai.request(server).get('/user').query({fields : ["username"], value:user[0].username}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver un utilisateur via email correct - S", (done) => {
        chai.request(server).get('/user').query({fields : ["email"], value:user[0].email}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver un utilisateur via username correct et format fields incorrect - S", (done) => {
        chai.request(server).get('/user').query({fields : "username", value:user[0].username}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver un utilisateur via username correct fields incorrect - E", (done) => {
        chai.request(server).get('/user').query({fields : "lastName", value:user[0].username}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("trouver un utilisateur via username correct fields correct mais user inexistant - E", (done) => {
        chai.request(server).get('/user').query({fields : ["username"], value:"turturututdfshiqergherqi"}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("trouver un utilisateur sans aucune query - E", (done) => {
        chai.request(server).get('/user').end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("GET - /user/:id", () => {
    it("trouver un utilisateur avec ID incorrect - E", (done) => {
        chai.request(server).get(`/user/66756baf835213e8d650c3ac`).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("trouver un utilisateur avec ID incorrect - E", (done) => {
        chai.request(server).get(`/user/66756680`).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("trouver un utilisateur correct - S", (done) => {
        chai.request(server).get(`/user/${user[0]._id}`).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})

describe("GET - /users", () => {
    it("trouver des utilisateurs avec id correct non présent - E", (done) => {
        chai.request(server).get(`/users`).query({id:["66756baf835213e8d650c3ac"]}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("trouver des utilisateurs avec id inccorect- E", (done) => {
        chai.request(server).get(`/users`).query({id:["fdrtdrt"]}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("trouver des utilisateurs corrects - S", (done) => {
        chai.request(server).get(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})

describe("UPDATE - /user", () => {
    it("modifier un utilisateur avec ID correct - S", (done) => {
        chai.request(server).put(`/user/${user[0]._id}`).send({
            username : "kiwi"
        }).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("modifier un utilisateur avec ID correct mais champs non correct- E", (done) => {
        chai.request(server).put(`/user/${user[0]._id}`).send({
            username : ""
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier un utilisateur avec ID correct non présent - E", (done) => {
        chai.request(server).put('/user/667576cd3faa36454139a6a7').send({
            username : "kiwi"
        }).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("modifier un utilisateur avec ID incorrect - E", (done) => {
        chai.request(server).put('/user/667576c').send({
            username : "kiwi"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier un utilisateur correct avec valeur champs déjà existant sur champs unique - E", (done) => {
        chai.request(server).put(`/user/${users[0][0]._id}`).send({
            username : "kiwi"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("UPDATE - /users", () => {
    it("modifier des utilisateurs avec ID correct - S", (done) => {
        chai.request(server).put(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).send({
            lastName : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("modifier des utilisateurs avec ID correct mais non présent - E", (done) => {
        chai.request(server).put(`/users`).query({id:['667576cd3faa36454139a6a7',users[0][1]._id]}).send({
            lastName : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("modifier des utilisateurs avec ID incorrect - E", (done) => {
        chai.request(server).put(`/users`).query({id:['667576cd3',users[0][1]._id]}).send({
            lastName : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier des utilisateurs avec ID correct mais champs incorrect - E", (done) => {
        chai.request(server).put(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).send({
            lastName : ""
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier des utilisateurs avec ID correct champs unique en double - E", (done) => {
        chai.request(server).put(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).send({
            username : "titi"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("DELETE - /user", () => {
    it("supprimer un utilisateur avec ID incorrect - E", (done) => {
        chai.request(server).delete(`/user/66756680e15ea579048f90ef`).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("supprimer un utilisateur correct - S", (done) => {
        chai.request(server).delete(`/user/${user[0]._id}`).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})

describe("DELETE - /users", () => {
    it("supprimer des utilisateurs avec id correct non présent - E", (done) => {
        chai.request(server).delete(`/users`).query({id:["667576cd3faa36454139a6a7"]}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("supprimer des utilisateurs avec id incorrect- E", (done) => {
        chai.request(server).delete(`/users`).query({id:[true]}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("supprimer des utilisateurs corrects - S", (done) => {
        chai.request(server).delete(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})


