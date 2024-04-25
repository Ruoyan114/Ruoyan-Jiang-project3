const mongoose = require("mongoose")

const ShareSchema = require('./share.schema').ShareSchema;

const ShareModel = mongoose.model("ShareModel", ShareSchema);

function createShare(share) {
    return ShareModel.create(share);
}

function updateShareStatus(id, status) {
    return ShareModel.findByIdAndUpdate(id, { status }).exec();
}

function getShareByTo(to, status) {
    return ShareModel.find({ to, status: status }).exec();
}

module.exports = {
    createShare,
    updateShareStatus,
    getShareByTo
}
