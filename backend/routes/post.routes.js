const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.controller');
const multer = require ('../middleware/multer-config');
const auth = require('../middleware/auth');

router.post('/', /*auth,*/ multer, postCtrl.createPost);
router.delete('/:id', /*auth,*/ postCtrl.deletePost);
router.get('/:id', /*auth,*/ postCtrl.getOnePost);
router.put('/:id', /*auth,*/ multer, postCtrl.modifyPost);
router.post('/:id/like', /*auth,*/ postCtrl.likePost);
router.get('/', /*auth,*/ postCtrl.getAllPosts);
router.get('/:id/comments', /*auth,*/ postCtrl.getAllCommentsFromPost);

module.exports = router;