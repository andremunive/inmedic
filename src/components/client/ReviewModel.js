const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = Schema ({
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    puntuation: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('review', ReviewSchema);