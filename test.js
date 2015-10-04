const extract = require('png-chunks-extract')
const encode = require('png-chunks-encode')
const test = require('tape')
const path = require('path')
const text = require('./')
const fs = require('fs')

test('png-chunk-text', function (t) {
  const buffer = fs.readFileSync(
    path.join(__dirname, 'test.png')
  )

  const chunks = extract(buffer)

  // Adds a new chunk before the IEND chunk
  chunks.splice(-1, 0, text.encode('Author', 'Lorem Ipsum'))

  // Re-encode the PNG with modified metadata, then try
  // and extract it again
  const encoded = encode(chunks)
  const decoded = extract(encoded)
  const textChunk = decoded[decoded.length - 2]

  t.equal(text.decode(textChunk.data).keyword, 'Author', 'keyword matched successfully')
  t.equal(text.decode(textChunk.data).text, 'Lorem Ipsum', 'text matched successfully')
  t.equal(text.decode(textChunk).keyword, 'Author', '"cutely" picks .data for you')
  t.equal(text.decode(textChunk).text, 'Lorem Ipsum', '"cutely" picks .data for you')
  t.end()
})
