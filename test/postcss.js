const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const os = require('node:os')
const { randomUUID } = require('node:crypto')
const postcss = require('./../src/postcss.js')

const { FILE } = require('fsify')
const fsify = require('fsify').default({
  cwd: os.tmpdir(),
})

describe('postcss()', function () {
  it('should return an error when called with incorrect CSS', async function () {
    const structure = await fsify([
      {
        type: FILE,
        name: `${randomUUID()}.css`,
        contents: 'test',
      },
    ])

    await assert.rejects(postcss(structure[0].name, structure[0].contents, { optimize: false }))
  })

  it('should return CSS with a source map when called with valid CSS', async function () {
    const structure = await fsify([
      {
        type: FILE,
        name: `${randomUUID()}.css`,
        contents: '.test { color: black; }',
      },
    ])

    const result = await postcss(structure[0].name, structure[0].contents, { optimize: false })

    assert.equal(typeof result, 'string')
    assert.match(result, /sourceMappingURL/)
  })

  it('should transform nested CSS', async function () {
    const structure = await fsify([
      {
        type: FILE,
        name: `${randomUUID()}.css`,
        contents: '.parent { & .child { color: red; } }',
      },
    ])

    const result = await postcss(structure[0].name, structure[0].contents, { optimize: true })

    assert.match(result, /\.parent \.child\{color:red\}/)
  })

  it('should inline imported CSS', async function () {
    const fileName = randomUUID()
    const importedFileName = `${fileName}-imported.css`
    const structure = await fsify([
      {
        type: FILE,
        name: `${fileName}.css`,
        contents: `@import "./${importedFileName}"; .main { color: black; }`,
      },
      {
        type: FILE,
        name: importedFileName,
        contents: '.imported { color: red; }',
      },
    ])

    const result = await postcss(structure[0].name, structure[0].contents, { optimize: true })

    assert.match(result, /\.imported\{color:red\}/)
    assert.match(result, /\.main\{color:#000\}/)
  })

  it('should return CSS without a source map when optimization is enabled', async function () {
    const structure = await fsify([
      {
        type: FILE,
        name: `${randomUUID()}.css`,
        contents: '.test { color: black; }',
      },
    ])

    const result = await postcss(structure[0].name, structure[0].contents, { optimize: true })

    assert.equal(typeof result, 'string')
    assert.doesNotMatch(result, /sourceMappingURL/)
  })
})
