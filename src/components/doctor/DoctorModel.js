var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DoctorSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    documentNumber: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    perfil: {
        type: String,
        default: 'perfil.png',
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        required: true
    },
    lastLoginDate: {
        type: Date,
        default: null,
    },
    active: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        default: 'doctor',
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    services: {
        type: [String],
        default: [],
        required: true
    }
});

module.exports = mongoose.model('doctor', DoctorSchema);