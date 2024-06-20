const UserSchema = require('../schemas/User')
const _ = require('lodash')
const async = require('async')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

var User = mongoose.model('User', UserSchema)

module.exports.addOneUser = function (user, callback) {
    var new_user = new User(user)
    var errors = new_user.validateSync()
    if (errors) {
        errors = errors['errors']
        var text = Object.keys(errors).map((e) => {
            return errors[e]['properties']['message']
        }).join(' ')
        var fields = _.transform(Object.keys(errors), function (result, value) {
            result[value] = errors[value]['properties']['message'];
        }, {});
        var err = {
            msg: text,
            fields_with_error: Object.keys(errors),
            fields: fields,
            type_error: "validator"

        }
        callback(err)
    } else {
        new_user.save()
        callback(null, new_user.toObject())
    }
}

module.exports.addManyUsers = function (users, callback) {
    var errors = []
    for (var i = 0; i < users.length; i++) {
        var user = users[i]
        var new_user = new User(user)
        var error = new_user.validateSync()
        if (error) {
            error = error['errors']
            var text = Object.keys(error).map((e) => {
                return error[e]['properties']['message']
            }).join(' ')
            var fields = _.transform(Object.keys(error), function (result, value) {
                result[value] = error[value]['properties']['message'];
            }, {});
            errors.push({
                msg: text,
                fields_with_error: Object.keys(error),
                fields: fields,
                index: i,
                type_error: "validator"
            })
        }
    }
    if (errors.length > 0) {
        callback(errors)
    }
    else {
        User.insertMany(users).then(data => callback(null, data))
            .catch(e => callback(e));
        //  User.insertMany(users, callback)
        //callback(null, users)
        /* .then(data => callback(null, data))
        .catch(e => callback(e)); */
    }
}

module.exports.findOneUser = function (user_id, callback) {
    if (user_id && mongoose.isValidObjectId(user_id)) {
        User.findById(user_id).then((value) => {
            try {
                if (value) {
                    callback(null, value.toObject());
                } else {
                    callback({ msg: "Aucun utilisateur trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
                console.log(e)
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    } else {
        callback({ msg: "ObjectId non conforme.", type_error: 'no-valid' });
    }
}

module.exports.findManyUsers = function (users_id, callback) {
    if (users_id && Array.isArray(users_id) && users_id.length > 0 && users_id.filter((e) => { return mongoose.isValidObjectId(e)}).length == users_id.length) {
        users_id = users_id.map((e) => { return new ObjectId(e) })
        User.find({ _id: users_id }).then((value) => {
            try {
                if (value) {
                    callback(null, value);
                } else {
                    callback({ msg: "Aucun utilisateur trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
                console.log(e)
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    }
    else if (users_id && Array.isArray(users_id) && users_id.length >  0 && users_id.filter((e) => { return mongoose.isValidObjectId(e)}).length != users_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: users_id.filter((e) => { return !mongoose.isValidObjectId(e)}) });
    }
    else if (users_id && !Array.isArray(users_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}

module.exports.updateOneUser = function (user_id, update, callback) {
    if (user_id && mongoose.isValidObjectId(user_id)) {
        User.findByIdAndUpdate(new ObjectId(user_id), update, { returnDocument: 'after', runValidators: true }).then((value) => {
            try {
                callback(null, value.toObject())
            } catch (e) {
                console.log(e)
                callback(e)
            }
        }).catch((errors) => {
            errors = errors['errors']
            var text = Object.keys(errors).map((e) => {
                return errors[e]['properties']['message']
            }).join(' ')
            var fields = _.transform(Object.keys(errors), function (result, value) {
                result[value] = errors[value]['properties']['message'];
            }, {});
            var err = {
                msg: text,
                fields_with_error: Object.keys(errors),
                fields: fields,
                type_error: "validator"
            }
            callback(err)
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}


module.exports.updateManyUsers = function (users_id, update, callback) {
    if(update && typeof update === "object" && !Array.isArray(update)){
        
        if (users_id && Array.isArray(users_id) && users_id.length > 0) {
        
            users_id = users_id.map((e) => { return new ObjectId(e) })
            User.updateMany({ _id: users_id }, update, { runValidators: true }).then((value) => {
                try {
                    callback(null, value)
                } catch (e) {
                    console.log(e)
                    callback(e)
                }
            }).catch((errors) => {
                errors = errors['errors']
                console.log('errors :', errors)
                var text = Object.keys(errors).map((e) => {
                    return errors[e]['properties']['message']
                }).join(' ')
                var fields = _.transform(Object.keys(errors), function (result, value) {
                    result[value] = errors[value]['properties']['message'];
                }, {});
                var err = {
                    msg: text,
                    fields_with_error: Object.keys(errors),
                    fields: fields,
                    type_error: "validator"
                }
                callback(err)
            })
        }
        else {
            callback({ msg: "Id invalide.", type_error: 'no-valid' })
        }
    }else{
        callback({ msg: "Le body doit etre un objet.", type_error: 'no-valid' })
    }
}

module.exports.deleteOneUser = function (user_id, callback) {
    if (user_id && mongoose.isValidObjectId(user_id)) {
        User.findByIdAndDelete(user_id).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                callback({ msg: "Utilisateur non trouvé.", type_error: "no-found" });
            }
            catch (e) {
                console.log(e)
                callback(e)
            }
        }).catch((e) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}

module.exports.deleteManyUsers = function(users_id, callback) {
    if (users_id && Array.isArray(users_id) && users_id.length > 0) {
        users_id = users_id.map((e) => { return new ObjectId(e)})
        User.deleteMany({_id: users_id}).then((value) => {
            callback(null, value)
        }).catch((err) => {
            callback({ msg: "Erreur mongo suppression.", type_error: "error-mongo" }); 
        })
    }
    else {
        callback({ msg: "Tableau d'id invalide.", type_error: 'no-valid' })
    }
}