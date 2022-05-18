const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = Schema ({
    idConsult: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'consult',
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