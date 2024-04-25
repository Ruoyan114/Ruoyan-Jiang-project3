const Schema = require('mongoose').Schema;

exports.PasswordSchema = new Schema({
    url: String,
    password: String,
    username: {
        type: String,
        require: true,
    }
}, {
    timestamps: true,
    collection : 'passwords'
});

