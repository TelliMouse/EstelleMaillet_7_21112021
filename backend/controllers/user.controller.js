const User = require('../models/User');
const sql = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        sql.query('INSERT INTO user SET ?', user, (error, result) => {
            if(error) res.status(400).json({ error });
            res.status(201).json({message: 'User created!'})
        })
    })
    .catch(error => res.status(500).json({ error }))
};

exports.login = (req, res, next) => {
    sql.query(`SELECT * FROM user WHERE email = ${req.body.email}`, (error, result) => {
        if(error) res.status(500).json({ error });
        else {
            bcrypt.compare(req.body.password, result[0].password)
            .then(valid =>{
                if(!valid) {
                    return res.status(401).json({message: 'Password is invalid!'})
                }
                res.status(200).json({
                    id: result.id,
                    token: jwt.sign(
                        {user_id: result.id},
                        process.env.TOKEN_SECRET,
                        {expiresIn: '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
};

exports.getUserById = (req, res, next) => {
    sql.query(`SELECT * FROM user WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(404).json({ error });
        res.status(200).json(result[0]);
    })
}