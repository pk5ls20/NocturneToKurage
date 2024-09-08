import { defineStore } from 'pinia';

export const useMainPageStore = defineStore('mainPage', {
  state: () => stateData,
});

export const stateData = {
  isSettingDialogShow: false as boolean,
  isAddClientDialogShow: false as boolean,
  isClientSettingDialogShow: false as boolean,
  isClientSettingDialogShowIndex: -1 as number,
};
