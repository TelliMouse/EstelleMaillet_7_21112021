const Comment = (comment) => {
    this.user_id = comment.user_id,
    this.post_id = comment.post_id,
    this.text = comment.text,
    this.likes = comment.likes,
    this.dislikes = comment.dislikes,
    this.usersLike = comment.usersLike,
    this.usersDislike = comment.usersDislike,
    this.date = comment.date
}

module.exports = Comment;