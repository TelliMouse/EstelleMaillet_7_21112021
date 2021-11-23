const Post = (post) => {
    this.title = post.title,
    this.user_id = post.user_id,
    this.text = post.text, //can be null
    this.imageUrl = post.imageUrl, //can be null
    this.imageAlt = post.imageAlt,  //can be null
    this.likes = post.likes,
    this.dislikes = post.dislikes,
    this.usersLike = post.usersLike,
    this.usersDislike = post.usersDislike,
    this.date = post.date
};

module.exports = Post;