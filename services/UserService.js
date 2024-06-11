const UserSchema = require('../schemas/User')
const _ = require('lodash')
const async = require('async')
const mongoose = require('mongoose')
const { use } = require('chai')
const ObjectId = require('mongoose').Types.ObjectId

var User = mongoose.model('User', UserSchema)

module.exports.addOneUser = function (user, callback) {
    const new_user = new User(user)
    let errors = new_user.validateSync()
    if (errors) {
        errors = errors['errors']
        const text = Object.keys(errors).map((e) => {
            return errors[e]['properties']['message']
        }).join(' ')
        const fields = _.transform(Object.keys(errors), function (result, value){
            result[value] = errors[value]['properties']['message']
        },{})
        const err = {
            msg : text,
            fields_with_error : Object.keys(errors),
            fields: fields,
            type_error : "Validator"
        }
        callback(err)
    } else {
        new_user.save()
        callback(null, new_user.toObject())
    }
}

module.exports.addMultiUsers = function(users, callback){
    let usersToAdd = []
    let errors= []
    users.forEach((e, index) => {
        const new_user = new User(e)
        usersToAdd.push(new User(e))
        if(new_user.validateSync())
            errors.push({err : new_user.validateSync(), user : index+1})
    })
    if (errors.length>0){
        let totalError = []
        errors.forEach((errors, index) => {
            errors.err = errors.err['errors']
            const text = Object.keys(errors.err).map((e) => {
                return errors.err[e]['properties']['message']
            }).join(' ')
            const fields = _.transform(Object.keys(errors.err), function (result, value){
                result[value] = errors.err[value]['properties']['message']
            },{})
            const err = {
                msg : text,
                fields_with_error : `Utilisateur ${errors.user} : ${Object.keys(errors.err)}`,
                fields: fields,
                index : index,
                type_error : "Validator"
            }           
            totalError.push(err)
        })
        callback(totalError)
    } else {
        User.insertMany(usersToAdd).then((data) =>{
            callback(null, data)
        }).catch((error) => {
            callback(error)
        })
    }
}

module.exports.findOneUser = function (user_id, callback){
    if (user_id && mongoose.isValidObjectId(user_id)){
        return User.findById(new ObjectId(user_id)).then((value) => {
            if(value){
                return callback(null, value.toObject())
            }else{
                return callback({msg: "Utilisateur non trouvé", type_error: "not_found"})                
            }   
        }).catch((err) => {
            return callback({msg: "ObjectId non conforme.", type_error : "no_valid"})
        })

    }else{
        return callback({msg : "ObjectId non conforme", type_error: "no-valid"})
    }
}

module.exports.findManyUsers = function(users_id, callback){
    if(users_id && users_id.length > 0){
        users_id = users_id.map((e) => {return new ObjectId(e)})
        User.find({_id : users_id}).then((value) => {
            if(value){
                callback(null, value)
            }else{
                callback({msg: "Utilisateur non trouvé", type_error: "not_found"})                
            }   
        }).catch((err) => {
            console.log(err)
        })

    }else{
        callback({msg : "ObjectId non conforme", type_error: "no-valid"})
    }
}

module.exports.updateOneUser = function(user_id, update, callback){
    if(user_id && mongoose.isValidObjectId(user_id)){
        User.findByIdAndUpdate(user_id, update, {returnDocument : 'after', runValidators : true}).then((value) => {
            try{
                callback(null, value.toObject())
            }catch (e){
                callback(e)
            }
        }).catch((errors) => {
            errors = errors['errors']
            const text = Object.keys(errors).map((e) => {
                return errors[e]['properties']['message']
            }).join(' ')
            const fields = _.transform(Object.keys(errors), function (result, value){
                result[value] = errors[value]['properties']['message']
            },{})
            const err = {
                msg : text,
                fields_with_error : Object.keys(errors),
                fields: fields,
                type_error : "Validator"
            }
            callback(err)
        })
    }else{
        callback({msg: "user id not valide", type_error: "no-valid"})
    }
}

module.exports.updateManyUsers = function(users_id, update, callback) {
    if(users_id && users_id.length>0){
        users_id = users_id.map((e) => {return new ObjectId(e)})
        User.updateMany({_id : users_id}, update,{runValidators : true}).then((value) => {
            try{
                callback(null, value)
            }catch(e){
                callback({msg: "user id not valide", type_error: "no-valid"})
            }
        }).catch((errors, index) => {
            errors = errors['errors']
            const text = Object.keys(errors).map((e) => {
                return errors[e]['properties']['message']
            }).join(' ')
            const fields = _.transform(Object.keys(errors), function (result, value){
                result[value] = errors[value]['properties']['message']
            },{})
            const err = {
                msg : text,
                fields_with_error : Object.keys(errors),
                fields: fields,
                index: index,
                type_error : "Validator"
            }
            callback(err)
        })
    }else{
        callback({msg: "user id not valide", type_error: "no-valid"})
    }
}

module.exports.deleteOneUser = function(user_id, callback){
    if(user_id && mongoose.isValidObjectId(user_id)){
        User.findByIdAndDelete({_id : user_id}).then((value) => {
            try{
            if(value){
                return callback(null, value.toObject())
            }else{
               return callback({msg: "Utilisateur non trouvé", type_error: "no-found"}) 
            }}catch(e){
                callback(e)
            }
        }).catch((err) => {
            return callback({msg: "Impossible de chercher l'élément", type_error: "error-mongo"}) 
        })
    }else{
        return callback({msg: "user id not valide", type_error: "no-valid"})
    }
}

module.exports.deleteManyUsers = function(users_id, callback){
    if(users_id && users_id.length>0){
        try{
            users_id = users_id.map((e) => {return new ObjectId(e)})
        }catch{
            callback({msg: "user id not valide", type_error: "no-valid"})
        }
        User.deleteMany({_id : users_id}).then((value) => {
            callback(null, value)
        })
    }else{
        callback({msg: "no id given", type_error: "no-valid-entry"})
    }
}