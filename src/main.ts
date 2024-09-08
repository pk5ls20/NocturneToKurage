import '@mdi/font/css/materialdesignicons.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/styles';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { md } from 'vuetify/iconsets/md';
import { mdi } from 'vuetify/iconsets/mdi';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from '@/router';

const pinia = createPinia();
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
  icons: {
    sets: {
      md,
      mdi,
    },
  },
});
const app = createApp(App);
app.use(pinia).use(vuetify).use(router).mount('#app');
