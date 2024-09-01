<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar :elevation="2">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>NocturneToKurage</v-app-bar-title>
      </v-app-bar>
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
import FlowTable from "@/components/FlowTable.vue";
import DataDetailView from "@/components/DataDetailView.vue";
</script>
