import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/person/:id',
    name: 'PersonProfile',
    component: () => import('../views/PersonProfile.vue'),
    props: true,
  },
  {
    path: '/add',
    name: 'AddPerson',
    component: () => import('../views/AddPersonView.vue'),
  },
  {
    path: '/add/:linkTo/:relationType',
    name: 'AddRelative',
    component: () => import('../views/AddPersonView.vue'),
    props: true,
  },
  {
    path: '/edit/:id',
    name: 'EditPerson',
    component: () => import('../views/AddPersonView.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
