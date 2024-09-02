import { protobufDecoder, ProtoTree } from '@/protobuf/decoder';
import { Buffer } from 'buffer';

export abstract class dataBridge<PTK extends string | number | symbol, PTV, EDT, EPAT> {
  public abstract bake(
    data: [Buffer, EPAT?],
    decoder: protobufDecoder<true, PTK, PTV, never>
  ): [ProtoTree<PTK, PTV>, EDT];
}
