'use strict';

const express = require('express');
const morgan = require('morgan');
const courseDao = require('./course_dao');
const userDao = require('./user_dao');
const { check, validationResult } = require('express-validator');
const cors = require('cors');

//Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// init express
const app = new express();
const PORT = 3001;

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));


//Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password)
  if (!user)
    return cb(null, false, 'Incorrect username and/or password.');

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

app.use(session({
  secret: "bugliano is life",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(400).json({ error: "Not authorized!" });
}

/* APIs */

// POST /api/sessions
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      return res.status(401).json("Wrong username and/or password");
    }
    req.login(user, (err) => {
      if (err)
        return next(err);
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

//API

//GET /api/studyPlan
app.get('/api/studyPlan', isLoggedIn, (req, res) => {
  courseDao.studyPlan(req.user.id)
    .then(courses => res.status(200).json(courses))
    .catch(() => res.status(500).json({ "error": "Database error." }).end());
});

//GET /api/diffCourses
app.get('/api/diffCourses', isLoggedIn, (req, res) => {
  courseDao.diffCourses(req.user.id)
    .then(courses => res.status(200).json(courses))
    .catch(() => res.status(500).json({ "error": "Database error." }).end());
});

//GET /api/courses
app.get('/api/courses', (req, res) => {
  courseDao.coursesList()
    .then(courses => res.status(200).json(courses))
    .catch(() => res.status(500).json({ "error": "Database error." }).end());
});





// DELETE /api/studyPlan
app.delete('/api/studyPlan', isLoggedIn, (req, res) => {
  return courseDao.deleteStudyPlan(req.user.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(503).json(String(err)));
});


//POST /api/studyPlan
app.post('/api/studyPlan', isLoggedIn, [check('newCourses').isArray()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }
  return courseDao.saveStudyPlan(req.user.id, req.body.newCourses)
    .then(() => res.status(201).end())
    .catch(err => res.status(503).json(String(err)));

});


//PUT /api/courses
app.put('/api/courses', isLoggedIn, [check("number").isInt({ min: -1, max: 1 }).withMessage('Invalid modifier for the number of enrolled students')], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }
  return courseDao.modifyNumberofEnrolledStudents(req.user.id, req.body.number)
    .then(() => res.status(204).end())
    .catch(() => res.status(503).json({ "error": "Database error while retrieving courses" }).end());
});


//PUT /api/users
app.put('/api/users', isLoggedIn, [check("option").isInt({ min: 0, max: 1 }).optional({ nullable: true }).withMessage('Invalid option for studyPlan')], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }
  return courseDao.updateEnrollmentOption(req.user.id, req.body.option)
    .then(() => res.status(204).end())
    .catch(() => res.status(503).json({ "error": "Database error while retrieving users" }).end());
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`))