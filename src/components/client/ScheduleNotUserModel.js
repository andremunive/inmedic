const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = Schema({
    name: {
        type: String,
        required: false
    },
    DocumentNumber: {
        type: String,
        required: false
    },
    birthDate: {
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
    status: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('appointment', ScheduleSchema);