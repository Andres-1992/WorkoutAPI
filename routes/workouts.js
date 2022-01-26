const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');

// get all workouts
router.get('/', async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// create workout
router.post('/', async (req, res) => {
    const workout = new Workout({
        workoutName: req.body.workoutName,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        notes: req.body.notes,
        isFinished: req.body.isFinished,
        totalWeightLifted: req.body.totalWeightLifted,
        username: req.body.username,
        exercises: req.body.exercises
    });
    try {
        const newWorkout = await workout.save();
        res.status(201).json(newWorkout);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all workouts for a specific user
router.get('/:username', async (req, res) => {
    try {
        const workouts = await Workout.find({ username: req.params.username });
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// patch a workout for a specific user
router.patch('/:username/:id', getWorkout, async (req, res) => {
    if (req.body.workoutName != null) {
        res.workout.workoutName = req.body.workoutName;
    }
    if (req.body.startTime != null) {
        res.workout.startTime = req.body.startTime;
    }
    if (req.body.endTime != null) {
        res.workout.endTime = req.body.endTime;
    }
    if (req.body.notes != null) {
        res.workout.notes = req.body.notes;
    }
    if (req.body.isFinished != null) {
        res.workout.isFinished = req.body.isFinished;
    }
    if (req.body.totalWeightLifted != null) {
        res.workout.totalWeightLifted = req.body.totalWeightLifted;
    }
    if (req.body.exercises != null) {
        res.workout.exercises = req.body.exercises;
    }
    try {
        const updatedWorkout = await res.workout.save();
        res.json(updatedWorkout);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Function to get a single workout for a specific user
async function getWorkout(req, res, next) {
    let workout;
    try {
        workout = await Workout.findOne({ username: req.params.username, _id: req.params.id });
        if (workout == null) {
            return res.status(404).json({ message: 'Cannot find workout' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.workout = workout;
    next();
}


module.exports = router;
