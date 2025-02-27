const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserService = require('./../services/UserService')
const ConfigFile = require('../config')

const passportJWT = require("passport-jwt")

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

passport.use('login', new LocalStrategy({passReqToCallback: true}, function(req, username, password, done){
    //création du systeme de login avec comparaison des mots de passe
    UserService.loginUser(username,password,null, done)
}))

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:ConfigFile.secret_key,
    passReqToCallback: true
}, function(req, jwt_payload, done){
    //Déchiffrer le token et lire les information dedans
    UserService.FindOneUserById(jwt_payload._id, null, function (err, value){
        if(err)
            done(err)
        else
            done(null, value)
    })
}))

module.exports = passport