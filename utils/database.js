const mongoose = require('mongoose')
const Logger = require('./logger').pino

mongoose.connection.on('connected', () => Logger.info('connecté à la base de données'));
mongoose.connection.on('open', () =>  Logger.info('Connection ouverte à la base de données'));
mongoose.connection.on('disconnected', () =>  Logger.error('Déconnecter de la base de données'));
mongoose.connection.on('reconnected', () =>  Logger.info('Reconnecté à la base de données'));
mongoose.connection.on('disconnecting', () => Logger.error('Déconnection de la base de données'));
mongoose.connection.on('close', () =>  Logger.info('Connection à la base de donnée fermée'));

mongoose.connect(`mongodb://localhost:27017/${process.env.npm_lifecycle_event == 'test' ?"CDA_SERVER_TRAINING":"CDA_SERVER_PRODUCTION"}`)