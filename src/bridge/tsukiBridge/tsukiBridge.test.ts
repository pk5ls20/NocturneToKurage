import { expect, test } from 'vitest';
import { tsukiBridge } from '@/bridge/tsukiBridge/tsukiBridge';
import { rainyDecoder } from '@/protobuf/rainyDecoder/rainyDecoder';
import { windyDecoder } from '@/protobuf/windyDecoder/windyDecoder';
import { NTV2RichMediaReqProto } from '@/protobuf/windyDecoder/windyDecoder.test';

test('tsukiBridge1', () => {
  const data = Buffer.from(
    '0000006c00253432000000000000000a3131343531340000001c4f696462537663547270635463702e3078313134355f3134000000077177710001bf5200000000000000820a2b0a04087b100a121fa80601b00602c00c03ca0c0d08011209e593a6e593a6e593a6d20c0308d7081a02080112530a3d0a39088008120fe78ea9e58e9fe7a59ee78ea9e79a841a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000',
    'hex'
  );
  const rd = new rainyDecoder(true);
  const bridge = new tsukiBridge();
  const [tree, ed] = bridge.bake([data], rd);
  expect(tree).deep.eq({
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
  });
  expect(ed).deep.eq({
    head_len: 108,
    seq: 2438194,
    ret_code: 0,
    extra: '114514',
    cmd: 'OidbSvcTrpcTcp.0x1145_14',
    session_id: '717771',
    compress_type: 114514,
  });
});

test('tsukiBridge2', () => {
  const data = Buffer.from(
    '0000006c00253432000000000000000a3131343531340000001c4f696462537663547270635463702e3078313134355f3134000000077177710001bf5200000000000000820a2b0a04087b100a121fa80601b00602c00c03ca0c0d08011209e593a6e593a6e593a6d20c0308d7081a02080112530a3d0a39088008120fe78ea9e58e9fe7a59ee78ea9e79a841a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000',
    'hex'
  );
  const rd = new windyDecoder(true);
  rd.addProtoFile('test1.proto', NTV2RichMediaReqProto);
  const bridge = new tsukiBridge();
  const [tree, ed] = bridge.bake<[string, string]>([data, ['test1.proto', 'NTV2RichMediaReq']], rd);
  expect(tree).deep.eq({
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
  });
  expect(ed).deep.eq({
    head_len: 108,
    seq: 2438194,
    ret_code: 0,
    extra: '114514',
    cmd: 'OidbSvcTrpcTcp.0x1145_14',
    session_id: '717771',
    compress_type: 114514,
  });
});
