export type ProtoTree<K extends string | number | symbol, V> = {
  [key in K]: V | V[] | ProtoTree<K, V> | ProtoTree<K, V[]>;
};

export type DecodeResult<
  SM extends boolean,
  SRKT extends string | number | symbol,
  SRVT extends unknown,
  CRT extends unknown,
> = SM extends true ? ProtoTree<SRKT, SRVT> : CRT;

export abstract class protobufDecoder<
  SM extends boolean,
  SRKT extends string | number | symbol,
  SRVT extends unknown,
  CRT extends unknown,
> {
  simpleMode: SM;

  constructor(simpleMode: SM) {
    this.simpleMode = simpleMode;
  }

  abstract decode(buffer: Buffer, protoFile?: string, protoType?: string): DecodeResult<SM, SRKT, SRVT, CRT>;
}
