const Post = require('../models/Post');
const sql = require('../db');
const fs = require('fs');

//il y aura le middleware multer avant, du coup, si y'a un file, le body est en JSON
exports.createPost = (req, res, next) => {
    if(req.file) {
        const postObject = JSON.parse(req.body);
        const post = new Post({
            ...postObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLike: '[]', //set as a string of an empty that will be parsed and stringified when manipulated 
            usersDislike: '[]'
        })
        sql.query('INSERT INTO post SET ?', post, (error, result) => {
            if(error) res.status(400).json({ error });
            res.status(201).json({message: 'Post created!'});
        });
    } else {
        const post = new Post({
            ...req.body,
            likes: 0,
            dislikes: 0,
            usersLike: '[]',
            usersDislike: '[]'
        })
        sql.query('INSERT INTO post SET ?', post, (error, result) => {
            if(error) res.status(400).json({ error });
            res.status(201).json({message: 'Post created!'});
        });
    }
};

exports.modifyPost = (req, res, next) => {
    if(req.file) {
        sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
            if(error) res.status(500).json({ error });
            const filename = result[0].imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                const postObject = {
                    ...JSON.parse(req.body.post),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                }
                sql.query(`UPDATE post WHERE id = ${req.params.id} SET ?`, postObject, (error, result) => {
                    if(error) res.status(400).json({ error });
                    res.status(200).json({message: 'Post successfully modified!'});
                })
            })
        })
    } else {
        const postObject = {...req.body};
        sql.query(`UPDATE post WHERE id = ${req.params.id} SET ?`, postObject, (error, result) => {
            if(error) res.status(400).json({ error });
            res.status(200).json({message: 'Post successfully modified!'});
        });
    }
};

exports.deletePost = (req, res, next) => {
    sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(500).json({ error });
        const filename = result[0].imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            sql.query(`DELETE FROM post WHERE id = ${req.params.id}`, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Post successfully deleted!'});
            })
        })
    })
};

exports.likePost = (req, res, next) => {
    sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(400).json({ error });

        //usersLiked is stored as an array stringified
        const likesList = JSON.parse(result[0].usersLiked);
        const dislikesList = JSON.parse(result[0].usersDislike);

        const hasTheUserAlreadyLikedOrDisliked = () => {
            
            //Return 'likes' if the user has liked
            for(let userId of likesList) {
                if(userId === req.body.user_id) {
                    return 'likes';
                };
            };

            //Return 'dislikes' if the user has disliked
            for(let userId of dislikesList) {
                if(userId === req.body.user_id) {
                    return 'dislikes';
                };
            };

            return false;
        };

        if(req.body.like === 1 && !hasTheUserAlreadyLikedOrDisliked()) {

            likesList.push(req.body.user_id);
            const postObject = {
                ...result[0],
                likes: result[0].likes + 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE post WHERE id = ${req.params.id} SET ?`, postObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Post successfully liked!'});
            })
        } else if(req.body.like === -1 && !hasTheUserAlreadyLikedOrDisliked()) {

            dislikesList.push(req.body.user_id);
            const postObject = {
                ...result[0],
                dislikes: result[0].dislikes + 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE post WHERE id = ${req.params.id} SET ?`, postObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Post successfully disliked!'});
            })
        } else if(req.body.like === 0 & hasTheUserAlreadyLikedOrDisliked() === 'likes') {

            const index = likesList.indexOf(req.body.user_id);
            likesList.splice(index, 1);
            const postObject = {
                ...result[0],
                likes: result[0].likes - 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE post WHERE id = ${req.params.id} SET ?`, postObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Post successfully unliked!'});
            })
        } else if(req.body.like === 0 && hasTheUserAlreadyLikedOrDisliked() === 'dislikes') {

            const index = dislikesList.indexOf(req.body.user_id);
            dislikesList.splice(index, 1);
            const postObject = {
                ...result[0],
                dislikes: result[0].dislikes - 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE post WHERE id = ${req.params.id} SET ?`, postObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Post successfully undisliked!'});
            })
        } else {
            return res.status(400).json({message: 'The user cannot like/dislike the post'});
        }
    })
};

exports.getOnePost = (req, res, next) => {
    sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(404).json({ error });
        res.status(200).json(result[0]);
    })
};

exports.getAllPosts = (req, res, next) => {
    sql.query('SELECT * FROM post', (error, result) => {
        if(error) res.status(400).json({ error });
        res.status(200).json(result);
    })
};

exports.getAllCommentsFromPost = (req, res, next) => {
    //select * from comment where post_id = req.params.id
    sql.query(`SELECT * FROM comment WHERE post_id = ${req.params.id}`, (error, result) => {
        if(error) res.status(500).json({ error });
        res.status(200).json(result);
    })
};