import { expect, test } from 'vitest';
import { Buffer } from 'buffer';
import { SpringReader } from '@/bridge/springReader/springReader';
import { bufferToPrettyHex } from '@/protobuf/utils';

test('springReader1', () => {
  const te = new TextEncoder();
  const reader = new SpringReader(
    Buffer.from(
      'ffffffffffffffffffffffffffffff0001bf52001d4b4244417a9f80800080000000800000000000000048656c6c6f2c20776f726c6421086578616d706c650011416e6f74686572206578616d706c6500030001000656616c7565310002000656616c7565320003000656616c756533',
      'hex'
    )
  );
  const u8_value = reader.readU8();
  const u16_value = reader.readU16();
  const u32_value = reader.readU32();
  const u64_value = reader.readU64();
  expect(u8_value).eq(255);
  expect(u16_value).eq(65535);
  expect(u32_value).eq(4294967295);
  expect(u64_value).eq(BigInt('18446744073709551615'));
  const struct_value = reader.readStruct('iiI');
  expect(struct_value).deep.equal([114514, 1919810, 1145141919]);
  const i8_value = reader.readI8();
  const i16_value = reader.readI16();
  const i32_value = reader.readI32();
  const i64_value = reader.readI64();
  expect(i8_value).eq(-128);
  expect(i16_value).eq(-32768);
  expect(i32_value).eq(-2147483648);
  expect(i64_value).eq(BigInt('-9223372036854775808'));
  const string_value = reader.readString('Hello, world!'.length);
  expect(string_value).eq('Hello, world!');
  const b8_value = reader.readBytesWithLength('u8', true);
  const b16_value = reader.readStringWithLength('u16', true);
  expect(b8_value).deep.equal(te.encode('example'));
  expect(b16_value).eq('Another example');
  const tlv = reader.readTLV();
  expect(tlv[1]).deep.equal(te.encode('Value1'));
  expect(tlv[2]).deep.equal(te.encode('Value2'));
  expect(tlv[3]).deep.equal(te.encode('Value3'));
});

test('springReader2', () => {
  const reader = new SpringReader(
    Buffer.from(
      '0000006c00253432000000000000000a3131343531340000001c4f696462537663547270635463702e3078313134355f3134000000077177710001bf5200000000000000820a2b0a04087b100a121fa80601b00602c00c03ca0c0d08011209e593a6e593a6e593a6d20c0308d7081a02080112530a3d0a39088008120fe78ea9e58e9fe7a59ee78ea9e79a841a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000',
      'hex'
    )
  );
  const [head_len, seq, ret_code] = reader.readStruct('Iii');
  expect(head_len).eq(108);
  expect(seq).eq(2438194);
  expect(ret_code).eq(0);

  const extra = reader.readStringWithLength('u32');
  const cmd = reader.readStringWithLength('u32');
  const session_id = reader.readBytesWithLength('u32');
  expect(extra).eq('114514');
  expect(cmd).eq('OidbSvcTrpcTcp.0x1145_14');
  expect(session_id).deep.equal(new Uint8Array(Buffer.from('qwq')));

  const compress_type = reader.readU32();
  expect(compress_type).eq(114514);
  reader.readBytesWithLength('u32', false);
  const data = reader.readBytesWithLength('u32', false);
  console.log('data', bufferToPrettyHex(Buffer.from(data)));
  expect(data).deep.equal(
    new Uint8Array(
      Buffer.from(
        '0a2b0a04087b100a121fa80601b00602c00c03ca0c0d08011209e593a6e593a6e593a6d20c0308d7081a02080112530a3d0a39088008120fe78ea9e58e9fe7a59ee78ea9e79a841a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000',
        'hex'
      )
    )
  );
});
