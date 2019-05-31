import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import './styles/quasar.styl';
import lang from 'quasar/lang/es.js';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';
import {
  Quasar,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QForm,
  QInput,
  QSelect,
  QSeparator,
  QChip,
  QAvatar,
  Loading,
  Notify,
  QTabs,
  QTab,
  QRouteTab,
  QRadio,
  QCheckbox,
  QDate,
  QPopupProxy,
  ClosePopup,
} from 'quasar';

Vue.use(Quasar, {
  config: {
    notify: {
      position: 'top',
    },
  },
  components: {
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QForm,
    QInput,
    QSelect,
    QSeparator,
    QChip,
    QAvatar,
    QTabs,
    QTab,
    QRouteTab,
    QRadio,
    QCheckbox,
    QDate,
    QPopupProxy,
  },
  directives: {
    ClosePopup,
  },
  plugins: {
    Loading,
    Notify,
  },
  lang: lang,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
