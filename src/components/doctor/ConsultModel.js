const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsultSchema = Schema({
    
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
<<<<<<< HEAD
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
=======
>>>>>>> 98c6fb10fd804a92fcb1a1e99993d8ccf6c15099
    description: {
        type: String,
        required: true
    },
    description2: {
        type: String,
        required: true
    },
<<<<<<< HEAD
    specialization: {
        type: mongoose.Schema.Types.String,
        ref: 'doctor',
        required: true
    },
=======
>>>>>>> 98c6fb10fd804a92fcb1a1e99993d8ccf6c15099
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