const jwt = require('jsonwebtoken');
const sql = require('../db');
require('dotenv').config();

//Authentification middleware, that checks the info of the cookie created when the user logged in
module.exports = (req, res, next) => {
    try {
        if(!req.cookies) {
            return res.status(401).json({ message: 'No cookie found'})
        }
        //Retrieve the token in cookies
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({ message: 'No token found'})
        }
        //Decode the retrieved token against the token secret in .env
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
            if(error) return res.status(400).json(error);
            const userId = decoded.user_id;

            //Is the user an admin
            sql.query(`SELECT * FROM user WHERE id = ${userId}`, (error, result) => {
                if(error) return res.status(400).json({ error })
                //Admin is a BIT type, aka returns 1 for true, 0 for false, and will propably be written as a string ('0' is truthy while 0 is falsy)
                //Admin is returned as: "admin": { "type": "Buffer", "data": [ 0 ou 1 ]}
                const admin = parseInt(result[0].admin, 10);

                if(req.body.user_id && req.body.user_id !== userId && !admin) {
                    return res.status(403).json({message: 'Unauthorized request'});
                } else {
                    next();
                }
            })
        })
    } catch (error) {
        return res.status(401).json({error: error | 'Request not authentified'});
    }
};