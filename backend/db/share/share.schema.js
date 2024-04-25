const Schema = require('mongoose').Schema;

exports.ShareSchema = new Schema({
    from: {
        type: String,
        require: true,
    },
    to: {
        type: String,
        require: true,
    },
    status: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
    collection : 'shares'
});

