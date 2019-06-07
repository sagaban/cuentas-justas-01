<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />
        <q-toolbar-title>
          {{ toolbarTitle }}
        </q-toolbar-title>
        <q-btn v-if="eventId" flat round dense icon="share" @click="shareEventDialog = true" />
        <!-- <q-btn v-if="eventId" flat round dense icon="edit" /> -->
        <q-btn v-if="eventId" flat round dense icon="delete" @click="deleteEvent" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Navegación</q-item-label>
        <q-item to="/" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Página principal</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/newEvent" exact>
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Nuevo Evento</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label header v-if="eventList.length">Eventos</q-item-label>
        <div v-for="event in eventList" :key="event.id">
          <q-item :to="`/event/${event.id}`" exact>
            <q-item-section avatar>
              <q-icon name="folder_open" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ event.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <q-item-label header>Links esenciales</q-item-label>
        <q-item to="/about" exact>
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sobre esta app</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/resources" exact>
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Recursos / Créditos</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.com/sagaban/cuentas-justas">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Repo de este proyecto</q-item-label>
            <q-item-label caption>github.com/sagaban/cuentas-justas</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.com/sagaban">
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Mi Twitter</q-item-label>
            <q-item-label caption>@sagaban</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog v-model="shareEventDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Compartí esta URL para acceder a este evento</div>
        </q-card-section>

        <q-card-section>
          <!-- <q-input autofocus :value="shareUrl" readonly type="textarea" /> -->
          <span> {{ shareUrl }} </span>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cerrar" v-close-popup />
          <q-btn flat label="Copiar" @click="copySahreUrl" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { getStoredEventList } from '@/api/localStorage';
import firebaseConfig from '../../firebase.config';
import { copyToClipboard } from '@/utils/general';
export default {
  name: 'LayoutDefault',
  created() {
    this.eventList = getStoredEventList();
  },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      eventList: [],
      shareEventDialog: false,
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
    eventId() {
      return this.$route.params.eventId;
    },
    toolbarTitle() {
      if (this.$store.state.eventName && this.eventId) {
        return this.$store.state.eventName;
      }
      return 'Cuentas Justas';
    },
    shareUrl() {
      return `https://${firebaseConfig.authDomain}/event/${this.eventId}`;
    },
  },
  watch: {
    isLoading(newValue) {
      if (newValue) {
        this.$q.loading.show();
      } else {
        this.$q.loading.hide();
      }
    },
    eventId() {
      this.eventList = getStoredEventList();
    },
  },
  methods: {
    copySahreUrl() {
      copyToClipboard(this.shareUrl);
      this.$q.notify({
        color: 'green',
        textColor: 'white',
        icon: 'done',
        message: 'URL copiada',
      });
      this.shareEventDialog = false;
    },
    deleteEvent() {
      this.$q
        .dialog({
          title: '¿Realmente deseás borrar este evento?',
          persistent: true,
          ok: {
            label: 'Borrar',
            color: 'red',
          },
          cancel: {
            label: 'Cancelar',
          },
        })
        .onOk(() => {
          this.$store.dispatch('DELETE_EVENT', this.eventId).then(() => {
            this.$router.push({ name: 'home' });
          });
        });
    },
  },
};
</script>

<style scoped></style>
