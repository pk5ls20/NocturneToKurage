// ref: https://github.com/pawitp/protobuf-decoder
import {Buffer} from 'buffer'
import BufferReader from "./bufferReader";

export enum DataType {
  // standard protobuf wire types https://protobuf.dev/programming-guides/encoding/#structure
  VARINT = 0,
  FIXED64 = 1,
  LENDELIM = 2,
  FIXED32 = 5,
  // not standard wire types
  STRING = 100,
  BYTES = 101,
  STRING_OR_BYTES = 102,
}

interface ProtoField {
  byteRange: [number, number];
  index: number;
  type: DataType;
  value: string | Buffer | ProtoField[];
}

interface DecodeResult {
  fields: ProtoField[];
  leftOver: Buffer;
}

// https://protobuf.dev/programming-guides/encoding/#cheat-sheet
export function decodeProto(buffer: Buffer): DecodeResult {
  const reader = new BufferReader(buffer);
  const parts: ProtoField[] = [];
  reader.trySkipGrpcHeader();
  try {
    while (reader.leftBytes() > 0) {
      reader.checkpoint();
      const byteRange: [number, number] = [reader.offset, null];
      const indexType = parseInt(reader.readVarInt().toString());
      const type = indexType & 0b111; // wire_type
      const index = indexType >> 3;  // field_number
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
        console.error("Unknown type: " + type);
        reader.resetToCheckpoint();
        break;
      }
      byteRange[1] = reader.offset;
      parts.push({
        byteRange,
        index,
        type,
        value
      });
    }
  } catch (err) {
    console.error(err);
    reader.resetToCheckpoint();
  }
  return {
    fields: parts,
    leftOver: reader.readBuffer(reader.leftBytes())
  }
}

export function recursiveDecodeProto(buffer: Buffer): DecodeResult {
  const result = decodeProto(buffer);
  for (const part of result.fields) {
    if (part.type === DataType.LENDELIM) {
      const decoded = decodeProto(part.value as Buffer);
      if (part.value instanceof Buffer && part.value.length > 0 && decoded.leftOver.length === 0) {
        part.value = recursiveDecodeProto(part.value as Buffer).fields;
      } else {
        [part.type, part.value] = decodeStringOrBytes(part.value as Buffer);
      }
    }
  }
  return result;
}

export function decodeStringOrBytes(value: Buffer): [DataType, string] {
  if (!value.length) {
    return [DataType.STRING_OR_BYTES, ""];
  }
  const td = new TextDecoder("utf-8", {fatal: true});
  try {
    return [DataType.STRING, td.decode(value)];
  } catch (e) {
    return [DataType.BYTES, bufferToPrettyHex(value)];
  }
}

export const typeToString = (type: DataType, subType: DataType) => {
  switch (type) {
    case DataType.VARINT:
      return "varint";
    case DataType.LENDELIM:
      return subType || "len_delim";
    case DataType.FIXED32:
      return "fixed32";
    case DataType.FIXED64:
      return "fixed64";
    case DataType.STRING:
      return "string";
    case DataType.BYTES:
      return "bytes";
    case DataType.STRING_OR_BYTES:
      return "string|bytes";
    default:
      return "unknown";
  }
}

export const parseHexStrToBuffer = (input: string) => {
  const normalizedInput = input.replace(/\s/g, "");
  const normalizedHexInput = normalizedInput.replace(/0x/g, "").toLowerCase();
  return Buffer.from(normalizedHexInput, "hex");
}

export const bufferToPrettyHex = (b: Buffer) => [...b].map(c => c.toString(16).padStart(2, '0')).join(' ');
