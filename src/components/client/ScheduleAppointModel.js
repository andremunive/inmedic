const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = Schema({
    name: {
        type: mongoose.Schema.Types.String,
        ref: 'client',
        required: false
    },
    email: {
        type: mongoose.Schema.Types.String,
        ref: 'client',
        required: false
    },
    birthDate: {
        type: mongoose.Schema.Types.String,
        ref: 'client',
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('appointment', ScheduleSchema);