require('dotenv').config(); // Load .env file

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./models/user');
const Url = require('./url')

//Connect to MongoDB
mongoose.connect(Url.url, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to MongoDB'));


// setup middleware
app.use(express.json());

const exercisesRouter = require('./routes/exercises');
app.use('/api/exercises', exercisesRouter); // '/api/exercises' is the base URL for the exercisesRouter to use

const workoutsRouter = require('./routes/workouts');
app.use('/api/workouts', workoutsRouter); // '/api/workouts' is the base URL for the workoutsRouter to use

//  Use sessions for tracking logins
app.use(session({
    secret: 'workout tracker secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db
    })
})
);

//Create User
app.post('/api/user', async (req, res) => {
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// login
app.post("/api/user/login", (req, res, next) => {
    console.log("request recieved");
    User.authenticate(req.body.username, req.body.password, (error, user) => {
        console.log("Authenticating");
        if (error || !user) {
            console.log("error");
            var err = new Error("Wrong email or password.");
            err.status = 401;
            return next(err);
        } else {
            console.log("no error");
            req.session.userID = user._id;
            res.json({ message: user.username + " logged in" });
        }
    });
});

// Delete user
app.delete('/api/user/delete', async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userID);
        if (user == null) {
            res.status(404).json({ message: 'User not found' });
        } else {
            User.authenticate(user.username, req.body.password, (error, user) => {
                console.log("Authenticating");
                if (error || !user) {
                    console.log("error");
                    var err = new Error("Wrong email or password.");
                    err.status = 401;
                    return next(err);
                } else {
                    console.log("no error");
                    user.remove();
                    res.json({ message: "User was removed" });
                }
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// connect to port
app.set('port', 3000);
app.listen(app.get('port'), () => {
    console.log("Server running on port " + app.get('port'))
});















