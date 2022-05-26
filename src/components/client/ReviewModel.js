const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = Schema({
    name: {
        type: mongoose.Schema.Types.String,
        ref: 'client',
        required: true
    },
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('review', ReviewSchema);