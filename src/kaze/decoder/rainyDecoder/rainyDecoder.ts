// ref: https://github.com/pawitp/protobuf-decoder
import { Buffer } from 'buffer';
import BufferReader from './bufferReader';
import { bufferToPrettyHex } from '@/kaze/decoder/utils';
import { DecodeResult, protobufDecoder, ProtoTree } from '@/kaze/decoder/decoder';

enum DataType {
  // standard protobuf wire types https://protobuf.dev/programming-guides/encoding/#structure
  VARINT = 0,
  FIXED64 = 1,
  LENDELIM = 2,
  FIXED32 = 5,
  // not standard wire types, only for initial flag
  STRING = 100,
  BYTES = 101,
  STRING_OR_BYTES = 102,
}

type ProtoValue<T> = string | Buffer | T[];

interface ProtoField {
  byteRange: [number, number];
  index: number;
  type: DataType;
  value: ProtoValue<ProtoField>;
}

interface ComplexDecodeResult {
  fields: ProtoField[];
  leftOver: Buffer;
}

type SimpleDecodeResultT = ProtoTree<number, string | Buffer | ComplexDecodeResult>;

// https://protobuf.dev/programming-guides/encoding/#cheat-sheet
export class rainyDecoder<SM extends boolean = true> extends protobufDecoder<SM, number, string, ComplexDecodeResult> {
  constructor(simpleMode: SM) {
    super(simpleMode);
  }
  private decodeProto(buffer: Buffer): ComplexDecodeResult {
    const reader = new BufferReader(buffer);
    const parts: ProtoField[] = [];
    reader.trySkipGrpcHeader();
    try {
      while (reader.leftBytes() > 0) {
        reader.checkpoint();
        const originalOffset = reader.offset;
        const indexType = parseInt(reader.readVarInt().toString());
        const type = indexType & 0b111; // wire_type
        const index = indexType >> 3; // field_number
        let value: string | Buffer;
        if (type === DataType.VARINT) {
          value = reader.readVarInt().toString();
        } else if (type === DataType.LENDELIM) {
          const length = parseInt(reader.readVarInt().toString());
          value = reader.readBuffer(length);
        } else if (type === DataType.FIXED32) {
          value = reader.readBuffer(4);
        } else if (type === DataType.FIXED64) {
          value = reader.readBuffer(8);
        } else {
          console.error('Unknown type: ' + type);
          reader.resetToCheckpoint();
          break;
        }
        parts.push({
          byteRange: [originalOffset, reader.offset] as [number, number],
          index,
          type,
          value,
        });
      }
    } catch (err) {
      console.error(err);
      reader.resetToCheckpoint();
    }
    return {
      fields: parts,
      leftOver: reader.readBuffer(reader.leftBytes()),
    };
  }

  private simpleResHelper(res: SimpleDecodeResultT, k: number, v: string | Buffer | ComplexDecodeResult) {
    res[k] = Array.isArray(res[k])
      ? (res[k] as (string | Buffer | ComplexDecodeResult)[]).concat(v)
      : res[k]
        ? [res[k], v]
        : v;
  }

  private bakeProto(buffer: Buffer): DecodeResult<SM, number, string, ComplexDecodeResult> {
    const result = this.decodeProto(buffer);
    const simpleResult: SimpleDecodeResultT = {};
    for (const part of result.fields) {
      if (part.type === DataType.LENDELIM) {
        const decoded = this.decodeProto(part.value as Buffer);
        if (part.value instanceof Buffer && part.value.length > 0 && decoded.leftOver.length === 0) {
          if (this.simpleMode) {
            this.simpleResHelper(simpleResult, part.index, this.bakeProto(part.value as Buffer) as ComplexDecodeResult);
          } else {
            part.value = (this.bakeProto(part.value as Buffer) as ComplexDecodeResult).fields;
          }
        } else {
          if (this.simpleMode) {
            const [, value] = this.decodeStringOrBytes(part.value as Buffer);
            this.simpleResHelper(simpleResult, part.index, value);
          } else {
            [part.type, part.value] = this.decodeStringOrBytes(part.value as Buffer);
          }
        }
      } else if (this.simpleMode) {
        this.simpleResHelper(simpleResult, part.index, part.value as string);
      }
    }
    return (this.simpleMode ? simpleResult : result) as DecodeResult<SM, number, string, ComplexDecodeResult>;
  }

  decode(buffer: Buffer): DecodeResult<SM, number, string, ComplexDecodeResult> {
    return this.bakeProto(buffer);
  }

  private decodeStringOrBytes(value: Buffer): [DataType, string] {
    if (!value.length) {
      return [DataType.STRING_OR_BYTES, ''];
    }
    const td = new TextDecoder('utf-8', { fatal: true });
    try {
      return [DataType.STRING, td.decode(value)];
    } catch (e) {
      return [DataType.BYTES, bufferToPrettyHex(value)];
    }
  }
}

export const typeToString = (type: DataType, subType: DataType) => {
  switch (type) {
    case DataType.VARINT:
      return 'varint';
    case DataType.LENDELIM:
      return subType || 'len_delim';
    case DataType.FIXED32:
      return 'fixed32';
    case DataType.FIXED64:
      return 'fixed64';
    case DataType.STRING:
      return 'string';
    case DataType.BYTES:
      return 'bytes';
    case DataType.STRING_OR_BYTES:
      return 'string|bytes';
    default:
      return 'unknown';
  }
};
