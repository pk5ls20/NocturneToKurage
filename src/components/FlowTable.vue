<template>
  <v-main>
    <v-card
      flat
      class="overflow-y-auto"
    >
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>
      <v-data-table-virtual
        :headers="headers"
        :items="virtualBoats"
        :search="search"
        :key="virtualBoats.length"
        hover
        height="500"
        item-value="name"
        @click:row="handleRowClick"
      ></v-data-table-virtual>
    </v-card>
  </v-main>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';

interface OidbData {
  time: string;
  seq: number;
  cmd: string;
  data: string;
}

interface Header {
  title: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  key: string;
}

const search = ref('');

const headers = ref<Header[]>([
  { title: 'Time', align: 'start', key: 'time' },
  { title: 'Seq', align: 'start', key: 'seq' },
  { title: 'Cmd', align: 'start', key: 'cmd' },
  { title: 'Data (Hex)', align: 'start', key: 'data' },
]);

const data = ref<OidbData[]>([
  { time: '2024-09-01 19:34:00', seq: 1, cmd: "OidbSvcTrpcTcp.0xd1145_14", data: "114514" },
  { time: '2024-09-01 19:34:01', seq: 2, cmd: "OidbSvcTrpcTcp.0xd1919_81", data: "114514" },
]);

const virtualBoats = computed(() => {
  return [...Array(10000).keys()].map(i => {
    return {...data.value[i % data.value.length]};
  });
});

function handleRowClick(event: PointerEvent, raw: { index: number, item: ProxyHandler<OidbData> }) {
  console.log(JSON.stringify(raw));
  console.log(`Row clicked:`, event, raw);
}
</script>

<style scoped>

</style>
