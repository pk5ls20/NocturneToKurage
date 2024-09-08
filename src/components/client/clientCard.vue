<template>
  <v-card class="mx-auto" border flat>
    <v-card-text class="text-medium-emphasis pa-4">
      <v-row align="center">
        <v-col>
          <div class="text-h6 mb-4">
            <v-icon color="success" icon="md:check_circle" size="small" class="mr-2"></v-icon>
            {{ clientName }}
          </div>
        </v-col>
        <v-col class="mb-4 d-flex flex-nowrap justify-space-between align-center">
          <v-btn prepend-icon="md:arrow_upward" :ripple="false" variant="text"> {{ sendPktNum }}</v-btn>
          <v-btn prepend-icon="md:arrow_downward" :ripple="false" variant="text"> {{ recvPktNum }}</v-btn>
          <v-btn icon="md:settings" elevation="0" @click="openSettings(id)"></v-btn>
        </v-col>
      </v-row>
      <v-divider class="mb-3"></v-divider>
      <v-row>
        <v-col>
          <div class="text-subtitle-1 font-weight-bold">Address</div>
          <div class="text-body-2 text-medium-emphasis">{{ address }}</div>
        </v-col>
        <v-col>
          <div class="text-subtitle-1 font-weight-bold">Bridge</div>
          <div class="text-body-2 text-medium-emphasis">{{ bridgeName }}</div>
        </v-col>
        <v-col>
          <div class="text-subtitle-1 font-weight-bold">Decoder</div>
          <div class="text-body-2 text-medium-emphasis">{{ decoderName }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { clientInfo } from '@/client/client';

interface extClientInfo extends clientInfo {
  id: number;
}

const emit = defineEmits(['open-settings']);

const openSettings = (id: number) => {
  emit('open-settings', id);
};

defineProps<extClientInfo>();
</script>
