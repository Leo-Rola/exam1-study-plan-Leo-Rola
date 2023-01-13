'use strict';
/* Data Access Object (DAO) module for accessing films */

const sqlite = require('sqlite3');
const { Course } = require('./course');

const db = new sqlite.Database('courses.db', err => { if (err) throw err; });

exports.coursesList = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM courses";

        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.students, row.maxStudents, row.incompatibleCourses, row.preparatoryCourse));
                resolve(courses);
            }
        });
    })
}

exports.studyPlan = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM studyPlans JOIN courses ON courses.code = studyPlans.code WHERE studyPlans.studentID = ?'
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else {
                const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.students, row.maxStudents, row.incompatibleCourses, row.preparatoryCourse));
                resolve(courses);
            }
        });
    })
}

exports.diffCourses = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM courses WHERE courses.code NOT IN (SELECT studyPlans.code FROM studyPlans WHERE studyPlans.studentID=?)'
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else {
                const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.students, row.maxStudents, row.incompatibleCourses, row.preparatoryCourse));
                resolve(courses);
            }
        });
    })
}

exports.modifyNumberofEnrolledStudents = (id, number) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE courses SET students = students + ? WHERE courses.code IN (SELECT code FROM studyPlans WHERE studyPlans.studentID = ?)';
        db.run(sql, [number, id], function (err) {
            if (err) {
                reject(err);
            } else
                resolve(null);
        });
    });
}
exports.updateEnrollmentOption = (id, option) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET fullTime = ? WHERE studentID = ? ';
        db.run(sql, [option, id], function (err) {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}

exports.saveStudyPlan = (id, newCourses) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < newCourses.length; i++) {
            let newCourse = newCourses[i];
            const sql = 'INSERT INTO studyPlans VALUES (?, ?)';
            db.run(sql, [id, newCourse], function (err) {
                if (err) {
                    reject(err);
                    return;
                } else
                    resolve(null);
            });
        }
    });
}


exports.deleteStudyPlan = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM studyPlans WHERE studentID = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}