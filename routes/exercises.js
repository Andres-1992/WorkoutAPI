const express = require('express');
const router = express.Router();
const Exercise = require('../models/exercise');

// get all exercises
router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

// get one exercise
router.get('/:name', getExercise, (req, res) => {
    res.json(res.exercise);
});

// create exercise
router.post('/', async (req, res) => {
    const exercise = new Exercise({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        targetedMuscle: req.body.targetedMuscle
    });
    try {
        const newExercise = await exercise.save();
        res.status(201).json(newExercise);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// update exercise
router.patch('/:name', getExercise, async (req, res) => {
    if (req.body.name != null) {
        res.exercise.name = req.body.name;
    }
    if (req.body.category != null) {
        res.exercise.category = req.body.category;
    }
    if (req.body.description != null) {
        res.exercise.description = req.body.description;
    }
    if (req.body.targetedMuscle != null) {
        res.exercise.targetedMuscle = req.body.targetedMuscle;
    }
    try {
        const updatedExercise = await res.exercise.save();
        res.json(updatedExercise);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete exercise
router.delete('/:name', getExercise, async (req, res) => {
    try {
        await res.exercise.remove();
        res.json({ message: 'Deleted Exercise' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getExercise(req, res, next) {
    let exercise;
    try {
        exercise = await Exercise.findOne({ name: req.params.name });
        if (exercise == null) {
            return res.status(404).json({ message: 'Cannot find exercise' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.exercise = exercise;
    next();

}
module.exports = router;