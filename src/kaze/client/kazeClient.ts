import { DefineComponent, Ref, ref } from 'vue';
import { MultiSelectComponent, TextInputComponent } from '@/components/dynamic/basicComponents';
import { bridgeContainer } from '@/kaze/bridge';
import { decoderContainer } from '@/kaze/decoder';
import { dataBridge } from '@/kaze/bridge/bridge';
import { kazeContainer } from '@/kaze/kazeContainer';
import { tsukiBridge } from '@/kaze/bridge/tsukiBridge/tsukiBridge';
import { rainyDecoder } from '@/kaze/decoder/rainyDecoder/rainyDecoder';
import { windyDecoder } from '@/kaze/decoder/windyDecoder/windyDecoder';
import { protobufDecoder } from '@/kaze/decoder/decoder';
import {
  dyComponent,
  dyComponentsTreeBase,
  rendererComponents,
  rendererHelper,
  rendererType,
} from '@/components/dynamic/dyComponent';

@rendererComponents(['config'])
export class kazeClient extends dyComponentsTreeBase implements rendererType<['config']> {
  readonly clientName: Ref<string>;
  readonly bridge: bridgeContainer;
  readonly decoder: decoderContainer;
  readonly clientAddress: Ref<string>;

  configComponents!: dyComponent<unknown, unknown, boolean, unknown>[];
  configRender!: (depth?: number, isRender?: Ref<boolean>) => DefineComponent[];
  _rd_config!: rendererHelper;
  isconfigRendered!: Ref<boolean>;

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
    this._rd_config = this._rd_config || this.constructor.prototype._rd_config;
    this.configRender = this.configRender || this.constructor.prototype.configRender;
    this.isconfigRendered = this.isconfigRendered || this.constructor.prototype.isconfigRendered;
    this.configComponents = [
      new TextInputComponent('', this.clientName, this._rd_config, 'Client Name'),
      new TextInputComponent('', this.clientAddress, this._rd_config, 'Websocket address'),
      new MultiSelectComponent(this.bridge.keys(), [ref(true)], this._rd_config, 'Bridge', this.bridge.values(), {
        disable: true,
      }),
      new MultiSelectComponent(
        this.decoder.keys(),
        [ref(true), ref(true)],
        this._rd_config,
        'Decoder',
        this.decoder.values(),
        {
          disable: false,
        }
      ),
    ];
  }
}
