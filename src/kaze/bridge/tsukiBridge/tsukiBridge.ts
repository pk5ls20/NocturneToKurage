import { dataBridge } from '@/kaze/bridge/bridge';
import { SpringReader } from '@/kaze/bridge/springReader/springReader';
import { protobufDecoder, ProtoTree } from '@/kaze/decoder/decoder';
import { Buffer } from 'buffer';
import { bufferToPrettyHex } from '@/kaze/decoder/utils';
import pako from 'pako';

interface extendDataType {
  head_len: number;
  seq: number;
  ret_code: number;
  extra: string;
  cmd: string;
  session_id: string;
  compress_type: number;
}

export class tsukiBridge extends dataBridge<number | string, string, extendDataType> {
  constructor() {
    super();
  }

  private pasteData(buffer: Buffer): [Buffer, extendDataType] {
    const reader = new SpringReader(buffer);
    const [head_len, seq, ret_code] = reader.readStruct('Iii');
    const extra = reader.readStringWithLength('u32');
    const cmd = reader.readStringWithLength('u32');
    const session_id = bufferToPrettyHex(Buffer.from(reader.readBytesWithLength('u32')));
    const compress_type = reader.readU32();
    reader.readBytesWithLength('u32', false);
    let data = reader.readBytesWithLength('u32', false);
    switch (compress_type) {
      case 0:
        break;
      case 1:
        data = pako.inflate(data);
        break;
      case 8:
        data = data.subarray(4);
        break;
      default:
        throw new Error('Unknown compress type');
    }
    // TODO: handle oicq body
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

  bake<EPAT = null>(
    data: [Buffer, EPAT?],
    decoder: protobufDecoder<true, number | string, string, never>
  ): [ProtoTree<number | string, string>, extendDataType] {
    const [bufferData, extraArgs] = data;
    const [rawData, ed] = this.pasteData(bufferData);
    const decodedData = Array.isArray(extraArgs) ? decoder.decode(rawData, ...extraArgs) : decoder.decode(rawData);
    return [decodedData, ed];
  }
}
