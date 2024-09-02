import {expect, test} from "vitest";
import {windyDecoder} from "@/protobuf/windyDecoder/windyDecoder";
import {parseHexStrToBuffer} from "@/protobuf/utils";

// from https://github.com/LagrangeDev/LagrangeGo
export const ApplyUploadRespV3Proto = `
syntax = "proto3";

message ApplyUploadRespV3 {
  int32 RetCode = 10;
  string RetMsg = 20;
  int64 TotalSpace = 30;
  int64 UsedSpace = 40;
  int64 UploadedSize = 50;
  string UploadIp = 60;
  string UploadDomain = 70;
  uint32 UploadPort = 80;
  string Uuid = 90;
  bytes UploadKey = 100;
  bool BoolFileExist = 110;
  int32 PackSize = 120;
  repeated string UploadIpList = 130;
  int32 UploadHttpsPort = 140;
  string UploadHttpsDomain = 150;
  string UploadDns = 160;
  string UploadLanip = 170;
  string FileAddon = 200;
  bytes MediaPlatformUploadKey = 220;
}
`

// from https://github.com/LagrangeDev/LagrangeGo
export const NTV2RichMediaReqProto = `
syntax = "proto3";

option go_package = "github.com/LagrangeDev/LagrangeGo/client/packets/pb/service/oidb";

message NTV2RichMediaReq {
  MultiMediaReqHead ReqHead = 1;
  UploadReq Upload = 2;
  DownloadReq Download = 3;
  DownloadRKeyReq DownloadRKey = 4;
  DeleteReq Delete = 5;
  UploadCompletedReq UploadCompleted = 6;
  MsgInfoAuthReq MsgInfoAuth = 7;
  UploadKeyRenewalReq UploadKeyRenewal = 8;
  DownloadSafeReq DownloadSafe = 9;
  optional bytes Extension = 99;
}

message MultiMediaReqHead {
  CommonHead Common = 1;
  SceneInfo Scene = 2;
  ClientMeta Client = 3;
}

message CommonHead {
  uint32 RequestId = 1; // 1
  uint32 Command = 2; // 200
}

message SceneInfo {
  uint32 RequestType = 101; // 1
  uint32 BusinessType = 102; // 3
  uint32 SceneType = 200; // 1
  optional C2CUserInfo C2C = 201;
  optional NTGroupInfo Group = 202;
}

message C2CUserInfo {
  uint32 AccountType = 1; // 2
  string TargetUid = 2;
}

message NTGroupInfo {
  uint32 GroupUin = 1;
}

message ClientMeta {
  uint32 AgentType = 1; // 2
}

message DownloadReq {
  IndexNode  Node = 1;
  DownloadExt Download = 2;
}

message IndexNode {
  FileInfo Info = 1;
  string FileUuid = 2;
  uint32 StoreId = 3; // 0旧服务器 1为nt服务器
  uint32 UploadTime = 4; // 0
  uint32 Ttl = 5; // 0
  uint32 SubType = 6; // 0
}

message FileInfo {
  uint32 FileSize = 1; // 0
  string FileHash = 2;
  string FileSha1 = 3; // ""
  string FileName = 4;
  FileType Type = 5;
  uint32 Width = 6; // 0
  uint32 Height = 7;  // 0
  uint32 Time = 8; // 2
  uint32 Original = 9; // 0
}

message FileType {
  uint32 Type = 1; // 2
  uint32 PicFormat = 2; // 0
  uint32 VideoFormat = 3; // 0
  uint32 VoiceFormat = 4; // 1
}

message DownloadExt {
  PicDownloadExt Pic = 1;
  VideoDownloadExt Video = 2;
  PttDownloadExt Ptt = 3;
}

message VideoDownloadExt {
  uint32 BusiType = 1; // 0
  uint32 SceneType = 2; // 0
  uint32 SubBusiType = 3; // 0
}

message PicDownloadExt {

}

message PttDownloadExt {

}

message PicUrlExtInfo {
  string OriginalParameter = 1;
  string BigParameter = 2;
  string ThumbParameter = 3;
}

message VideoExtInfo {
  uint32 VideoCodecFormat = 1;
}

message MsgInfo {
  repeated MsgInfoBody MsgInfoBody = 1;
  ExtBizInfo ExtBizInfo = 2;
}

message MsgInfoBody {
  IndexNode Index = 1;
  PictureInfo Picture = 2;
  VideoInfo Video = 3;
  AudioInfo Audio = 4;
  bool FileExist = 5;
  bytes HashSum = 6;
}

message VideoInfo {

}

message AudioInfo {

}

message PictureInfo {
  string UrlPath = 1;
  PicUrlExtInfo Ext = 2;
  string Domain = 3;
}

message ExtBizInfo {
  PicExtBizInfo Pic = 1;
  VideoExtBizInfo Video = 2;
  PttExtBizInfo Ptt = 3;
  uint32 BusiType = 10;
}

message PttExtBizInfo {
  uint64 SrcUin = 1;
  uint32 PttScene = 2;
  uint32 PttType = 3;
  uint32 ChangeVoice = 4;
  bytes Waveform = 5;
  uint32 AutoConvertText = 6;
  bytes BytesReserve = 11;
  bytes BytesPbReserve = 12;
  bytes BytesGeneralFlags = 13;
}

message VideoExtBizInfo {
  uint32 FromScene = 1;
  uint32 ToScene = 2;
  bytes BytesPbReserve = 3;
}

message PicExtBizInfo {
  uint32 BizType = 1;
  string TextSummary = 2;
  bytes BytesPbReserveC2c = 11;
  bytes BytesPbReserveTroop = 12;
  uint32 FromScene = 1001;
  uint32 ToScene = 1002;
  uint32 OldFileId = 1003;
}

message DownloadSafeReq {
  IndexNode Index = 1;
}

message UploadKeyRenewalReq {
  string OldUKey = 1;
  uint32 SubType = 2;
}

message MsgInfoAuthReq {
  bytes Msg = 1;
  uint64 AuthTime = 2;
}

message UploadCompletedReq {
  bool SrvSendMsg = 1;
  uint64 ClientRandomId = 2;
  MsgInfo MsgInfo = 3;
  uint32 ClientSeq = 4;
}

message DeleteReq {
  repeated IndexNode Index = 1;
  bool NeedRecallMsg = 2;
  uint64 MsgSeq = 3;
  uint64 MsgRandom = 4;
  uint64 MsgTime = 5;
}

message DownloadRKeyReq {
  repeated int32 Types = 1;
}

message UploadInfo {
  FileInfo FileInfo = 1;
  uint32 SubFileType = 2;
}

message UploadReq {
  repeated UploadInfo UploadInfo = 1;
  bool TryFastUploadCompleted = 2;
  bool SrvSendMsg = 3;
  uint64 ClientRandomId = 4;
  uint32 CompatQMsgSceneType = 5;
  ExtBizInfo ExtBizInfo = 6;
  uint32 ClientSeq = 7;
  bool NoNeedCompatMsg = 8;
}
`

