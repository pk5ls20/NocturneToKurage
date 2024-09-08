import { createMemoryHistory, createRouter } from 'vue-router';
import flow from '@/views/flow.vue';
import client from '@/views/client.vue';

const routes = [
  { path: '/', redirect: '/flow' },
  { path: '/flow', component: flow },
  { path: '/client', component: client },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
