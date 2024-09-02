import { protobufDecoder, ProtoTree } from '@/protobuf/decoder';
import { Buffer } from 'buffer';

export abstract class dataBridge<PTK extends string | number | symbol, PTV, EDT> {
  public abstract bake<EPAT = null>(
    data: [Buffer, EPAT?],
    decoder: protobufDecoder<true, PTK, PTV, never>
  ): [ProtoTree<PTK, PTV>, EDT];
}
