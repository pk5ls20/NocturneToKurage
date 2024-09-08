// ref: https://github.com/pawitp/protobuf-decoder
import { Buffer } from 'buffer';

export default class BufferReader {
  private readonly buffer: Buffer;
  offset: number;
  private savedOffset: number;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.offset = 0;
    this.savedOffset = 0;
  }

  private decodeVarint(buffer: Buffer, offset: number) {
    let res = BigInt(0);
    let shift = 0;
    let byte = 0;
    do {
      if (offset >= buffer.length) {
        throw new RangeError('Index out of bound decoding varint');
      }
      byte = buffer[offset++];
      const multiplier = BigInt(2) ** BigInt(shift);
      const thisByteValue = BigInt(byte & 0x7f) * multiplier;
      shift += 7;
      res += thisByteValue;
    } while (byte >= 0x80);
    return {
      value: res,
      length: shift / 7,
    };
  }

  readVarInt(): BigInt {
    const result = this.decodeVarint(this.buffer, this.offset);
    this.offset += result.length;
    return result.value;
  }

  readBuffer(length: number): Buffer {
    this.checkByte(length);
    const result = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return result;
  }

  // gRPC has some additional header - remove it
  trySkipGrpcHeader(): void {
    const backupOffset = this.offset;
    if (this.buffer[this.offset] === 0 && this.leftBytes() >= 5) {
      this.offset++;
      const length = this.buffer.readInt32BE(this.offset);
      this.offset += 4;
      if (length > this.leftBytes()) {
        // Something is wrong, revert
        this.offset = backupOffset;
      }
    }
  }

  leftBytes(): number {
    return this.buffer.length - this.offset;
  }

  checkByte(length: number): void {
    const bytesAvailable = this.leftBytes();
    if (length > bytesAvailable) {
      throw new Error(`Not enough bytes left. Requested: ${length}, left: ${bytesAvailable}`);
    }
  }

  checkpoint(): void {
    this.savedOffset = this.offset;
  }

  resetToCheckpoint(): void {
    this.offset = this.savedOffset;
  }
}
