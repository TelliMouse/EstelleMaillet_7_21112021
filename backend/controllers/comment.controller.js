const sql = require('../db');

//Create comment and insert it in the database, in the table "comment"
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

//Modify a comment in the table "comment", using its id as parameter
exports.modifyComment = (req, res, next) => {
    const postObject = {...req.body};
    sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
        if(error) res.status(400).json({ error });
        res.status(200).json({message: 'Comment successfully modified!'});
    });
};

//Delete a comment from the table "comment", using its id as a parameter
exports.deleteComment = (req, res, next) => {
    sql.query(`SELECT * FROM comment WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(500).json({ error });
        sql.query(`DELETE FROM comment WHERE id = ${req.params.id}`, (error, result) => {
            if(error) res.status(400).json({ error });
            res.status(200).json({message: 'Comment successfully deleted!'});
            
        })
    })
};

//Change the number of likes or dislikes, and modify the array storing the user id of users who liked/disliked, of a comment
exports.likeComment = (req, res, next) => {
    //First we find the comment that is "liked" from its id
    sql.query(`SELECT * FROM comment WHERE id = ${req.params.id}`, (error, result) => {
        if(error) res.status(400).json({ error });

        let likesList = [];
        let dislikesList = [];

        //usersLiked and usersDisliked are stored as an array stringified
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

        /**
         * Verifies if the user has already liked or disliked the comment, returns false if not, and 'likes' or 'dislikes' if the user has liked, or disliked, respectively
         * @returns { String | Boolean }
         */
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

        //Req.body.like can be equal to 1, -1, or 0, and the previous function can return false, likes, or dislikes
        //We then have 4 conditions that can happen when there are no error: 

        //Condtion where the user likes a comment and hasn't already liked/disliked
        if(req.body.like === 1 && !hasTheUserAlreadyLikedOrDisliked()) {
            //We add the user id to the array that stores the id of users that liked
            likesList.push(req.body.user_id);
            //We create a new object with the updated data
            const commentObject = {
                ...result[0],
                likes: result[0].likes + 1,
                usersLike: JSON.stringify(likesList)
            }
            //We update the comment in the database with the new object
            sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, commentObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Comment successfully liked!'});
            })

        //Condition where the user dislikes a comment and hasn't already liked/disliked
        } else if(req.body.like === -1 && !hasTheUserAlreadyLikedOrDisliked()) {
            //We add the user id to the array that stores the id of users that disliked
            dislikesList.push(req.body.user_id);
            //We create a new object with the updated data
            const commentObject = {
                ...result[0],
                dislikes: result[0].dislikes + 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            //We update the comment in the database with the new object
            sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, commentObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Comment successfully disliked!'});
            })
        
        //Condition where the user likes again a comment and has already liked (in order to delete their like)
        } else if(req.body.like === 0 & hasTheUserAlreadyLikedOrDisliked() === 'likes') {
            //We find the index of the user's id in the array, then delete the id from it
            const index = likesList.indexOf(req.body.user_id);
            likesList.splice(index, 1);
            //We create a new object with the updated data
            const commentObject = {
                ...result[0],
                likes: result[0].likes - 1,
                usersLike: JSON.stringify(likesList)
            }
            //We update the comment in the database with the new object
            sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, commentObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Comment successfully unliked!'});
            })

        //Condition where the user dislikes again a comment and has already disliked (in order to delete their dislike)
        } else if(req.body.like === 0 && hasTheUserAlreadyLikedOrDisliked() === 'dislikes') {
            //We find the index of the user's id in the array, then delete the id from it
            const index = dislikesList.indexOf(req.body.user_id);
            dislikesList.splice(index, 1);
            //We create a new object with the updated data
            const commentObject = {
                ...result[0],
                dislikes: result[0].dislikes - 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            //We update the comment in the database with the new object
            sql.query(`UPDATE comment SET ? WHERE id = ${req.params.id}`, commentObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Comment successfully undisliked!'});
            })
        } else {
            return res.status(400).json({message: 'The user cannot like/dislike the comment'});
        }
    })
};

exports.getOneComment = (req, res, next) => {
    sql.query(`SELECT * FROM comment WHERE id = ${req.params.id}`, (error, result) => {
        if(error) return res.status(400).json({ error });
        return res.status(200).json(result[0]);
    })
}