const sql = require('../db');
const fs = require('fs');

//Create post, retrieve request body and set likes and dislikes, if there is a file attached, it went through the multer middleware, so we can set the imageUrl
exports.createPost = (req, res, next) => {
    //The request can either contain or not an image file, so we need to treat those requests differently from each other
    if(req.file) {
        //When there is a file, the request body looks like: body: formData.append('image', image-file), .append('json', json-of-an-object)
        const postObject = JSON.parse(req.body.json);
        const post = {
            ...postObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLike: '[]', //set as a string of an empty that will be parsed and stringified when manipulated 
            usersDislike: '[]'
        }
        sql.query('INSERT INTO post SET ?', post, (error, result) => {
            if(error) return res.status(400).json({ error })
            return res.status(201).json({message: 'Post created!'});
        });
    } else {
        const post = {
            ...req.body,
            likes: 0,
            dislikes: 0,
            usersLike: '[]',
            usersDislike: '[]'
        }
        sql.query('INSERT INTO post SET ?', post, (error, result) => {
            if(error) return res.status(400).json({ error });
            return res.status(201).json({message: 'Post created!'});
        });
    }
};

//Modify post, retrieve new values from request and replace the old ones, if there is a file attached, it went through the multer middleware, so we can set the new imageUrl
exports.modifyPost = (req, res, next) => {
    //If the image of the post is modified, the request contain an image file, and need to be treated differently from an image-less request
    if(req.file) {
        //First we need to find the post from its id
        sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
            if(error) return res.status(500).json({ error });
            //Then we need to get the name of the file related to the post in order to delete it from the directory
            const filename = result[0].imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                //Once the original image is deleted, we create a new object with the imageUrl of the image attached in the request
                const postObject = {
                    //When there is a file, the request body looks like: body: formData.append('image', image-file), .append('json', json-of-an-object)
                    ...JSON.parse(req.body.json),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                }
                //We finally update the post with the new object that has the new data
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

//Delete post from database, and when there is a file linked to the post, it is deleted from the related directory with fs.unlink
exports.deletePost = (req, res, next) => {
    sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
        if(error) return res.status(500).json({ error });
        //A post can either have a image attached to it or not, and both situation need to be treated differently
        if(result[0].imageUrl) {
            //If the post has an image attached to it, we need to find the name of the file, deleted the image from the directory, then delete the post itslef
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


//Update the post in the database to increase or decrease the count of like/dislike and modify the array of user ID which liked/disliked the post
exports.likePost = (req, res, next) => {
    sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
        if(error) return res.status(400).json({ error });

        let likesList = [];
        let dislikesList = [];
        
        //usersLike and usersDislike are stored as an array stringified
        const likesListString = JSON.parse(result[0].usersLike);
        const dislikesListString = JSON.parse(result[0].usersDislike);

        //Both if conditions allows to keep likesList and dislikesList set as arrays, so we can use .push later
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
         * Verify if the user has liked or disliked the post, or not
         * @returns {Boolean | String}
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

        //req.body.like can be 1 (when user likes), -1(when they dislike), or 0(when they delete their like/dislike)
        //If the user liked and hasn't already liked or disliked, we update the number of likes, and the array of user ID which liked
        if(req.body.like === 1 && !hasTheUserAlreadyLikedOrDisliked()) {
            likesList.push(req.body.user_id);
            const postObject = {
                ...result[0],
                likes: result[0].likes + 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Post successfully liked!'});
            })
         //If the user disliked and hasn't already liked or disliked, we update the number of dislikes, and the array of user ID which disliked
        } else if(req.body.like === -1 && !hasTheUserAlreadyLikedOrDisliked()) {
            dislikesList.push(req.body.user_id);
            const postObject = {
                ...result[0],
                dislikes: result[0].dislikes + 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Post successfully disliked!'});
            })
        //If the user resets their like/dislike and has already liked, we update the number of likes, and the array of user ID which liked
        } else if(req.body.like === 0 & hasTheUserAlreadyLikedOrDisliked() === 'likes') {
            const index = likesList.indexOf(req.body.user_id);
            likesList.splice(index, 1);
            const postObject = {
                ...result[0],
                likes: result[0].likes - 1,
                usersLike: JSON.stringify(likesList)
            }
            sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Post successfully unliked!'});
            })
        //If the user resets their like/dislike and has already disliked, we update the number of dislikes, and the array of user ID which disliked
        } else if(req.body.like === 0 && hasTheUserAlreadyLikedOrDisliked() === 'dislikes') {
            const index = dislikesList.indexOf(req.body.user_id);
            dislikesList.splice(index, 1);
            const postObject = {
                ...result[0],
                dislikes: result[0].dislikes - 1,
                usersDislike: JSON.stringify(dislikesList)
            }
            sql.query(`UPDATE post SET ? WHERE id = ${req.params.id}`, postObject, (error, result) => {
                if(error) return res.status(400).json({ error });
                return res.status(200).json({message: 'Post successfully undisliked!'});
            })
        } else {
            return res.status(400).json({message: 'The user cannot like/dislike the post'});
        }
    })
};

//Return a specific post from its ID
exports.getOnePost = (req, res, next) => {
    sql.query(`SELECT * FROM post WHERE id = ${req.params.id}`, (error, result) => {
        if(error) return res.status(404).json({ error });
        return res.status(200).json(result);
    })
};

//Return all posts in descending order
exports.getAllPosts = (req, res, next) => {
    sql.query('SELECT * FROM post ORDER BY date DESC', (error, result) => {
        if(error) return res.status(400).json({ error });
        return res.status(200).json(result);
    })
};

//Return all comments in ascending order from a specific post from its id
exports.getAllCommentsFromPost = (req, res, next) => {
    sql.query(`SELECT * FROM comment WHERE post_id = ${req.params.id} ORDER BY date ASC`, (error, result) => {
        if(error) return res.status(500).json({ error });
        return res.status(200).json(result);
    })
};