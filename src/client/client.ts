import { kazeClient } from '@/kaze/client/kazeClient';

export interface clientInfo {
  clientName: string;
  sendPktNum: number;
  recvPktNum: number;
  address: string;
  bridgeName: string;
  decoderName: string;
}

export class client {
  kazeClient: kazeClient;
  private sendPkt = 0;
  private recvPkt = 0;

  constructor(kc: kazeClient) {
    this.kazeClient = kc;
  }

  get info(): clientInfo {
    return {
      clientName: this.kazeClient.clientName as unknown as string,
      sendPktNum: this.sendPkt,
      recvPktNum: this.recvPkt,
      address: this.kazeClient.clientAddress as unknown as string,
      bridgeName: this.kazeClient.bridge.keys().join(', '),
      decoderName: this.kazeClient.decoder.keys().join(', '),
    };
  }
}
