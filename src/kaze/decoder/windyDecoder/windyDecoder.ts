import * as protobuf from 'protobufjs';
import { Ref, ref, watch } from 'vue';
import { DecodeResult, protobufDecoder } from '@/kaze/decoder/decoder';
import { FileInputConfig } from '@/kaze/config/config';

type protoFileMap = Map<string, string>;

export class windyDecoder<SM extends boolean = true> extends protobufDecoder<SM, string, string, protobuf.Message<{}>> {
  private readonly protoFileMap: protoFileMap;
  private readonly fileRef: Ref<File[]>;

  constructor(simpleMode: SM, protoFileMap?: protoFileMap) {
    super(simpleMode);
    this.fileRef = ref([]);
    this.protoFileMap = protoFileMap ?? new Map<string, string>();
    this.configs = [new FileInputConfig('Upload Protobuf files...', this.fileRef, 'Protobuf files')];

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
