const User = require('../models/User');
const sql = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Get {firstname, lastname, email, password} in the request and create a new user in the database
exports.signup = (req, res, next) => {
    //Hash the password to not store a plain text password in the database
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        sql.query(`INSERT INTO user (firstname, lastname, email, password) VALUES ('${req.body.firstname}', '${req.body.lastname}', '${req.body.email}', '${hash}')`, (error, result) => {
            if(error) return res.status(400).json({ error })
            return res.status(201).json({message: 'User created!'})
        })
    })
    .catch(error => res.status(500).json({ error }))
};

//Authentifies a user and send a cookie to keep the user's session opened
exports.login = (req, res, next) => {
    sql.query(`SELECT * FROM user WHERE email = '${req.body.email}'`, /*async*/ (error, result) => {
        if(error) return res.status(500).json({ error });
        else {
            //The password is stored as a hash, so we need to use bcrypt.compare to know if the hash corresponds to the plain text password given
            bcrypt.compare(req.body.password, result[0].password)
            .then(valid => {
                //bcrypt.compare returns true if the hash and password are compatible, false if not
                if(!valid) {
                    return res.status(401).json({message: 'Password is invalid!'})
                }
                //req.cookie.jwt stores a token generated by jsonwebtoken
                const cookieJWT = req.cookies.jwt;
                if(cookieJWT === undefined) {
                    const token = jwt.sign(
                        {user_id: result[0].id},
                        process.env.TOKEN_SECRET,
                        {expiresIn: '24h'}
                    )
                    return res.cookie('jwt', token, { maxAge: 86400 * 1000, httpOnly: true }).status(200).json({ id : result[0].id });
                }
                //The jwt token stores the user_id of the user that has been authentified
                const decodedToken = jwt.verify(cookieJWT, process.env.TOKEN_SECRET);
                const decodedId = decodedToken.user_id;
                //result[0].id is the id linked to the email given
                const userId = result[0].id;
                //decodedId and userId might be different if two users use the same computer
                if(decodedId != userId) {
                    const token = jwt.sign(
                        {user_id: result[0].id},
                        process.env.TOKEN_SECRET,
                        {expiresIn: '24h'}
                    )
                    return res.cookie('jwt', token, { maxAge: 86400 * 1000, httpOnly: true }).status(200).json({ id: result[0].id });
                } else {
                    return res.status(200).json({ id: result[0].id });
                }
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
};

//validé Postman
exports.getUserById = (req, res, next) => {
    sql.query(`SELECT * FROM user WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(404).json({ error });
        res.status(200).json(result[0]);
    })
};

//validé Postman
exports.getAllUsers = (req, res, next) => {
    sql.query('SELECT * FROM user', (error, result) => {
        if(error) res.status(400).json({ error });
        res.status(200).json(result);
    })
}