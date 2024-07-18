const express = require("express")
const _ = require ("lodash")
const bodyParser = require("body-parser")
const Config = require("./config")
const Logger = require("./utils/logger").pino
const database = require("./middlewares/database")
const loggerHttp = require("./middlewares/loggerHttp")
const session = require('express-session')

//Création de notre application express.js
const app = express()

//Déclaration des middlewares  à express

require("./utils/database")

//Ajout du module de login

const passport = require("./utils/passport")
//passport init

app.use(session({
    secret : Config.secret_cookie,
    resave: false,
    saveUninitialized : true,
    cookie: {secure: true}
}))

app.use(passport.initialize())
app.use(passport.session())

//déclaration des controlleurs pour utilisateur
const UserController = require("./controllers/UserController")
const ArticleController = require("./controllers/ArticleController")
const controleIdUser = require("./middlewares/controleExistingUser").ControleIdUser
const { config } = require("chai")

app.use(bodyParser.json(), loggerHttp.addLogger)

//Création du endpoint /login pour connecter un utilisateur
app.post('/login', database.controlsBDD, UserController.loginUser)

//Création dun endpoint /user pour l'ajout d'un utilisateur
app.post('/user',database.controlsBDD,UserController.addOneUser)

//Création dun endpoint /user pour l'ajout de plusieurs utilisateurs
app.post('/users',database.controlsBDD, passport.authenticate('jwt',{session:false}) ,UserController.addManyUsers)

//Création d'un endpoint /user pour la recherche d'un utilisateur par email ou username
app.get('/user',database.controlsBDD, passport.authenticate('jwt',{session:false}),UserController.FindOneUser)

//Création dun endpoint /user pour la recherche d'un utilisateur par id
app.get('/user/:id',database.controlsBDD, passport.authenticate('jwt',{session:false}), UserController.FindOneUserById)

app.get('/users_by_filter',database.controlsBDD, passport.authenticate('jwt',{session:false}), UserController.findManyUsers)

//Création dun endpoint /users pour la recherche de plusieurs utilisateurs
app.get('/users',database.controlsBDD, passport.authenticate('jwt',{session:false}), UserController.findManyUsersById)

//Création dun endpoint /user pour la suppression d'un utilisateur
app.delete('/user/:id',database.controlsBDD, passport.authenticate('jwt',{session:false}), UserController.deleteOneUser)

//Création dun endpoint /user pour la suppression de plusieurs utilisateurs
app.delete('/users',database.controlsBDD, passport.authenticate('jwt',{session:false}), UserController.deleteManyUsers)

//Création dun endpoint /user pour la modification d'un utilisateur
app.put('/user/:id',database.controlsBDD, passport.authenticate('jwt',{session:false}), UserController.updateOneUser)

//Création dun endpoint /user pour la modification de plusieurs utilisateurs
app.put('/users',database.controlsBDD, passport.authenticate('jwt',{session:false}), UserController.updateManyUsers)



app.post('/article',database.controlsBDD, passport.authenticate('jwt',{session:false}),controleIdUser,ArticleController.addOneArticle)

//Création dun endpoint /article pour l'ajout de plusieurs articles
app.post('/articles',database.controlsBDD, passport.authenticate('jwt',{session:false}),controleIdUser,ArticleController.addManyArticles)

//Création d'un endpoint /article pour la recherche d'un article par name
app.get('/article',database.controlsBDD, passport.authenticate('jwt',{session:false}),ArticleController.FindOneArticle)

//Création dun endpoint /article pour la recherche d'un article par id
app.get('/article/:id',database.controlsBDD, passport.authenticate('jwt',{session:false}), ArticleController.FindOneArticleById)

app.get('/articles_by_filter',database.controlsBDD, passport.authenticate('jwt',{session:false}), ArticleController.findManyArticles)

//Création dun endpoint /articles pour la recherche de plusieurs articles
app.get('/articles',database.controlsBDD, passport.authenticate('jwt',{session:false}), ArticleController.findManyArticlesById)

//Création dun endpoint /article pour la suppression d'un article
app.delete('/article/:id',database.controlsBDD, passport.authenticate('jwt',{session:false}), ArticleController.deleteOneArticle)

//Création dun endpoint /articles pour la suppression de plusieurs articles
app.delete('/articles',database.controlsBDD, passport.authenticate('jwt',{session:false}), ArticleController.deleteManyArticles)

//Création dun endpoint /article pour la modification d'un article
app.put('/article/:id',database.controlsBDD, passport.authenticate('jwt',{session:false}), ArticleController.updateOneArticle)

//Création dun endpoint /articles pour la modification de plusieurs articles
app.put('/articles',database.controlsBDD, passport.authenticate('jwt',{session:false}), ArticleController.updateManyArticles)


//démarrage de notre serveur sur le port choisi
app.listen(Config.port, () => {
    Logger.info(`Serveur démarré sur le port ${Config.port}.`)
})

module.exports = app