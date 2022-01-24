import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Posts from '../views/Posts.vue'
import NewPost from '../views/NewPost.vue'
import Post from '../views/Post.vue'
import Test from '../views/Test.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/posts/:page',
    name: 'Posts',
    component: Posts
  },
  /*{
    path: '/posts?page=:page?',
    name: 'PostsPage',
    component: Posts
  },*/
  {
    path: '/newpost',
    name: 'NewPost',
    component: NewPost
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
