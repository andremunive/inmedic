const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = Schema({
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    idClient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: false
    },
    DocumentNumber: {
        type: String,
        required: false
    },
    age: {
        type: String,
        required: false
    },
    date: {
        type: String,
        default: false
    },
    hour: {
        type: String,
        default: false
    },
    email: {
        type: String,
        default: false
    },
    observation: {
        type: String,
        required: false
    },
    services: {
        type: String,
        required: false
    },
    tipoConsult: {
        type: String,
        required: false
    },
    checkBox: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: "pending",
    },
    reason: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('appointment', ScheduleSchema);