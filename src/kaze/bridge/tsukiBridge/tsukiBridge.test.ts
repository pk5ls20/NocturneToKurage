import { expect, test } from 'vitest';
import { tsukiBridge } from '@/kaze/bridge/tsukiBridge/tsukiBridge';
import { rainyDecoder } from '@/kaze/decoder/rainyDecoder/rainyDecoder';
import { windyDecoder } from '@/kaze/decoder/windyDecoder/windyDecoder';
import { NTV2RichMediaReqProto } from '@/kaze/decoder/windyDecoder/windyDecoder.test';

const exceptExtInfo = (compress_type: number) => {
  return {
    head_len: 108,
    seq: 2438194,
    ret_code: 0,
    extra: '114514',
    cmd: 'OidbSvcTrpcTcp.0x1145_14',
    session_id: '717771',
    compress_type: compress_type,
  };
};

const exceptRainyDecoderContent = {
  '1': {
    '1': { '1': '123', '2': '10' },
    '2': { '101': '1', '102': '2', '200': '3', '201': { '1': '1', '2': '哦哦哦' }, '202': { '1': '1111' } },
    '3': { '1': '1' },
  },
  '2': {
    '1': {
      '1': {
        '1': '1024',
        '2': '玩原神玩的',
        '3': 'sha1',
        '4': 'fileA.jpg',
        '5': { '1': '1', '2': '1', '3': '0', '4': '0' },
        '6': '1920',
        '7': '1080',
        '8': '100',
        '9': '1',
      },
      '2': '1',
    },
    '2': '1',
    '3': '0',
    '4': '987654321',
    '5': '1',
    '6': { '10': '10' },
    '7': '100',
    '8': '0',
  },
};

const exceptWindyDecoderContent = {
  ReqHead: {
    Common: { RequestId: 123, Command: 10 },
    Scene: {
      RequestType: 1,
      BusinessType: 2,
      SceneType: 3,
      C2C: { AccountType: 1, TargetUid: '哦哦哦' },
      Group: { GroupUin: 1111 },
    },
    Client: { AgentType: 1 },
  },
  Upload: {
    UploadInfo: [
      {
        FileInfo: {
          FileSize: 1024,
          FileHash: '玩原神玩的',
          FileSha1: 'sha1',
          FileName: 'fileA.jpg',
          Type: { Type: 1, PicFormat: 1, VideoFormat: 0, VoiceFormat: 0 },
          Width: 1920,
          Height: 1080,
          Time: 100,
          Original: 1,
        },
        SubFileType: 1,
      },
    ],
    TryFastUploadCompleted: true,
    SrvSendMsg: false,
    ClientRandomId: '987654321',
    CompatQMsgSceneType: 1,
    ExtBizInfo: { BusiType: 10 },
    ClientSeq: 100,
    NoNeedCompatMsg: false,
  },
};

const testDataWithCompress0 = Buffer.from(
  '0000006c00253432000000000000000a3131343531340000001c4f696462537663547270635463702e3078313134355f3134000000077177710000000000000000000000820a2b0a04087b100a121fa80601b00602c00c03ca0c0d08011209e593a6e593a6e593a6d20c0308d7081a02080112530a3d0a39088008120fe78ea9e58e9fe7a59ee78ea9e79a841a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000',
  'hex'
);

const testDataWithCompress1 = Buffer.from(
  '0000006c00253432000000000000000a3131343531340000001c4f696462537663547270635463702e3078313134355f313400000007717771000000010000000000000081789ce3d2e662e1a816e012925fc1c6b8818de9000ff3291e5e0e4621cea7939741d0251e668eeb1c524c40c1602e5b2e4b8e060e21fee77d2b9ff6cd7fbe741e90f17c568b144b7146a2a112675a664eaaa35e5641ba160707a300a3048302834103bfc50e0e87140f201f2cb2f1e2cf6bcc1a8c464c015c16290e0c00febb2622',
  'hex'
);

const testDataWithCompress8 = Buffer.from(
  '0000006c00253432000000000000000a3131343531340000001c4f696462537663547270635463702e3078313134355f313400000007717771000000080000000000000086000000000a2b0a04087b100a121fa80601b00602c00c03ca0c0d08011209e593a6e593a6e593a6d20c0308d7081a02080112530a3d0a39088008120fe78ea9e58e9fe7a59ee78ea9e79a841a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000',
  'hex'
);

const rainyDecoderMainTest = (data: Buffer, compress_type: number) => {
  const rd = new rainyDecoder(true);
  const bridge = new tsukiBridge();
  const [tree, ed] = bridge.bake([data], rd);
  expect(tree).deep.eq(exceptRainyDecoderContent);
  expect(ed).deep.eq(exceptExtInfo(compress_type));
};

const windyDecoderMainTest = (data: Buffer, compress_type: number) => {
  const rd = new windyDecoder(true);
  rd.addProtoFile('test1.proto', NTV2RichMediaReqProto);
  const bridge = new tsukiBridge();
  const [tree, ed] = bridge.bake<[string, string]>([data, ['test1.proto', 'NTV2RichMediaReq']], rd);
  expect(tree).deep.eq(exceptWindyDecoderContent);
  expect(ed).deep.eq(exceptExtInfo(compress_type));
};

test('tsukiBridge1', () => {
  rainyDecoderMainTest(testDataWithCompress0, 0);
  rainyDecoderMainTest(testDataWithCompress1, 1);
  rainyDecoderMainTest(testDataWithCompress8, 8);
});

test('tsukiBridge2', () => {
  windyDecoderMainTest(testDataWithCompress0, 0);
  windyDecoderMainTest(testDataWithCompress1, 1);
  windyDecoderMainTest(testDataWithCompress8, 8);
});
