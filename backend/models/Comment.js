const Comment = (comment) => {
    this.userId = comment.userId,
    this.postId = comment.postId,
    this.text = comment.text,
    this.likes = comment.likes,
    this.dislikes = comment.dislikes,
    this.usersLike = comment.usersLike,
    this.usersDislike = comment.usersDislike
}

module.exports = Comment;