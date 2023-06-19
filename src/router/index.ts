// eslint-disable-next-line import/no-unresolved
import { createRouter, createWebHistory } from 'vue-router/auto'

const router = createRouter({
  history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
  console.log('router.beforeEach', to, from)
  if (to.name === 'Root' && !to.query.frozen) {
    next({ path: '/main' })

    return
  }
  next()
})

export default router
