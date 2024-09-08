<template>
  <v-dialog v-model="store.isSettingDialogShow" min-width="600" class="w-50">
    <v-card prepend-icon="md:settings" title="Settings">
      <v-divider></v-divider>
      <v-empty-state title="Developing"></v-empty-state>
      <template v-slot:actions>
        <v-btn text="cancel" @click="store.isSettingDialogShow = false"></v-btn>
        <v-btn text="save" @click="store.isSettingDialogShow = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useMainPageStore } from '@/states/mainPageState';

const store = useMainPageStore();
</script>
