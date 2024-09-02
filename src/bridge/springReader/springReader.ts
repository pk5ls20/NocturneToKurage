type LENGTH_PREFIX = 'u8' | 'u16' | 'u32' | 'u64';

export class SpringReader {
  private buffer: DataView;
  private pos: number = 0;

  constructor(buffer: ArrayBuffer | ArrayBufferView) {
    if (buffer instanceof ArrayBuffer) {
      this.buffer = new DataView(buffer);
    } else if (buffer instanceof DataView || buffer instanceof Uint8Array) {
      this.buffer = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    } else {
      throw new Error('Invalid buffer type');
    }
  }

  get remain(): number {
    return this.buffer.byteLength - this.pos;
  }

  readU8(): number {
    const value = this.buffer.getUint8(this.pos);
    this.pos += 1;
    return value;
  }

  readU16(): number {
    const value = this.buffer.getUint16(this.pos, false); // Big endian
    this.pos += 2;
    return value;
  }

  readU32(): number {
    const value = this.buffer.getUint32(this.pos, false); // Big endian
    this.pos += 4;
    return value;
  }

  readU64(): BigInt {
    const value = this.buffer.getBigUint64(this.pos, false); // Big endian
    this.pos += 8;
    return value;
  }

  readI8(): number {
    const value = this.buffer.getInt8(this.pos);
    this.pos += 1;
    return value;
  }

  readI16(): number {
    const value = this.buffer.getInt16(this.pos, false); // Big endian
    this.pos += 2;
    return value;
  }

  readI32(): number {
    const value = this.buffer.getInt32(this.pos, false); // Big endian
    this.pos += 4;
    return value;
  }

  readI64(): BigInt {
    const value = this.buffer.getBigInt64(this.pos, false); // Big endian
    this.pos += 8;
    return value;
  }

  readStruct(format: string): Array<number> {
    const values: Array<number> = [];
    for (let i = 0; i < format.length; i++) {
      const f = format.charAt(i);
      if (f === 'I') {
        values.push(this.readU32());
      } else if (f === 'i') {
        values.push(this.readI32());
      }
    }
    return values;
  }

  readBytes(length: number): Uint8Array {
    const value = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + this.pos, Math.min(length, this.remain));
    this.pos += length;
    return value;
  }

  readString(length: number): string {
    const bytes = this.readBytes(length);
    return new TextDecoder('utf-8').decode(bytes);
  }

  readBytesWithLength(prefix: LENGTH_PREFIX, withPrefix: boolean = true): Uint8Array {
    let length: number;
    switch (prefix) {
      case 'u8': {
        length = this.readU8() - (withPrefix ? 1 : 0);
        break;
      }
      case 'u16': {
        length = this.readU16() - (withPrefix ? 2 : 0);
        break;
      }
      case 'u32': {
        length = this.readU32() - (withPrefix ? 4 : 0);
        break;
      }
      case 'u64': {
        length = Number(this.readU64()) - (withPrefix ? 8 : 0);
        break;
      }
    }
    return this.readBytes(length);
  }

  readStringWithLength(prefix: LENGTH_PREFIX, withPrefix: boolean = true): string {
    const bytes = this.readBytesWithLength(prefix, withPrefix);
    return new TextDecoder('utf-8').decode(bytes);
  }

  readTLV(): Record<number, Uint8Array> {
    const result: Record<number, Uint8Array> = {};
    const count = this.readU16();
    for (let i = 0; i < count; i++) {
      const tag = this.readU16();
      const length = this.readU16();
      result[tag] = this.readBytes(length);
    }
    return result;
  }
}
