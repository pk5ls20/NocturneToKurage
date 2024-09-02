import {Buffer} from "buffer";

export const parseHexStrToBuffer = (input: string) => {
  const normalizedInput = input.replace(/\s/g, "");
  const normalizedHexInput = normalizedInput.replace(/0x/g, "").toLowerCase();
  return Buffer.from(normalizedHexInput, "hex");
}

export const bufferToPrettyHex = (b: Buffer) => [...b].map(c => c.toString(16).padStart(2, '0')).join('');
