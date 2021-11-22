const Post = (post) => {
    this.title = post.title,
    this.userId = post.userId,
    this.text = post.text,
    this.imageUrl = post.imageUrl,
    this.imageAlt = post.imageAlt,
    this.likes = post.likes,
    this.dislikes = post.dislikes,
    this.usersLike = post.usersLike,
    this.usersDislike = post.usersDislike
};

module.exports = Post;