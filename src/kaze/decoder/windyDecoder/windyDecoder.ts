import * as protobuf from 'protobufjs';
import { DefineComponent, Ref, ref, watch } from 'vue';
import { DecodeResult, protobufDecoder } from '@/kaze/decoder/decoder';
import { FileInputComponent } from '@/components/dynamic/basicComponents';
import { dyComponent, rendererComponents, rendererHelper, rendererType } from '@/components/dynamic/dyComponent';
import { Buffer } from 'buffer';

type protoFileMap = Map<string, string>;

@rendererComponents(['config'])
export class windyDecoder<SM extends boolean = true>
  extends protobufDecoder<SM, string, string, protobuf.Message<{}>>
  implements rendererType<['config']>
{
  private readonly protoFileMap: protoFileMap;
  private readonly fileRef: Ref<File[]>;

  configComponents!: dyComponent<unknown, unknown, boolean, unknown>[];
  configRender!: (depth?: number, isRender?: Ref<boolean>) => DefineComponent[];
  _rd_config!: rendererHelper;
  isconfigRendered!: Ref<boolean>;

  constructor(simpleMode: SM, protoFileMap?: protoFileMap) {
    super(simpleMode);
    this.fileRef = ref([]);
    this.protoFileMap = protoFileMap ?? new Map<string, string>();
    this._rd_config = this._rd_config || this.constructor.prototype._rd_config;
    this.configRender = this.configRender || this.constructor.prototype.configRender;
    this.isconfigRendered = this.isconfigRendered || this.constructor.prototype.isconfigRendered;
    this.configComponents = [
      new FileInputComponent('Upload Protobuf files...', this.fileRef, this._rd_config, 'Protobuf files', {
        accept: '.proto, .txt',
      }),
    ];

    watch(this.fileRef, async (newFiles, oldFiles) => {
      for (const file of newFiles) {
        if (!oldFiles.includes(file)) {
          const content = await this.readFileContent(file);
          this.addProtoFile(file.name, content);
        }
      }
      console.log(this.protoFileMap);
    });
  }

  async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  addProtoFile(protoFileName: string, protoContent: string): void {
    this.protoFileMap.set(protoFileName, protoContent);
  }

  _decode(buffer: Buffer, protoFile: string, protoType: string): protobuf.Message<{}> {
    const file = this.protoFileMap.get(protoFile);
    if (!file) {
      throw new Error(`Proto file ${protoFile} not found`);
    }
    const pastedProto = protobuf.parse(file);
    const typ = pastedProto.root.lookupType(protoType);
    return typ.decode(buffer);
  }

  override decode(
    buffer: Buffer,
    protoFile: string,
    protoType: string
  ): DecodeResult<SM, string, string, protobuf.Message<{}>> {
    const res = this._decode(buffer, protoFile, protoType);
    return (this.simpleMode ? res.toJSON() : res) as DecodeResult<SM, number, string, protobuf.Message<{}>>;
  }
}
