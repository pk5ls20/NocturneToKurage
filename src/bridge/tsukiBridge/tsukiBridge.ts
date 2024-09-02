import { dataBridge } from '@/bridge/bridge';
import { SpringReader } from '@/bridge/springReader/springReader';
import { protobufDecoder, ProtoTree } from '@/protobuf/decoder';
import { Buffer } from 'buffer';
import { bufferToPrettyHex } from '@/protobuf/utils';

interface extendDataType {
  head_len: number;
  seq: number;
  ret_code: number;
  extra: string;
  cmd: string;
  session_id: string;
  compress_type: number;
}

export class tsukiBridge<EPAT = null> extends dataBridge<number | string, string, extendDataType, EPAT> {
  constructor() {
    super();
  }

  private pasteData(buffer: Buffer): [Buffer, extendDataType] {
    const reader = new SpringReader(buffer);
    const [head_len, seq, ret_code] = reader.readStruct('Iii');
    const extra = reader.readStringWithLength('u32');
    const cmd = reader.readStringWithLength('u32');
    const session_id = bufferToPrettyHex(Buffer.from(reader.readBytesWithLength('u32')));
    const compress_type = reader.readU32(); // TODO: handle compress_type
    reader.readBytesWithLength('u32', false);
    const data = reader.readBytesWithLength('u32', false);
    return [
      Buffer.from(data),
      {
        head_len,
        seq,
        ret_code,
        extra,
        cmd,
        session_id,
        compress_type,
      },
    ];
  }

  bake(
    data: [Buffer, EPAT?],
    decoder: protobufDecoder<true, number | string, string, never>
  ): [ProtoTree<number | string, string>, extendDataType] {
    const [bufferData, extraArgs] = data;
    const [rawData, ed] = this.pasteData(bufferData);
    const decodedData = Array.isArray(extraArgs) ? decoder.decode(rawData, ...extraArgs) : decoder.decode(rawData);
    return [decodedData, ed];
  }
}
