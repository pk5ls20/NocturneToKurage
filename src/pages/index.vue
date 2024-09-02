<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar :elevation="2" prominent>
        <v-app-bar-nav-icon icon="menu" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>NocturneToKurage</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="search" variant="text"></v-btn>
        <v-btn icon="settings" variant="text"></v-btn>
        <v-btn icon="more_vert" variant="text"></v-btn>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" temporary>
        <v-list :items="items" @click:select="console.log('click', $event)"></v-list>
      </v-navigation-drawer>
      <v-container fluid>
        <v-row>
          <v-col cols="8">
            <flow-table></flow-table>
          </v-col>
          <v-col cols="4">
            <data-detail-view></data-detail-view>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </v-responsive>
</template>

<script lang="ts" setup>
import FlowTable from '@/components/FlowTable.vue';
import DataDetailView from '@/components/DataDetailView.vue';

import { ref } from 'vue';

const drawer = ref(false);
const items = ref([
  {
    title: 'qwq',
    value: 'awa',
  },
]);
</script>
