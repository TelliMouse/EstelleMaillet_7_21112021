const jwt = require('jsonwebtoken');
const sql = require('../db');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        //Retrieve the token in cookies
        const token = req.cookies.jwt;
        //Decode the retrieved token against the token secret in .env
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;

        const isAdmin = (id) => {
            sql.query(`SELECT * FROM user WHERE id = ${id}`, (error, result) => {
                if(error) res.statut(400).json({ error });
                return result[0].admin;
            })
        };

        if(req.body.userId && (req.body.userId === userId || isAdmin(req.body.userId))) {
            next();
        } else {
            res.status(403).json({message: 'Unauthorized request'});
        }

    } catch (error) {
        res.status(401).json({error: error | 'Request not authentified'});
    }
};