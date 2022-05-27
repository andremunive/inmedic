var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DoctorSchema = Schema({
    name: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: true
    },
    documentNumber: {
        type: String,
        required: true
    },
    professionalCard: {
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
        required: false
    },
    perfil: {
        type: String,
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
        required: false
    },
    services: {
        type: [String],
        default: [],
        required: false
    }
});

module.exports = mongoose.model('doctor', DoctorSchema);