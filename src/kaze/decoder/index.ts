import { kazeContainer } from '@/kaze/kazeContainer';
import { protobufDecoder } from '@/kaze/decoder/decoder';
import { rainyDecoder } from '@/kaze/decoder/rainyDecoder/rainyDecoder';
import { windyDecoder } from '@/kaze/decoder/windyDecoder/windyDecoder';

export type decoderType = (typeof decoderList)[keyof typeof decoderList];

export const decoderList = {
  rainyDecoder: rainyDecoder,
  windyDecoder: windyDecoder,
};

export type decoderContainer = kazeContainer<string, protobufDecoder<true, number | string, string, never>>;
