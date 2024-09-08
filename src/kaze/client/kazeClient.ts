import { Ref, ref } from 'vue';
import { configBase, MultiSelectConfig, TextInputConfig } from '@/kaze/config/config';
import { bridgeContainer } from '@/kaze/bridge';
import { decoderContainer } from '@/kaze/decoder';
import { dataBridge } from '@/kaze/bridge/bridge';
import { kazeContainer } from '@/kaze/kazeContainer';
import { tsukiBridge } from '@/kaze/bridge/tsukiBridge/tsukiBridge';
import { rainyDecoder } from '@/kaze/decoder/rainyDecoder/rainyDecoder';
import { windyDecoder } from '@/kaze/decoder/windyDecoder/windyDecoder';
import { protobufDecoder } from '@/kaze/decoder/decoder';

export class kazeClient extends configBase {
  readonly clientName: Ref<string>;
  readonly bridge: bridgeContainer;
  readonly decoder: decoderContainer;
  readonly clientAddress: Ref<string>;

  constructor() {
    super();
    console.log('kazeClient init!!!');
    // TODO: auto import
    this.clientName = ref('New Client');
    this.bridge = new kazeContainer<string, dataBridge<number | string, string, any>>(
      new Map<string, dataBridge<string | number, string, any>>([['tsukiBridge', new tsukiBridge()]])
    );
    this.decoder = new kazeContainer<string, protobufDecoder<true, number | string, string, never>>(
      new Map<string, any>([
        ['rainyDecoder', new rainyDecoder(false)],
        ['windyDecoder', new windyDecoder(false)],
      ])
    );
    this.clientAddress = ref('');
    this.configs = [
      new TextInputConfig('', this.clientName, 'Client Name'),
      new TextInputConfig('', this.clientAddress, 'Websocket address'),
      new MultiSelectConfig(this.bridge.keys(), [ref(true)], 'Bridge', this.bridge.values(), true),
      new MultiSelectConfig(this.decoder.keys(), [ref(true), ref(true)], 'Decoder', this.decoder.values(), false),
    ];
  }
}
