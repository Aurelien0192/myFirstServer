const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
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
            email: "diesel6@tatoine.com",
            password:"1234"
        }).end ((err, res) => {
            res.should.have.status(201)
            user.push(res.body)
            done()
        })
    })
    it("Authentification user avec mdp faux -E",(done) => {
        chai.request(server).post('/login').send({
            username:"domdom6",
            password:"12345"
        }).end((err,res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Authentification user avec username faux -E",(done) => {
        chai.request(server).post('/login').send({
            username:"dom6",
            password:"1234"
        }).end((err,res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Authentification user -S",(done) => {
        chai.request(server).post('/login').send({
            username:"domdom6",
            password:"1234"
        }).end((err,res) => {
            res.should.have.status(200)
            user[0].token = res.body.token
            done()
        })
    })
    it("Ajouter un utilisateur avec champs duplicate - E", (done) => {
        chai.request(server).post('/user').send({
            firstName : "kiwi",
            lastName : "tit",
            username : "domdom6",
            email : "gegeo@zeklfjzoe.com",
            password:"1234"
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
            email: "gto@onizuka.jp",
            password:"1234"
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
            email: "gto@onizuka.jp",
            password:"1234"
        }).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("POST - /users", () => {
    it("Ajouter des utilisateurs sans authentification- E", (done) => {
        chai.request(server).post('/users').send([{
            firstName : "edouard",
            lastName : "Till",
            username : "drfeeezfsqo5",
            email: "dezoleeefz@tatsqdsqoine.com5",
            password:"1234"
        },{
            firstName : "caapuce",
            lastName :"Poter",
            username : "kHeeffzeiP5",
            email : "eee.@poudlard.com5",
            password:"1234"
        }]).end ((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Ajouter des utilisateurs - S", (done) => {
        chai.request(server).post('/users').auth(user[0].token,{type: 'bearer'}).send([{
            firstName : "edouard",
            lastName : "Till",
            username : "drfeeezfsqo5",
            email: "dezoleeefz@tatsqdsqoine.com5",
            password:"1234"
        },{
            firstName : "caapuce",
            lastName :"Poter",
            username : "kHeeffzeiP5",
            email : "eee.@poudlard.com5",
            password:"1234"
        }]).end ((err, res) => {
            res.should.have.status(201)
            users.push(res.body)
            done()
        })
    })
    it("Ajouter des utilisateurs avec champs duplicate - E", (done) => {
        chai.request(server).post('/users').auth(user[0].token,{type: 'bearer'}).send([{
            firstName : "Mathis",
            lastName : "Boisson",
            username : "drfeeezfsqo5",
            email: "fekofze",
            password:"1234"
        },{
            firstName : "dracaufeu",
            lastName : "Till",
            username : "drfeeezfsqo5",
            email : "poketruffe@gmail.com",
            password:"1234"
        }]).end((err,res) => {
            res.should.have.status(405)
            expect(res).to.haveOwnProperty("text")
            done()
        })
    })
    it("Ajouter des utilisateurs avec champs manquant - E", (done) => {
        chai.request(server).post('/users').auth(user[0].token,{type: 'bearer'}).send([{
            firstName : "Mathis",
            lastName : "BOisson",
            username : "footdu21",
            email: "fe,kofze",
            password:"1234"
        },{
            firstName : "dracaufeu",
            username : "baleck",
            email : "poketruffe@gmail.com",
            password:"1234"
        }]).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Ajouter des utilisateurs avec champs vide - E", (done) => {
        chai.request(server).post('/users').auth(user[0].token,{type: 'bearer'}).send([{
            firstName : "Mathis",
            lastName : "Boisson",
            username : "footdu21",
            email: "fe,kofze",
            password:"1234"
        },{
            firstName : "dracaufeu",
            lastname : "",
            username : "baleck",
            email : "poketruffe@gmail.com",
            password:"1234"
        }]).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("GET - /user", () => {
    it("trouver un utilisateur via username correct - S", (done) => {
        chai.request(server).get('/user').query({fields : ["username"], value:user[0].username}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver un utilisateur via email correct - S", (done) => {
        chai.request(server).get('/user').query({fields : ["email"], value:user[0].email}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver un utilisateur sans authentification - E", (done) => {
        chai.request(server).get('/user').query({fields : ["email"], value:user[0].email}).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it("trouver un utilisateur via username correct et format fields incorrect - S", (done) => {
        chai.request(server).get('/user').query({fields : "username", value:user[0].username}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver un utilisateur via username correct fields incorrect - E", (done) => {
        chai.request(server).get('/user').query({fields : "lastName", value:user[0].username}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("trouver un utilisateur via username correct fields correct mais user inexistant - E", (done) => {
        chai.request(server).get('/user').query({fields : ["username"], value:"turturututdfshiqergherqi"}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("trouver un utilisateur sans aucune query - E", (done) => {
        chai.request(server).get('/user').auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("GET - /user/:id", () => {
    it("trouver un utilisateur avec ID incorrect - E", (done) => {
        chai.request(server).get(`/user/66756baf835213e8d650c3ac`).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("trouver un utilisateur avec ID incorrect - E", (done) => {
        chai.request(server).get(`/user/66756680`).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("trouver un utilisateur correct - S", (done) => {
        chai.request(server).get(`/user/${user[0]._id}`).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver un utilisateur correct sans authentification - E", (done) => {
        chai.request(server).get(`/user/${user[0]._id}`).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
})

describe("GET - /users_by_filter", () => {
    it("trouver les utilisateurs avec query correct - S", (done) => {
        chai.request(server).get('/users_by_filter').query({page:1,limit:3}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            expect(res.body.results).to.be.an('array')
            expect(res.body.count).to.be.equal(3)
            done()
        })
    })
    it("trouver les utilisateurs avec query correct sans authentification - E", (done) => {
        chai.request(server).get('/users_by_filter').query({page:1,limit:3}).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it("trouver les utilisateurs de la page 3 -S ", (done) => {
        chai.request(server).get('/users_by_filter').query({page:3,limit:3}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            expect(res.body.results).to.be.an('array')
            expect(res.body.count).to.be.equal(3)
            done()
        })
    })
    it("trouver les utilisateurs avec page manquant -S", (done) => {
        chai.request(server).get('/users_by_filter').query({limit:3}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            expect(res.body.results).to.be.an('array')
            expect(res.body.count).to.be.equal(3)
            done()
        })
    })
    it("trouver les utilisateurs avec limit chaine de caractère -E", (done) => {
        chai.request(server).get('/users_by_filter').query({page:"coucou", limit:3}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("GET - /users", () => {
    it("trouver des utilisateurs avec id correct non présent - E", (done) => {
        chai.request(server).get(`/users`).query({id:["66756baf835213e8d650c3ac"]}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("trouver des utilisateurs avec id inccorect- E", (done) => {
        chai.request(server).get(`/users`).query({id:["fdrtdrt"]}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("trouver des utilisateurs corrects - S", (done) => {
        chai.request(server).get(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver des utilisateurs corrects sans authentification- E", (done) => {
        chai.request(server).get(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
})

describe("UPDATE - /user", () => {
    it("modifier un utilisateur avec ID correct - S", (done) => {
        chai.request(server).put(`/user/${user[0]._id}`).auth(user[0].token,{type: 'bearer'}).send({
            username : "kiwi"
        }).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("modifier un utilisateur avec ID correct sans authentification - E", (done) => {
        chai.request(server).put(`/user/${user[0]._id}`).send({
            username : "kiwi"
        }).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it("modifier un utilisateur avec ID correct mais champs non correct- E", (done) => {
        chai.request(server).put(`/user/${user[0]._id}`).auth(user[0].token,{type: 'bearer'}).send({
            username : ""
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier un utilisateur avec ID correct non présent - E", (done) => {
        chai.request(server).put('/user/667576cd3faa36454139a6a7').auth(user[0].token,{type: 'bearer'}).send({
            username : "kiwi"
        }).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("modifier un utilisateur avec ID incorrect - E", (done) => {
        chai.request(server).put('/user/667576c').auth(user[0].token,{type: 'bearer'}).send({
            username : "kiwi"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier un utilisateur correct avec valeur champs déjà existant sur champs unique - E", (done) => {
        chai.request(server).put(`/user/${users[0][0]._id}`).auth(user[0].token,{type: 'bearer'}).send({
            username : "kiwi"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("UPDATE - /users", () => {
    it("modifier des utilisateurs avec ID correct - S", (done) => {
        chai.request(server).put(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).auth(user[0].token,{type: 'bearer'}).send({
            lastName : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("modifier des utilisateurs avec ID correct sans authentification - E", (done) => {
        chai.request(server).put(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).send({
            lastName : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it("modifier des utilisateurs avec ID correct mais non présent - E", (done) => {
        chai.request(server).put(`/users`).query({id:['667576cd3faa36454139a6a7',users[0][1]._id]}).auth(user[0].token,{type: 'bearer'}).send({
            lastName : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("modifier des utilisateurs avec ID incorrect - E", (done) => {
        chai.request(server).put(`/users`).query({id:['667576cd3',users[0][1]._id]}).auth(user[0].token,{type: 'bearer'}).send({
            lastName : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier des utilisateurs avec ID correct mais champs incorrect - E", (done) => {
        chai.request(server).put(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).auth(user[0].token,{type: 'bearer'}).send({
            lastName : ""
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier des utilisateurs avec ID correct champs unique en double - E", (done) => {
        chai.request(server).put(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).auth(user[0].token,{type: 'bearer'}).send({
            username : "titi"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("DELETE - /users", () => {
    it("supprimer des utilisateurs avec id correct non présent - E", (done) => {
        chai.request(server).delete(`/users`).query({id:["667576cd3faa36454139a6a7"]}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("supprimer des utilisateurs avec id correct non présent sans authentification - E", (done) => {
        chai.request(server).delete(`/users`).query({id:["667576cd3faa36454139a6a7"]}).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it("supprimer des utilisateurs avec id incorrect- E", (done) => {
        chai.request(server).delete(`/users`).query({id:[true]}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("supprimer des utilisateurs corrects - S", (done) => {
        chai.request(server).delete(`/users`).query({id:[users[0][0]._id,users[0][1]._id]}).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})

describe("DELETE - /user", () => {
    it("supprimer un utilisateur avec ID incorrect - E", (done) => {
        chai.request(server).delete(`/user/66756680e15ea579048f90ef`).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("supprimer un utilisateur correct sans authentification - E", (done) => {
        chai.request(server).delete(`/user/${user[0]._id}`).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it("supprimer un utilisateur correct - S", (done) => {
        chai.request(server).delete(`/user/${user[0]._id}`).auth(user[0].token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})


