const mongoose = require("mongoose")

const PasswordSchema = require('./password.schema').PasswordSchema;

const PasswordModel = mongoose.model("PasswordModel", PasswordSchema);

function createPassword(password) {
    return PasswordModel.create(password);
}

function updatePassword(id, password) {
    return PasswordModel.findByIdAndUpdate(id, { password }).exec();
}

function returnAllPassword() {
    return PasswordModel.find().exec();
}

function getPasswordById(id) {
    return PasswordModel.findById(id).exec();
}

function getPasswordByUsernameAndUrl(username, url) {
    return PasswordModel.findOne({username, url}).exec();
}

function deletePassword(id) {
    return PasswordModel.deleteOne({_id: id}).exec();
}

function findPasswordByUsername(username, shareUsernames) {
    return PasswordModel.find({
        $or: [
           { username: username },
           {
               username: {
                   "$in" : shareUsernames
               }
           }
        ]
    }).exec();
}

module.exports = {
    createPassword,
    returnAllPassword,
    getPasswordByUsernameAndUrl,
    updatePassword,
    getPasswordById,
    deletePassword,
    findPasswordByUsername
}
