const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionsSchema = new Schema({
    clientId: {
        type: String,
        required: true,
    },
    username: {
        type:String,
        required: true,
    },
    device: {
        type: String,
        required: true,
    }
});

const Sessions = mongoose.model('Sessions', sessionsSchema);

module.exports = Sessions;