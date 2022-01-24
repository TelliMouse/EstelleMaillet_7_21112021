import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
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
