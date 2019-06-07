import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from './layouts/Default.vue';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Resources from './views/Resources.vue';
import NewEvent from './views/NewEvent.vue';
import Event from './views/Event.vue';
import TransactionForm from './views/TransactionForm.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
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
          path: '/event/:eventId',
          name: 'event',
          component: Event,
        },
        {
          path: '/event/:eventId/transactions',
          name: 'transactionList',
          component: Event,
        },
        {
          path: '/event/:eventId/transactions/newTransaction',
          name: 'newTransaction',
          component: TransactionForm,
        },
        {
          path: '/event/:eventId/transactions/:transactionId',
          name: 'editTransaction',
          component: TransactionForm,
          meta: { isEditTransaction: true },
        },
        { path: '*', redirect: { name: 'home' } },
      ],
    },
  ],
});
