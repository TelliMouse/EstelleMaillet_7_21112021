import { createStore } from 'vuex'

export default createStore({
  state: {
    numberOfPosts: this.getNumberOfPosts(),
    numberOfPages: this.getNumberOfPages()
  },
  mutations: {
  },
  actions: {
    getNumberOfPosts() {
      fetch('http://localhost:3000/api/posts')
      .then(res => {
        const result = JSON.parse(res.json());
        return result.length;
      })
      .catch(err => console.log('Error getNumberOfPosts', err))
    },
    getNumberOfPages() {
      const post = this.numberOfPosts;
      const modulo = post%10;
      if(modulo === 0) {
        return post/10;
      } else {
        const majPost = post + 10 - modulo
        return majPost/10;
      }
    }
  },
  modules: {
  }
})
