import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
import VueLogger from 'vuejs-logger';
import Storage from 'vue-ls';

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
  QTable,
  QTh,
  QTr,
  QTd,
  QSlideItem,
  Dialog,
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
    QTable,
    QTh,
    QTr,
    QTd,
    QSlideItem,
  },
  directives: {
    ClosePopup,
  },
  plugins: {
    Loading,
    Notify,
    Dialog,
  },
  lang: lang,
});

Vue.config.productionTip = false;
dayjs.locale('es'); // use loaded locale globally

const isProduction = process.env.NODE_ENV === 'production';

const loggerOptions = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true,
};
Vue.use(VueLogger, loggerOptions);

const storageOptions = {
  namespace: 'cj__', // key prefix
  name: 'storage', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
};

Vue.use(Storage, storageOptions);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
