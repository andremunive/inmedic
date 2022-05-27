const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = Schema({
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
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
    edad: {
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
    }
});

module.exports = mongoose.model('appointment', ScheduleSchema);