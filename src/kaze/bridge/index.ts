import { kazeContainer } from '@/kaze/kazeContainer';
import { dataBridge } from '@/kaze/bridge/bridge';
import { tsukiBridge } from '@/kaze/bridge/tsukiBridge/tsukiBridge';

export type bridgeType = (typeof bridgeList)[keyof typeof bridgeList];

export const bridgeList = {
  tsukiBridge: tsukiBridge,
};

export type bridgeContainer = kazeContainer<string, dataBridge<number | string, string, any>>;
