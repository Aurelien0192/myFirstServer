const express = require("express")
const _ = require ("lodash")
const bodyParser = require("body-parser")
const Config = require("./config")

//Création de notre application express.js
const app = express()

//déclaration des controlleurs pour utilisateur
const UserController = require("./controllers/UserController")

//Création dun endpoint /user pour l'ajout d'un utilisateur
app.post('/user', UserController.addOneUser)

//Création dun endpoint /user pour l'ajout de plusieurs utilisateurs
app.post('/user', UserController.addManyUsers)

//Création dun endpoint /user pour la recherche d'un utilisateur
app.get('/user', UserController.findOneUser)

//Création dun endpoint /user pour la recherche de plusieurs utilisateurs
app.get('/user', UserController.findManyUsers)

//Création dun endpoint /user pour la suppression d'un utilisateur
app.delete('/user', UserController.deleteOneUser)

//Création dun endpoint /user pour la suppression de plusieurs utilisateurs
app.delete('/user', UserController.deleteManyUsers)

//Création dun endpoint /user pour la modification d'un utilisateur
app.put('/user', UserController.updateOneUser)

//Création dun endpoint /user pour la modification de plusieurs utilisateurs
app.put('/user', UserController.udpateManyUsers)


//démarrage de notre serveur le port choisi
app.listen(Config.port, () => {
    console.log (`(INFO) ${new Date().toLocaleString()}: server start`)
})