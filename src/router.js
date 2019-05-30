import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from './layouts/Default.vue';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Resources from './views/Resources.vue';
import NewEvent from './views/NewEvent.vue';
import Event from './views/Event.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
        {
          path: '/about',
          name: 'about',
          component: About,
        },
        {
          path: '/resources',
          name: 'resources',
          component: Resources,
        },
        {
          path: '/newEvent',
          name: 'newEvent',
          component: NewEvent,
        },
        {
          path: '/event/:id',
          name: 'event',
          component: Event,
        },
      ],
    },
  ],
});
