const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Schedule2Schema = Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    name: {
        type: mongoose.Schema.Types.String,
        ref: 'client',
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        ref: 'client',
        required: true
    },
    edad: {
        type: mongoose.Schema.Types.String,
        ref: 'client',
        required: true
    }
});

module.exports = mongoose.model('appointment2', Schedule2Schema);