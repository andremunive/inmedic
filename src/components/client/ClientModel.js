var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
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
    active: {
        type: Boolean,
        default: true,
    },
    birthDate: {
        type: String,
        required: true
    },
    lastLoginDate: {
        type: Date,
        default: null,
    },
    role: {
        type: String,
        default: 'user',
        required: true
    },
    
});

module.exports = mongoose.model('client', ClientSchema);