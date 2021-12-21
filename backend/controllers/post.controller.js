const Post = require('../models/Post');
const sql = require('../db');
const fs = require('fs');

//il y aura le middleware multer avant, du coup, si y'a un file, le body est en JSON
//marche sans req.file
exports.createPost = (req, res, next) => {
    console.log('createPost');
    if(req.file) {
        console.log('file existant');
        const postObject = JSON.parse(req.body);
        const post = {
            ...postObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLike: '[]', //set as a string of an empty that will be parsed and stringified when manipulated 
            usersDislike: '[]'
        }
        console.log('pre sql file');
        sql.query('INSERT INTO post SET ?', post, (error, result) => {
            if(error) {console.log('error req file sql', error); return res.status(400).json({ error })};
            return res.status(201).json({message: 'Post created!'});
        });
        console.log('post sql file');
    } else {
        console.log('no file');
        const post = {
            ...req.body,
            likes: 0,
            dislikes: 0,
            usersLike: '[]',
            usersDislike: '[]'
        }
        console.log('pre sql no file');
        sql.query('INSERT INTO post SET ?', post, (error, result) => {
            if(error) return res.status(400).json({ error });
            return res.status(201).json({message: 'Post created!'});
        });
        console.log('post sql no file');
    }
};

//validé sans req.file Postman
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
                sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
                    if(error) return res.status(400).json({ error });
                    return res.status(200).json({message: 'Post successfully modified!'});
                })
            })
        })
    } else {
        const postObject = {...req.body};
        sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
            if(error) return res.status(400).json({ error });
            return res.status(200).json({message: 'Post successfully modified!'});
        });
    }
};

//validé sans req.file Postman
exports.deletePost = (req, res, next) => {
    sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(500).json({ error });
        if(result[0].imageUrl) {
            const filename = result[0].imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sql.query(`DELETE FROM post WHERE id = ${req.params.id}`, (error, result) => {
                    if(error) return res.status(400).json({ error });
                    return res.status(200).json({message: 'Post successfully deleted!'});
                })
            })
        } else {
            sql.query(`DELETE FROM post WHERE id = ${req.params.id}`, (error, result) => {
                if(error) return res.status(500).json({ error });
                return res.status(200).json({ message: 'Post successfully deleted!'});
            })
        }
        
    })
};


//validé Postman
exports.likePost = (req, res, next) => {
    sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(400).json({ error });
        
        console.log('début contr likepost');

        let likesList = [];
        let dislikesList = [];
        
        //usersLiked is stored as an array stringified
        const likesListString = JSON.parse(result[0].usersLike);
        const dislikesListString = JSON.parse(result[0].usersDislike);

        console.log('set lists');

        if(likesListString != '[]') {
            for(let id of likesListString) {
                likesList.push(id);
            }
        }

        if(dislikesListString != '[]') {
            for(let id of dislikesListString) {
                dislikesList.push(id);
            }
        }
        console.log('listify lists');
        console.log('likelist: ', likesList);
        console.log('dislikeslist: ', dislikesList);

        const hasTheUserAlreadyLikedOrDisliked = () => {
            
            if(likesList == '[]' || dislikesList == '[]') {
                console.log('empty list');
                return false;
            }

            //Return 'likes' if the user has liked
            for(let userId of likesList) {
                if(userId === req.body.user_id) {
                    console.log('already likes');
                    return 'likes';
                };
            };

            //Return 'dislikes' if the user has disliked
            for(let userId of dislikesList) {
                if(userId === req.body.user_id) {
                    console.log('already disliked');
                    return 'dislikes';
                };
            };

            console.log('not liked');
            return false;
        };

        if(req.body.like === '1' && !hasTheUserAlreadyLikedOrDisliked()) {
            console.log('condition 1');
            likesList.push(req.body.user_id);
            const postObject = {
                ...result[0],
                likes: result[0].likes + 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Post successfully liked!'});
            })
        } else if(req.body.like === '-1' && !hasTheUserAlreadyLikedOrDisliked()) {
            console.log('condition 2');
            dislikesList.push(req.body.user_id);
            const postObject = {
                ...result[0],
                dislikes: result[0].dislikes + 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Post successfully disliked!'});
            })
        } else if(req.body.like === '0' & hasTheUserAlreadyLikedOrDisliked() === 'likes') {
            console.log('condition 3');
            const index = likesList.indexOf(req.body.user_id);
            likesList.splice(index, 1);
            const postObject = {
                ...result[0],
                likes: result[0].likes - 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Post successfully unliked!'});
            })
        } else if(req.body.like === '0' && hasTheUserAlreadyLikedOrDisliked() === 'dislikes') {
            console.log('condition 4');
            const index = dislikesList.indexOf(req.body.user_id);
            dislikesList.splice(index, 1);
            const postObject = {
                ...result[0],
                dislikes: result[0].dislikes - 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Post successfully undisliked!'});
            })
        } else {
            return res.status(400).json({message: 'The user cannot like/dislike the post'});
        }
    })
};

//validé Postman
exports.getOnePost = (req, res, next) => {
    sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(404).json({ error });
        res.status(200).json(result);
    })
};

//validé Postman
exports.getAllPosts = (req, res, next) => {
    sql.query('SELECT * FROM post ORDER BY date DESC', (error, result) => {
        if(error) return res.status(400).json({ error });
        return res.status(200).json(result);
    })
};

//validé Postman
exports.getAllCommentsFromPost = (req, res, next) => {
    //select * from comment where post_id = req.params.id
    sql.query(`SELECT * FROM comment WHERE post_id = ${req.params.id} ORDER BY date ASC`, (error, result) => {
        if(error) res.status(500).json({ error });
        res.status(200).json(result);
    })
};