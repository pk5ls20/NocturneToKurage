<template>
  <v-app>
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
</template>
<script setup lang="ts">
import DataDetailView from '@/components/flow/DataDetailView.vue';
import FlowTable from '@/components/flow/FlowTable.vue';
</script>
