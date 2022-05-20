const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConsultSchema = Schema({
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    // idClient: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'client',
    //     required: true
    // },
    tipoConsulta: {
        type: String,
        required: true
    },
    precio: {
        type: String,
        required: true
    },
    //time : { type : Date, default: Date.now }  
});

module.exports = mongoose.model('consult', ConsultSchema);