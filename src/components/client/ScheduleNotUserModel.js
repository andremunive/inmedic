const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = Schema({
    name: {
        type: String,
        required: false
    },
    DocumentNumber: {
        tyme: String,
        required: false
    },
    birthDate: {
        type: String,
        required: false
    },
    fecha: {
        type: String,
        default: false
    },
    hora: {
        type: String,
        default: false
    },
    Observation: {
        tyme: String,
        required: false
    },
    services: {
        tyme: String,
        required: false
    },
    tipoConsulta: {
        tyme: String,
        required: false
    },
    status: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('appointment', ScheduleSchema);