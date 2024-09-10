import { kazeClient } from '@/kaze/client/kazeClient';
import { Ref, ref } from 'vue';

type MaybeRef<T, C> = C extends true ? Ref<T> : T;

export interface clientInfo<RT> {
  status: MaybeRef<connectionStatus, RT>;
  clientName: MaybeRef<string, RT>;
  sendPktNum: MaybeRef<number, RT>;
  recvPktNum: MaybeRef<number, RT>;
  address: MaybeRef<string, RT>;
  bridgeName: MaybeRef<string, RT>;
  decoderName: MaybeRef<string, RT>;
}

export type connectionStatus = 'connected' | 'disconnected';

export class client {
  kazeClient: kazeClient;
  private status: Ref<connectionStatus> = ref('disconnected');
  private sendPkt = ref(0);
  private recvPkt = ref(0);

  constructor(kc: kazeClient) {
    this.kazeClient = kc;
  }

  get info(): clientInfo<true> {
    return {
      status: this.status,
      clientName: this.kazeClient.clientName,
      sendPktNum: this.sendPkt,
      recvPktNum: this.recvPkt,
      address: this.kazeClient.clientAddress,
      bridgeName: ref(this.kazeClient.bridge.keys().join(', ')),
      decoderName: ref(this.kazeClient.decoder.keys().join(', ')),
    };
  }
}
