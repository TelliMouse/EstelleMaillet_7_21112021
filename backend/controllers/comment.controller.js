const Comment = require('../models/Comment');
const sql = require('../db');

//validé Postman
exports.createComment = (req, res, next) => {
    const comment = {
        ...req.body,
        likes: 0,
        dislikes: 0,
        usersLike: '[]',
        usersDislike: '[]'
    };
    sql.query('INSERT INTO comment SET ?', comment, (error, result) => {
        if(error) res.status(400).json({ error });
        res.status(201).json({message: 'Comment created!'});
    });
};

//validé Postman
exports.modifyComment = (req, res, next) => {
    const postObject = {...req.body};
    sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
        if(error) res.status(400).json({ error });
        res.status(200).json({message: 'Comment successfully modified!'});
    });
};

//validé Postman
exports.deleteComment = (req, res, next) => {
    sql.query(`SELECT * FROM comment WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(500).json({ error });
        sql.query(`DELETE FROM comment WHERE id = ${req.params.id}`, (error, result) => {
            if(error) res.status(400).json({ error });
            res.status(200).json({message: 'Comment successfully deleted!'});
            
        })
    })
};

//validé Postman
exports.likeComment = (req, res, next) => {
    sql.query(`SELECT * FROM comment WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(400).json({ error });

        let likesList = [];
        let dislikesList = [];

        //usersLiked is stored as an array stringified
        const likesListString = JSON.parse(result[0].usersLike);
        const dislikesListString = JSON.parse(result[0].usersDislike);


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

        const hasTheUserAlreadyLikedOrDisliked = () => {

            if(likesList == '[]' || dislikesList == '[]') {
                return false;
            }
            
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

        if(req.body.like === '1' && !hasTheUserAlreadyLikedOrDisliked()) {
            likesList.push(req.body.user_id);
            const commentObject = {
                ...result[0],
                likes: result[0].likes + 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, commentObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Comment successfully liked!'});
            })
        } else if(req.body.like === '-1' && !hasTheUserAlreadyLikedOrDisliked()) {
            dislikesList.push(req.body.user_id);
            const commentObject = {
                ...result[0],
                dislikes: result[0].dislikes + 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, commentObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Comment successfully disliked!'});
            })
        } else if(req.body.like === '0' & hasTheUserAlreadyLikedOrDisliked() === 'likes') {
            const index = likesList.indexOf(req.body.user_id);
            likesList.splice(index, 1);
            const commentObject = {
                ...result[0],
                likes: result[0].likes - 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, commentObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Comment successfully unliked!'});
            })
        } else if(req.body.like === '0' && hasTheUserAlreadyLikedOrDisliked() === 'dislikes') {
            const index = dislikesList.indexOf(req.body.user_id);
            dislikesList.splice(index, 1);
            const commentObject = {
                ...result[0],
                dislikes: result[0].dislikes - 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, commentObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Comment successfully undisliked!'});
            })
        } else {
            return res.status(400).json({message: 'The user cannot like/dislike the comment'});
        }
    })
};

//validé Postman
exports.getOneComment = (req, res, next) => {
    sql.query(`SELECT * FROM comment WHERE id=${req.params.id}`, (error, result) => {
        if(error) res.status(400).json({ error });
        res.status(200).json(result);
    })
};