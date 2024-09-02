import { DecodeResult, protobufDecoder } from '@/protobuf/decoder';
import * as protobuf from 'protobufjs';

type protoFileMap = Map<string, string>;

export class windyDecoder<SM extends boolean = true> extends protobufDecoder<SM, string, string, protobuf.Message<{}>> {
  private protoFileMap: protoFileMap;

  constructor(simpleMode: SM, protoFileMap?: protoFileMap) {
    super(simpleMode);
    this.protoFileMap = protoFileMap ?? new Map<string, string>();
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