test('windyDecodeProto1', () => {
  const pMap = new Map<string, string>().set('test1.proto', ApplyUploadRespV3Proto)
  const decoded = new windyDecoder(true, pMap).decode(
    parseHexStrToBuffer('50d2fe06a2010a73696d706c6554657374f001e1e30bc002eaf3069003cb66e2030f3131342e3131342e3131342e313134b2040a676f6f676c652e636f6d800516d2052436376239393665372d343761392d346633322d383465352d373763326333336665616233a2060152f00600c00700920807312e312e312e31920807322e322e322e32e00800b2090a6769746875622e636f6d820a0a6769746875622e636f6dd20a07382e382e382e38c20c18e58e9fe69da5e4bda0e4b99fe78ea9e58e9fe7a59eefbc9fe20d00'),
    'test1.proto',
    'ApplyUploadRespV3')
  console.log("decodeProto1", JSON.stringify(decoded))
  expect(decoded).toEqual({"RetCode":114514,"RetMsg":"simpleTest","TotalSpace":"192993","UsedSpace":"113130","UploadedSize":"13131","UploadIp":"114.114.114.114","UploadDomain":"google.com","UploadPort":22,"Uuid":"67b996e7-47a9-4f32-84e5-77c2c33feab3","UploadKey":"Ug==","BoolFileExist":false,"PackSize":0,"UploadIpList":["1.1.1.1","2.2.2.2"],"UploadHttpsPort":0,"UploadHttpsDomain":"github.com","UploadDns":"github.com","UploadLanip":"8.8.8.8","FileAddon":"原来你也玩原神？","MediaPlatformUploadKey":""})
})

test('windyDecodeProto2', () => {
  const pMap = new Map<string, string>().set('test2.proto', NTV2RichMediaReqProto)
  const decoded = new windyDecoder(true, pMap).decode(
    parseHexStrToBuffer('0a2b0a04087b100a121fa80601b00602c00c03ca0c0d08011209e593a6e593a6e593a6d20c0308d7081a02080112530a3d0a39088008120fe78ea9e58e9fe7a59ee78ea9e79a841a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000'),
    'test2.proto',
    'NTV2RichMediaReq')
  console.log("decodeProto2", JSON.stringify(decoded))
  expect(decoded).toEqual({"ReqHead":{"Common":{"RequestId":123,"Command":10},"Scene":{"RequestType":1,"BusinessType":2,"SceneType":3,"C2C":{"AccountType":1,"TargetUid":"哦哦哦"},"Group":{"GroupUin":1111}},"Client":{"AgentType":1}},"Upload":{"UploadInfo":[{"FileInfo":{"FileSize":1024,"FileHash":"玩原神玩的","FileSha1":"sha1","FileName":"fileA.jpg","Type":{"Type":1,"PicFormat":1,"VideoFormat":0,"VoiceFormat":0},"Width":1920,"Height":1080,"Time":100,"Original":1},"SubFileType":1}],"TryFastUploadCompleted":true,"SrvSendMsg":false,"ClientRandomId":"987654321","CompatQMsgSceneType":1,"ExtBizInfo":{"BusiType":10},"ClientSeq":100,"NoNeedCompatMsg":false}})
})
