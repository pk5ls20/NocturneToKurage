<template>
  <v-app>
    <v-main>
      <v-app-bar :elevation="2" prominent>
        <v-app-bar-nav-icon icon="md:menu" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title @click="NocturneToKurage" style="cursor: pointer">NocturneToKurage</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="md:search" variant="text"></v-btn>
        <v-btn icon="md:settings" variant="text" @click="store.isSettingDialogShow = true"></v-btn>
        <v-btn icon="md:more_vert" variant="text"></v-btn>
      </v-app-bar>
      <setting-dialog></setting-dialog>
      <v-navigation-drawer v-model="drawer" temporary>
        <v-list>
          <v-list-item
            prepend-icon="md:text_snippet"
            title="Flow"
            value="flow"
            @click="router.push('/flow')"
          ></v-list-item>
          <v-list-item prepend-icon="md:dns" title="Client" value="home" @click="router.push('/client')"> </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMainPageStore } from '@/states/mainPageState';
import SettingDialog from '@/components/flow/settingDialog.vue';

const NocturneToKurage = () => {
  window.location.href = 'https://music.163.com/song?id=31421450';
};
const router = useRouter();
const store = useMainPageStore();
const drawer = ref(false);
</script>
