const express = require("express")
const _ = require ("lodash")
const bodyParser = require("body-parser")
const Config = require("./config")
const Logger = require("./utils/logger").pino
const database = require("./middlewares/database")

//Création de notre application express.js
const app = express()

//Déclaration des middlewares  à express
app.use(bodyParser.json())

require("./utils/database")

//déclaration des controlleurs pour utilisateur
const UserController = require("./controllers/UserController")
const { config } = require("chai")

//Création dun endpoint /user pour l'ajout d'un utilisateur
app.post('/user',database.controlsBDD,UserController.addOneUser)

//Création dun endpoint /user pour l'ajout de plusieurs utilisateurs
app.post('/users',database.controlsBDD, UserController.addManyUsers)

//Création dun endpoint /user pour la recherche d'un utilisateur
app.get('/user/:id',database.controlsBDD, UserController.findOneUser)

//Création dun endpoint /user pour la recherche de plusieurs utilisateurs
app.get('/users',database.controlsBDD, UserController.findManyUsers)

//Création dun endpoint /user pour la suppression d'un utilisateur
app.delete('/user/:id',database.controlsBDD, UserController.deleteOneUser)

//Création dun endpoint /user pour la suppression de plusieurs utilisateurs
app.delete('/users',database.controlsBDD, UserController.deleteManyUsers)

//Création dun endpoint /user pour la modification d'un utilisateur
app.put('/user/:id',database.controlsBDD, UserController.updateOneUser)

//Création dun endpoint /user pour la modification de plusieurs utilisateurs
app.put('/users',database.controlsBDD, UserController.updateManyUsers)


//démarrage de notre serveur sur le port choisi
app.listen(Config.port, () => {
    Logger.info(`Serveur démarré sur le port ${Config.port}.`)
    console.log (`(INFO) ${new Date().toLocaleString()}: server start`)
})