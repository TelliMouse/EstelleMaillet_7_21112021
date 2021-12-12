const User = require('../models/User');
const sql = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//retourne directement une erreur après le query
//retourne Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
exports.signup = (req, res, next) => {
    console.log('début controller signup');
    console.log('signup req body passowrd', req.body.password);
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        console.log('étape 1 signup');
        /*console.log('signup email & hash:', req.body.email, hash);
        const user = {
            email: req.body.email,
            password: hash
        });
        console.log('signup user:', user);*/
        console.log('étape 2 signup');
        sql.query(`INSERT INTO user (firstname, lastname, email, password) VALUES ('${req.body.firstname}', '${req.body.lastname}', '${req.body.email}', '${hash}')`, (error, result) => {
            if(error) {console.log('erreur query signup');
                console.log(error);
                return res.status(400).json({ error });}
            console.log('fin contr signup');
            return res.status(201).json({message: 'User created!'})
        })
    })
    .catch(error => res.status(500).json({ error }))
};

//retourne la première erreur après la première query
exports.login = /*async*/ (req, res, next) => {
    console.log('début contr login');
    sql.query(`SELECT * FROM user WHERE email = '${req.body.email}'`, /*async*/ (error, result) => {
        if(error) return res.status(500).json({ error });
        else {
            console.log('étape 1 login');
            console.log('reqbodypassword: ', req.body.password);
            //console.log('password: ', result[0].password);
            //l'erreur se trouve au niveau de bcrypt.compare
            /*const match = await*/ bcrypt.compare(req.body.password, result[0].password)
            .then(valid => {
                /*if(!match) {*/if(!valid) {
                    return res.status(401).json({message: 'Password is invalid!'})
                }
                console.log('étape 2 login');
                const cookieJWT = req.cookies.JWT;
                if(cookieJWT === undefined) {
                    console.log('cookie undefined');
                    const token = jwt.sign(
                        {user_id: result[0].id},
                        process.env.TOKEN_SECRET,
                        {expiresIn: '24h'}
                    )
                    console.log('token: ', token);
                    console.log('result0id: ', result[0].id);
                    console.log('fin contr login');
                    return res.cookie('jwt', token, { maxAge: 86400, httpOnly: true }).status(200).json({ id : result[0].id });
                }
                console.log('cookieJWT: ', cookieJWT);
                const decodedToken = jwt.verify(cookieJWT, process.env.TOKEN_SECRET);
                console.log('decodedToken: ', decodedToken);
                const decodedId = decodedToken.user_id;
                console.log('decodedId: ', decodedId);
                const userId = result[0].id;
                console.log('userId', userId);
                console.log('étape 3 login');
                if(decodedId != userId) {
                    console.log('id différent');
                    const token = jwt.sign(
                        {user_id: result[0].id},
                        process.env.TOKEN_SECRET,
                        {expiresIn: '24h'}
                    )
                    console.log('token: ', token);
                    console.log('result0id: ', result[0].id);
                    console.log('fin contr login');
                    return res.cookie('jwt', token, { maxAge: 86400, httpOnly: true }).status(200).json({ id: result[0].id });
                } else {
                    console.log('fin contr login');
                    return res.status(200).json(result[0].id);
                }
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
};

exports.getUserById = (req, res, next) => {
    console.log('début contr getUserById');
    sql.query(`SELECT * FROM user WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(404).json({ error });
        console.log('fin contr get UserById');
        res.status(200).json(result[0]);
    })
};

exports.getAllUsers = (req, res, next) => {
    console.log('début contr getAllUsers');
    sql.query('SELECT * FROM user', (error, result) => {
        if(error) res.status(400).json({ error });
        console.log('fin contr getAllUsers');
        res.status(200).json(result);
    })
}