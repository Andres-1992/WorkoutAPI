const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    workoutName: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    notes: {
        type: String,
    },
    isFinished: {
        type: Boolean,
        default: false
    },
    totalWeightLifted: {
        type: Number,
        required: true,
        default: 0
    },
    username: { type: String },
    exercises: [{
        name: {
            type: String,
        },
        workoutSets: [
            {
                repetitions: {
                    type: Number,
                },
                weight: {
                    type: Number,
                }
            }
        ]
    }]

});

module.exports = mongoose.model('Workout', workoutSchema);
