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
        res.status(201).json({message: 'Comment created!', id: result.insertId});
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
    console.log('contr likecomment id: ', req.params.id);
    sql.query(`SELECT * FROM comment WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(400).json({ error });
        console.log('début likecomment');

        let likesList = [];
        let dislikesList = [];

        //usersLiked is stored as an array stringified
        const likesListString = JSON.parse(result[0].usersLike);
        console.log('likesliststring: ', likesListString);
        const dislikesListString = JSON.parse(result[0].usersDislike);
        console.log('dislikeliststring: ', dislikesListString);


        if(likesListString != '[]') {
            console.log('condition likelist not empty');
            for(let id of likesListString) {
                console.log('like push');
                likesList.push(id);
            }
        }

        if(dislikesListString != '[]') {
            console.log('condition dislikelist not empty');
            for(let id of dislikesListString) {
                console.log('dislike push')
                dislikesList.push(id);
            }
        }

        const hasTheUserAlreadyLikedOrDisliked = () => {
            console.log('hastheuser début');

            if(likesList == '[]' || dislikesList == '[]') {
                console.log('hastheuser false');
                return false;
            }
            
            //Return 'likes' if the user has liked
            for(let userId of likesList) {
                if(userId === req.body.user_id) {
                    console.log('hastheuser likes');
                    return 'likes';
                };
            };

            //Return 'dislikes' if the user has disliked
            for(let userId of dislikesList) {
                if(userId === req.body.user_id) {
                    console.log('hastheuser dislikes');
                    return 'dislikes';
                };
            };

            console.log('hastheuser false2');
            return false;
        };

        if(req.body.like === 1 && !hasTheUserAlreadyLikedOrDisliked()) {
            console.log('condition 1 !');
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
        } else if(req.body.like === -1 && !hasTheUserAlreadyLikedOrDisliked()) {
            console.log('condition -1 !');
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
        } else if(req.body.like === 0 & hasTheUserAlreadyLikedOrDisliked() === 'likes') {
            console.log('condition 0 likes');
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
        } else if(req.body.like === 0 && hasTheUserAlreadyLikedOrDisliked() === 'dislikes') {
            console.log('condition 0 dislikes');
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
            console.log('condition else');
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