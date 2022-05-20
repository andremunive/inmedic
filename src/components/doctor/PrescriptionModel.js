const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrescriptionSchema = Schema({
    idConsult: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'consult',
        required: true
    },
    details: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('prescription', PrescriptionSchema);