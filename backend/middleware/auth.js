const jwt = require('jsonwebtoken');
const sql = require('../db');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        console.log('début auth');
        if(!req.cookies) {
            console.log('pas de req cookies');
            return res.status(401).json({ message: 'No cookie found'})
        }
        //Retrieve the token in cookies
        const token = req.cookies.jwt;
        //const token = new Cookies(req, res).get('jwt')
        console.log('token auth:', token);
        if(!token) {
            console.log('auth token undefined');
            return res.status(401).json({ message: 'No token found'})
        }
        console.log('token defined');
        //Decode the retrieved token against the token secret in .env
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
            if(error) return res.status(400).json(error);
            const userId = decoded.user_id;
            console.log('userid decodedtoken auth: ', userId);

            //Is the user an admin
            console.log('début auth isAdmin');
            sql.query(`SELECT * FROM user WHERE id = ${userId}`, (error, result) => {
                if(error) {console.log('erreur isadmin'); return res.status(400).json({ error })};
                console.log('no error in isAdmin');
                console.log('res isadmin auth ', result);
                //Admin is a BIT type, aka returns 1 for true, 0 for false, and will propably be written as a string ('0' is truthy while 0 is falsy)
                //Admin is returned as: "admin": { "type": "Buffer", "data": [ 0 ou 1 ]}
                //return parseInt(result[0].admin.data[0], 10);
                const admin = parseInt(result[0].admin, 10);

                if(req.body.user_id && req.body.user_id !== userId && !admin) {
                    console.log('mauvais token');
                    return res.status(403).json({message: 'Unauthorized request'});
                } else {
                    console.log('bon token');
                    next();
                }
            })
        })
        /*const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        console.log('userid decodedtoken auth: ', userId);

        const isAdmin = (id) => {
            console.log('début auth isAdmin');
            sql.query(`SELECT * FROM user WHERE id = ${id}`, (error, result) => {
                if(error) return res.status(400).json({ error });
                console.log('no error in isAdmin');
                //Admin is a BIT type, aka returns 1 for true, 0 for false, and will propably be written as a string ('0' is truthy while 0 is falsy)
                //Admin is returned as: "admin": { "type": "Buffer", "data": [ 0 ou 1 ]}
                return parseInt(result[0].admin.data[0], 10);
            })
        };

        if(req.body.user_id && req.body.user_id !== userId && !isAdmin(userId)) {
            console.log('mauvais token');
            return res.status(403).json({message: 'Unauthorized request'});
        } else {
            console.log('bon token');
            next();
        }*/

    } catch (error) {
        console.log('erreur try auth');
        return res.status(401).json({error: error | 'Request not authentified'});
    }
};