<template>
  <v-container>
    <v-row align="center" class="mb-4">
      <v-col>
        <h1>Client List</h1>
      </v-col>
      <v-col class="text-end">
        <v-btn rounded="xl" size="large" prepend-icon="md:add_circle" @click="handleAddClientClick">Add Client</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" v-for="(client, index) in clientInfoList" :key="index">
        <client-card
          :address="client.address"
          :bridge-name="client.bridgeName"
          :client-name="client.clientName"
          :decoder-name="client.decoderName"
          :recv-pkt-num="client.recvPktNum"
          :send-pkt-num="client.sendPktNum"
          :status="client.status"
          :id="index"
          @open-settings="handleSettingsClick(index)"
        ></client-card>
      </v-col>
    </v-row>
    <add-client-dialog></add-client-dialog>
    <v-dialog v-model="store.isClientSettingDialogShow" min-width="600" class="w-50">
      <v-card prepend-icon="md:settings" title="Settings">
        <v-divider></v-divider>
        <v-container>
          <div v-for="(config, index) in render(store.isClientSettingDialogShowIndex)" :key="index">
            <component :is="config" />
          </div>
        </v-container>
        <template v-slot:actions>
          <v-btn text="cancel" @click="store.isClientSettingDialogShow = false"></v-btn>
          <v-btn text="save" @click="store.isClientSettingDialogShow = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, toRaw, watchEffect } from 'vue';
import ClientCard from '@/components/client/clientCard.vue';
import AddClientDialog from '@/components/client/addClientDialog.vue';
import { useMainPageStore } from '@/states/mainPageState';
import { clientInfo } from '@/client/client';
import { ClientManager } from '@/client/clientManager';

const store = useMainPageStore();
const clientInfoList = ref<clientInfo<false>[]>([]);

const handleAddClientClick = () => {
  store.isAddClientDialogShow = true;
};

const handleSettingsClick = (id: number) => {
  store.isClientSettingDialogShow = true;
  store.isClientSettingDialogShowIndex = id;
};

const render = (idx: number) => {
  const kc = toRaw(ClientManager.clients[idx]); // must be raw object, cannot be proxy object, why?
  return kc.kazeClient.configRender();
};

watchEffect(() => {
  clientInfoList.value = ClientManager.clients.map((client) => {
    return {
      ...client.info,
    };
  });
});
</script>
