const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsultSchema = Schema({
    
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    perfil: {
        type: mongoose.Schema.Types.String,
        ref: 'doctor',
        required: true
    },
    name: {
        type: mongoose.Schema.Types.String,
        ref: 'doctor',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    description2: {
        type: String,
        required: true
    },
    specialization: {
        type: mongoose.Schema.Types.String,
        ref: 'doctor',
        required: true
    },
    services: {
        type: mongoose.Schema.Types.Array,
        ref: 'doctor',
        required: true
    },
    tipoConsulta: {
        type: String,
        required: true
    },
    precio: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('consult', ConsultSchema);