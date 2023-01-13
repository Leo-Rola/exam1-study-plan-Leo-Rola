'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('courses.db', err => { if (err) throw err; });

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                const user = { id: row.studentID, username: row.email, name: row.name, surname: row.surname, fullTime: row.fullTime };

                crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                    if (err) {
                        reject(err);
                    }
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) {
                        resolve(false);
                    } else {
                        resolve(user);
                    }
                })
            }
        })
    })
}
