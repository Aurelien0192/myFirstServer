const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
const server = require("./../../server")
const _ = require("lodash")

const UserService = require('../../services/UserService')
const user = {
    firstName: "Edouardzfeefz2",
    lastName: "Duponfezfez2",
    email: "edouard.duponfeszeet2@gmail.com",
    username: "edupontfzezfezeffze2"
}

let tab_id_users = []

const users = [{
        firstName: "Edouard",
        lastName: "Dupont",
        email: "edouard.dupont@gmail.com",
        username: "edupont",
        password:"1234"
    },{
        firstName: "Angelina",
        lastName: "jolie",
        email: "croft.lara@gmail.com",
        username: "lcroft",
        password:"1234"
    },{
        firstName: "Farine",
        lastName: "deBlé",
        email: "farineDeBlé@gmail.com",
        username: "FDB",
        password:"1234"
    }
]

function rdmUser(tab_id_users){
    const index = Math.floor(Math.random() * tab_id_users.length)
    return tab_id_users[index]
}


let article = []
let articles = []

chai.use(chaiHttp)

describe("POST - /article", () => {
    it("ajout d'utilisateurs - S",(done) => {
        UserService.addManyUsers(users,null,function(err,value){
            tab_id_users = _.map(value,'_id')
            done()
        })
    })
    it("Ajouter article avec champs manquant - E", (done) => {
        chai.request(server).post('/article').send({
            name:"Aventador",
            user_id : rdmUser(tab_id_users),
            decription:"rêve pas tu l'auras jamais",
            quantity:0
        }).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Ajouter un article - S", (done) => {
        chai.request(server).post('/article').send({
            name : "gazon",
            user_id : rdmUser(tab_id_users),
            description : "Le gazon le moins cher de la terre",
            price : 150.47,
            quantity : 841
        }).end ((err, res) => {
            res.should.have.status(201)
            article.push(res.body)
            done()
        })
    })    
    it("Ajouter article avec champs vide - E", (done) => {
        chai.request(server).post('/article').send({
            name:"Aventador",
            user_id : rdmUser(tab_id_users),
            description:"",
            price:2500000000000,
            quantity:0
        }).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Ajouter un article avec un user id faux - E", (done) => {
        chai.request(server).post('/article').send({
            name:"Aventador",
            user_id : "6d5sgsfb4ds6b4dfs65b",
            description:"",
            price:2500000000000,
            quantity:0

        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Ajouter un article avec un user id absent - E", (done) => {
        chai.request(server).post('/article').send({
            name:"Aventador",
            description:"",
            price:2500000000000,
            quantity:0

        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Ajouter un article avec un user id inexistant - E", (done) => {
        chai.request(server).post('/article').send({
            name:"Aventador",
            user_id : "6683f368c7823c607886b47c",
            description:"",
            price:2500000000000,
            quantity:0

        }).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
})

describe("POST - /articles", () => {
    it("Ajouter des articles - S", (done) => {
        const user_id = rdmUser(tab_id_users)
        chai.request(server).post('/articles').send([{
            name : "gazon premium",
            user_id : user_id,
            description : "Le gazon le plus cher de la terre",
            price : 7,
            quantity : 2
        },{
            name : "vin de bourgogne",
            user_id : user_id,
            description : "super vin du sud de la france",
            price : 17.96,
            quantity : 65
        }]).end ((err, res) => {
            res.should.have.status(201)
            articles.push(res.body)
            done()
        })
    })
    it("Ajouter des articles avec champs manquant - E", (done) => {
        const user_id = rdmUser(tab_id_users)
        chai.request(server).post('/articles').send([{
            name:"Aventador",
            user_id : user_id,
            decription:"rêve pas tu l'auras jamais",
            quantity:0
        },{
            name : "vin de bourgogne",
            user_id : user_id,
            description : "super vin du sud de la france",
            price : 17.96,
            quantity : 65
        }]).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Ajouter des articles avec champs vide - E", (done) => {
        chai.request(server).post('/articles').send([{
            name : "vin de bourgogne",
            user_id : rdmUser(tab_id_users),
            description : "super vin du sud de la france",
            price : 17.96,
            quantity : 65
        },{
            firstName:"Aventador",
            description:"",
            price:2500000000000,
            quantity:0
        }]).end((err,res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Ajouter des articles avec user_id différents - E", (done) => {
        chai.request(server).post('/articles').send([{
            name : "gazon premium",
            user_id : rdmUser(tab_id_users),
            description : "Le gazon le plus cher de la terre",
            price : 7,
            quantity : 2
        },{
            name : "vin de bourgogne",
            user_id : '6683f368c7823c607886b47d',
            description : "super vin du sud de la france",
            price : 17.96,
            quantity : 65
        }]).end ((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    it("Ajouter des articles avec user_id valide mais utilisateurs non existant - E", (done) => {
        chai.request(server).post('/articles').send([{
            name : "gazon premium",
            user_id : "6683f368c7823c607886b47d",
            description : "Le gazon le plus cher de la terre",
            price : 7,
            quantity : 2
        },{
            name : "vin de bourgogne",
            user_id : '6683f368c7823c607886b47d',
            description : "super vin du sud de la france",
            price : 17.96,
            quantity : 65
        }]).end ((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Ajouter des articles avec user_id invalide - E", (done) => {
        chai.request(server).post('/articles').send([{
            name : "gazon premium",
            user_id : "6683f368c7",
            description : "Le gazon le plus cher de la terre",
            price : 7,
            quantity : 2
        },{
            name : "vin de bourgogne",
            user_id : '6683f368c7',
            description : "super vin du sud de la france",
            price : 17.96,
            quantity : 65
        }]).end ((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("GET - /article", () => {
    it("trouver un article via name correct - S", (done) => {
        chai.request(server).get('/article').query({fields : ["name"], value:article[0].name}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver un article via name correct et format fields incorrect - S", (done) => {
        chai.request(server).get('/article').query({fields : "name", value:article[0].name}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("trouver un article via name correct fields incorrect - E", (done) => {
        chai.request(server).get('/article').query({fields : "description", value:article[0].name}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("trouver un article via name correct fields correct mais article inexistant - E", (done) => {
        chai.request(server).get('/article').query({fields : ["name"], value:"turturututdfshiqergherqi"}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("trouver un article sans aucune query - E", (done) => {
        chai.request(server).get('/article').end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("GET - /article/:id", () => {
    it("trouver un article avec ID incorrect - E", (done) => {
        chai.request(server).get(`/article/66756baf835213e8d650c3ac`).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("trouver un article avec ID incorrect - E", (done) => {
        chai.request(server).get(`/article/66756680`).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("trouver un article correct - S", (done) => {
        chai.request(server).get(`/article/${article[0]._id}`).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})

describe("GET - /articles_by_filter", () => {
    it("trouver les articles avec query correct - S", (done) => {
        chai.request(server).get('/articles_by_filter').query({page:1,limit:3}).end((err, res) => {
            res.should.has.status(200)
            expect(res.body.results).to.be.an('array')
            expect(res.body.count).to.be.equal(3)
            done()
        })
    })
    it("trouver les articles de la page 3 -S ", (done) => {
        chai.request(server).get('/articles_by_filter').query({page:3,limit:3}).end((err, res) => {
            res.should.has.status(200)
            expect(res.body.results).to.be.an('array')
            expect(res.body.count).to.be.equal(3)
            done()
        })
    })
    it("trouver les articles avec page manquant -S", (done) => {
        chai.request(server).get('/articles_by_filter').query({limit:3}).end((err, res) => {
            res.should.has.status(200)
            expect(res.body.results).to.be.an('array')
            expect(res.body.count).to.be.equal(3)
            done()
        })
    })
    it("trouver les articles avec limit chaine de caractère -E", (done) => {
        chai.request(server).get('/articles_by_filter').query({page:"coucou", limit:3}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("GET - /articles", () => {
    it("trouver des articles avec id correct non présent - E", (done) => {
        chai.request(server).get(`/articles`).query({id:["66756baf835213e8d650c3ac"]}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("trouver des articles avec id inccorect- E", (done) => {
        chai.request(server).get(`/articles`).query({id:["fdrtdrt"]}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("trouver des articles corrects - S", (done) => {
        chai.request(server).get(`/articles`).query({id:[articles[0][0]._id,articles[0][1]._id]}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})

describe("UPDATE - /article", () => {
    it("modifier un article avec ID correct - S", (done) => {
        chai.request(server).put(`/article/${article[0]._id}`).send({
            name : "kiwi"
        }).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("modifier un article avec ID correct mais champs non correct- E", (done) => {
        chai.request(server).put(`/article/${article[0]._id}`).send({
            name : ""
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier un article avec ID correct non présent - E", (done) => {
        chai.request(server).put('/article/667576cd3faa36454139a6a7').send({
            name : "kiwi"
        }).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("modifier un article avec ID incorrect - E", (done) => {
        chai.request(server).put('/article/667576c').send({
            name : "kiwi"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("UPDATE - /articles", () => {
    it("modifier des articles avec ID correct - S", (done) => {
        chai.request(server).put(`/articles`).query({id:[articles[0][0]._id,articles[0][1]._id]}).send({
            name : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("modifier des articles avec ID correct mais non présent - E", (done) => {
        chai.request(server).put(`/article$s`).query({id:['667576cd3faa36454139a6a7',articles[0][1]._id]}).send({
            name : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("modifier des articles avec ID incorrect - E", (done) => {
        chai.request(server).put(`/articles`).query({id:['667576cd3',articles[0][1]._id]}).send({
            name : "princessePeatch"
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("modifier des articles avec ID correct mais champs incorrect - E", (done) => {
        chai.request(server).put(`/articles`).query({id:[articles[0][0]._id,articles[0][1]._id]}).send({
            name : ""
        }).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
})

describe("DELETE - /article", () => {
    it("supprimer un article avec ID incorrect - E", (done) => {
        chai.request(server).delete(`/article/66756680e15ea579048f90ef`).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("supprimer un article correct - S", (done) => {
        chai.request(server).delete(`/article/${article[0]._id}`).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})

describe("DELETE - /articles", () => {
    it("supprimer des articles avec id correct non présent - E", (done) => {
        chai.request(server).delete(`/articles`).query({id:["667576cd3faa36454139a6a7"]}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("supprimer des articles avec id incorrect- E", (done) => {
        chai.request(server).delete(`/articles`).query({id:[true]}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("supprimer des articles corrects - S", (done) => {
        chai.request(server).delete(`/articles`).query({id:[articles[0][0]._id,articles[0][1]._id]}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("suppression des utilisateurs by id - S",(done) => {
        UserService.deleteManyUsers(tab_id_users,null,function(err,value){
            done()
        })
    })
})

