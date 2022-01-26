const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    targetedMuscle: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);