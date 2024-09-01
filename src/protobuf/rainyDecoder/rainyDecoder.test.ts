import { expect, test } from 'vitest'
import * as decoder from './rainyDecoder'

test('decodeProto1', () => {
  const decoded = decoder.decodeProto(decoder.parseHexStrToBuffer('0000'))
  console.log(JSON.stringify(decoded))
  expect(decoded.fields.length).toEqual(1)
})

test('decodeProto2', () => {
  // NTV2RichMediaReq
  const decoded = decoder.decodeProto(decoder.parseHexStrToBuffer('0a270a04087b100a121ba80601b00602c00c03ca0c09080112055573657241d20c0308d7081a02080112490a330a2f088008120568617368311a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000'))
  console.log(JSON.stringify(decoded))
  expect(decoded.fields.length).toEqual(2)
})

test('decodeProto3', () => {
  // NTV2RichMediaReq
  const decoded = decoder.recursiveDecodeProto(decoder.parseHexStrToBuffer('0a270a04087b100a121ba80601b00602c00c03ca0c09080112055573657241d20c0308d7081a02080112490a330a2f088008120568617368311a0473686131220966696c65412e6a70672a08080110011800200030800f38b8084064480110011001180020b1d1f9d60328013202500a38644000'))
  console.log(JSON.stringify(decoded))
  expect(decoded.fields.length).toEqual(2)
})
