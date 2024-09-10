import { protobufDecoder, ProtoTree } from '@/kaze/decoder/decoder';
import { Buffer } from 'buffer';
import { dyComponentsTreeBase } from '@/components/dynamic/dyComponent';

export abstract class dataBridge<PTK extends string | number | symbol, PTV, EDT> extends dyComponentsTreeBase {
  protected constructor() {
    super();
  }
  public abstract bake<EPAT = null>(
    data: [Buffer, EPAT?],
    decoder: protobufDecoder<true, PTK, PTV, never>
  ): [ProtoTree<PTK, PTV>, EDT];
}
