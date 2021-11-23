const Comment = require('../models/Comment');
const sql = require('../db');

exports.createComment = (req, res, next) => {
    const comment = new Comment({
        ...req.body,
        likes: 0,
        dislikes: 0,
        usersLike: '[]',
        usersDislike: '[]'
    })
    sql.query('INSERT INTO comment SET ?', comment, (error, result) => {
        if(error) res.status(400).json({ error });
        res.status(201).json({message: 'Comment created!'});
    });
};

exports.modifyComment = (req, res, next) => {
    const postObject = {...req.body};
    sql.query(`UPDATE comment WHERE id = ${req.params.id} SET ?`, postObject, (error, result) => {
        if(error) res.status(400).json({ error });
        res.status(200).json({message: 'Comment successfully modified!'});
    });
};

exports.deleteComment = (req, res, next) => {
    sql.query(`SELECT * FROM comment WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(500).json({ error });
        sql.query(`DELETE FROM comment WHERE id = ${req.params.id}`, (error, result) => {
            if(error) res.status(400).json({ error });
            res.status(200).json({message: 'Comment successfully deleted!'});
            
        })
    })
};

exports.likeComment = (req, res, next) => {
    sql.query(`SELECT * FROM comment WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(400).json({ error });

        //usersLiked is stored as an array stringified
        const likesList = JSON.parse(result[0].usersLiked);
        const dislikesList = JSON.parse(result[0].usersDislike);

        const hasTheUserAlreadyLikedOrDisliked = () => {
            
            //Return 'likes' if the user has liked
            for(let userId of likesList) {
                if(userId === req.body.userId) {
                    return 'likes';
                };
            };

            //Return 'dislikes' if the user has disliked
            for(let userId of dislikesList) {
                if(userId === req.body.userId) {
                    return 'dislikes';
                };
            };

            return false;
        };

        if(req.body.like === 1 && !hasTheUserAlreadyLikedOrDisliked()) {

            likesList.push(req.body.user_id);
            const commentObject = {
                ...result[0],
                likes: result[0].likes + 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE comment WHERE id = ${req.params.id} SET ?`, commentObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Comment successfully liked!'});
            })
        } else if(req.body.like === -1 && !hasTheUserAlreadyLikedOrDisliked()) {

            dislikesList.push(req.body.user_id);
            const commentObject = {
                ...result[0],
                dislikes: result[0].dislikes + 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE comment WHERE id = ${req.params.id} SET ?`, commentObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Comment successfully disliked!'});
            })
        } else if(req.body.like === 0 & hasTheUserAlreadyLikedOrDisliked() === 'likes') {

            const index = likesList.indexOf(req.body.user_id);
            likesList.splice(index, 1);
            const commentObject = {
                ...result[0],
                likes: result[0].likes - 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE comment WHERE id = ${req.params.id} SET ?`, commentObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Comment successfully unliked!'});
            })
        } else if(req.body.like === 0 && hasTheUserAlreadyLikedOrDisliked() === 'dislikes') {

            const index = dislikesList.indexOf(req.body.user_id);
            dislikesList.splice(index, 1);
            const commentObject = {
                ...result[0],
                dislikes: result[0].dislikes - 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE comment WHERE id = ${req.params.id} SET ?`, commentObject, (error, result) => {
                if(error) res.status(400).json({ error });
                res.status(200).json({message: 'Comment successfully undisliked!'});
            })
        } else {
            return res.status(400).json({message: 'The user cannot like/dislike the comment'});
        }
    })
};