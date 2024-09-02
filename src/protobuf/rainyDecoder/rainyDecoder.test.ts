import { expect, test } from 'vitest'
import {rainyDecoder} from "@/protobuf/rainyDecoder/rainyDecoder";
import {parseHexStrToBuffer} from "@/protobuf/utils";

test('decodeProto1', () => {
  const decoded = new rainyDecoder(false).decode(parseHexStrToBuffer('0a 2b 0a 04 08 7b 10 0a 12 1f a8 06 01 b0 06 02 c0 0c 03 ca 0c 0d 08 01 12 09 e5 93 a6 e5 93 a6 e5 93 a6 d2 0c 03 08 d7 08 1a 02 08 01 12 53 0a 3d 0a 39 08 80 08 12 0f e7 8e a9 e5 8e 9f e7 a5 9e e7 8e a9 e7 9a 84 1a 04 73 68 61 31 22 09 66 69 6c 65 41 2e 6a 70 67 2a 08 08 01 10 01 18 00 20 00 30 80 0f 38 b8 08 40 64 48 01 10 01 10 01 18 00 20 b1 d1 f9 d6 03 28 01 32 02 50 0a 38 64 40 00'))
  console.log("decodeProto1", JSON.stringify(decoded))
  expect(decoded.fields.length).toEqual(2)
})

test('decodeProto2', () => {
  // ApplyUploadRespV3
  const decoded = new rainyDecoder(true).decode(parseHexStrToBuffer('50d2fe06a2010a73696d706c6554657374f001e1e30bc002eaf3069003cb66e2030f3131342e3131342e3131342e313134b2040a676f6f676c652e636f6d800516d2052436376239393665372d343761392d346633322d383465352d373763326333336665616233a2060152f00600c00700920807312e312e312e31920807322e322e322e32e00800b2090a6769746875622e636f6d820a0a6769746875622e636f6dd20a07382e382e382e38c20c18e58e9fe69da5e4bda0e4b99fe78ea9e58e9fe7a59eefbc9fe20d00'))
  console.log("decodeProto2", JSON.stringify(decoded))
  expect(decoded).toEqual({"10":"114514","20":"simpleTest","30":"192993","40":"113130","50":"13131","60":"114.114.114.114","70":"google.com","80":"22","90":"67b996e7-47a9-4f32-84e5-77c2c33feab3","100":"R","110":"0","120":"0","130":["1.1.1.1","2.2.2.2"],"140":"0","150":"github.com","160":"github.com","170":"8.8.8.8","200":"原来你也玩原神？","220":""})
})

test('decodeProto3', () => {
  // NTV2RichMediaReq
  const decoded = new rainyDecoder(true).decode(parseHexStrToBuffer('0a2b0a04087b100a121fa80601b00602c00c03ca0c0d08011209e593a6e593a6e593a6d20c0308d7081a02080112530a3d0a39088008120fe78ea9e58e9fe7a59ee78ea9e79a841a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000'))
  console.log("decodeProto3", JSON.stringify(decoded))
  expect(decoded).toEqual({"1":{"1":{"1":"123","2":"10"},"2":{"101":"1","102":"2","200":"3","201":{"1":"1","2":"哦哦哦"},"202":{"1":"1111"}},"3":{"1":"1"}},"2":{"1":{"1":{"1":"1024","2":"玩原神玩的","3":"sha1","4":"fileA.jpg","5":{"1":"1","2":"1","3":"0","4":"0"},"6":"1920","7":"1080","8":"100","9":"1"},"2":"1"},"2":"1","3":"0","4":"987654321","5":"1","6":{"10":"10"},"7":"100","8":"0"}})
})
