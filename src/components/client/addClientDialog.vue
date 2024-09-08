<template>
  <v-dialog v-model="store.isAddClientDialogShow" min-width="600" class="w-50">
    <v-card prepend-icon="md:add_circle" title="Add New Client">
      <v-divider></v-divider>
      <v-container>
        <div v-for="(config, index) in kcr" :key="index">
          <component :is="config" />
        </div>
      </v-container>
      <template v-slot:actions>
        <v-btn text="cancel" @click="store.isAddClientDialogShow = false"></v-btn>
        <v-btn text="save" @click="handleClickSave()"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { useMainPageStore } from '@/states/mainPageState';
import { kazeClient } from '@/kaze/client/kazeClient';
import { ClientManager } from '@/client/clientManager';
import { client } from '@/client/client';

const store = useMainPageStore();
let kc = new kazeClient();
const kcr = shallowRef(kc.render());

const handleClickSave = () => {
  store.isAddClientDialogShow = false;
  ClientManager.addClient(new client(kc));
  kc = new kazeClient();
  kcr.value = kc.render();
};
</script>
