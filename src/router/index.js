import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// fix：重复路径跳转报错
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

const router = new VueRouter({
  mode: 'hash',
  // base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
    },
  ],
});

export default router;
