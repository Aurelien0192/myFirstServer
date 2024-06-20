const express = require("express")
const _ = require ("lodash")
const bodyParser = require("body-parser")
const Config = require("./config")

//Création de notre application express.js
const app = express()

//Déclaration des middlewares  à express
app.use(bodyParser.json())

require("./utils/database")

//déclaration des controlleurs pour utilisateur
const UserController = require("./controllers/UserController")

//Création dun endpoint /user pour l'ajout d'un utilisateur
app.post('/user', UserController.addOneUser)

//Création dun endpoint /user pour l'ajout de plusieurs utilisateurs
app.post('/users', UserController.addManyUsers)

//Création dun endpoint /user pour la recherche d'un utilisateur
app.get('/user/:id', UserController.findOneUser)

//Création dun endpoint /user pour la recherche de plusieurs utilisateurs
app.get('/users', UserController.findManyUsers)

//Création dun endpoint /user pour la suppression d'un utilisateur
app.delete('/user/:id', UserController.deleteOneUser)

//Création dun endpoint /user pour la suppression de plusieurs utilisateurs
app.delete('/users', UserController.deleteManyUsers)

//Création dun endpoint /user pour la modification d'un utilisateur
app.put('/user/:id', UserController.updateOneUser)

//Création dun endpoint /user pour la modification de plusieurs utilisateurs
app.put('/users', UserController.updateManyUsers)


//démarrage de notre serveur sur le port choisi
app.listen(Config.port, () => {
    console.log (`(INFO) ${new Date().toLocaleString()}: server start`)
})