const UserSchema = require('../schemas/User')
const _ = require('lodash')
const async = require('async')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

var User = mongoose.model('User', UserSchema)

User.createIndexes()

module.exports.addOneUser = async function (user, callback) {
    try {
        var new_user = new User(user);
        var errors = new_user.validateSync();
        if (errors) {
            errors = errors['errors'];
            var text = Object.keys(errors).map((e) => {
                return errors[e]['properties']['message'];
            }).join(' ');
            var fields = _.transform(Object.keys(errors), function (result, value) {
                result[value] = errors[value]['properties']['message'];
            }, {});
            var err = {
                msg: text,
                fields_with_error: Object.keys(errors),
                fields: fields,
                type_error: "validator"
            };
            callback(err);
        } else {
            await new_user.save();
            callback(null, new_user.toObject());
        }
    } catch (error) {
        if (error.code === 11000) { // Erreur de duplicité
            var field = Object.keys(error.keyValue)[0];
            var err = {
                msg: `Duplicate key error: ${field} must be unique.`,
                fields_with_error: [field],
                fields: { [field]: `The ${field} is already taken.` },
                type_error: "duplicate"
            };
            callback(err);
        } else {
            callback(error); // Autres erreurs
        }
    }
};

module.exports.addManyUsers = async function (users, callback) {
    var errors = [];
    
    // Vérifier les erreurs de validation
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var new_user = new User(user);
        var error = new_user.validateSync();
        if (error) {
            error = error['errors'];
            var text = Object.keys(error).map((e) => {
                return error[e]['properties']['message'];
            }).join(' ');
            var fields = _.transform(Object.keys(error), function (result, value) {
                result[value] = error[value]['properties']['message'];
            }, {});
            errors.push({
                msg: text,
                fields_with_error: Object.keys(error),
                fields: fields,
                index: i,
                type_error: "validator"
            });
        }
    }
    
    if (errors.length > 0) {
        callback(errors);
    } else {
        try {
            // Tenter d'insérer les utilisateurs
            const data = await User.insertMany(users, { ordered: false });
            callback(null, data);
        } catch (error) {
            if (error.code === 11000) { // Erreur de duplicité
                const duplicateErrors = error.writeErrors.map(err => {
                    const field = err.err.errmsg.split(" dup key: { ")[1].split(':')[0].trim()
                    return {
                        msg: `Duplicate key error: ${field} must be unique.`,
                        fields_with_error: [field],
                        fields: { [field]: `The ${field} is already taken.` },
                        index: err.index,
                        type_error: "duplicate"
                    };
                });
                callback(duplicateErrors);
            } else {
                callback(error); // Autres erreurs
            }
        }
    }
};

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
                if (value && Array.isArray(value) &&value.length>0) {
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
                if (value){
                    callback(null, value.toObject())}
                else{
                    callback({ msg: "Utilisateur non trouvé.", type_error: "no-found" })}
            } catch (e) {
                callback({ msg: "Problème base de données", type_error: "error-mongo" })
            }
        }).catch((errors) => {
            if (errors.code === 11000) { // Erreur de duplicité
                var field = Object.keys(errors.keyPattern)[0];
                var err = {
                    msg: `Duplicate key error: ${field} must be unique.`,
                    fields_with_error: [field],
                    fields: { [field]: `The ${field} is already taken.` },
                    type_error: "duplicate"
                };
                callback(err);
            }else{
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
            }
        })
    }else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}


module.exports.updateManyUsers = function (users_id, update, callback) {0
    if(users_id && Array.isArray(users_id) && users_id.length > 0 && users_id.filter((e) => { return mongoose.isValidObjectId(e)}).length == users_id.length){
        if (users_id && Array.isArray(users_id) && users_id.length > 0) {
            users_id = users_id.map((e) => { return new ObjectId(e) })
            User.updateMany({ _id: users_id }, update, { runValidators: true }).then((value) => {
                try {
                    if (value && value.modifiedCount !== 0)
                        callback(null, value)
                    else
                        callback({ msg: "Utilisateur non trouvé.", type_error: "no-found" });
                } catch (e) {
                    callback(e);
                }
            }).catch((errors) => {
                if (errors.code === 11000) { // Erreur de duplicité
                    var field = Object.keys(errors.keyPattern)[0]
                    var err = {
                        msg: `Duplicate key error: ${field} must be unique.`,
                        fields_with_error: [field],
                        fields: { [field]: `The ${field} is already taken.` },
                        type_error: "duplicate"
                    };
                    callback(err);
                }else{
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
                }
            })
        }
        else {
            callback({ msg: "Id invalide.", type_error: 'no-valid' })
        }
    }else if (users_id && Array.isArray(users_id) && users_id.length >  0 && users_id.filter((e) => { return mongoose.isValidObjectId(e)}).length != users_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: users_id.filter((e) => { return !mongoose.isValidObjectId(e)}) });
    }else{
        console.log('ok')
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

module.exports.deleteManyUsers = function (users_id, callback) {
    if (users_id && Array.isArray(users_id) && users_id.length > 0 && users_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == users_id.length) {
        users_id = users_id.map((e) => { return new ObjectId(e) })
        User.deleteMany({ _id: users_id }).then((value) => {
            if (value && value.deletedCount !==0) {
                    callback(null, value);
                } else {
                    
                    callback({ msg: "Aucun utilisateur trouvé.", type_error: "no-found" });
                }
        }).catch((err) => {
            callback({ msg: "Id inconnu", type_error: "no-found" });
        })
    }
    else if (users_id && Array.isArray(users_id) && users_id.length > 0 && users_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != users_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: users_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (users_id && !Array.isArray(users_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}