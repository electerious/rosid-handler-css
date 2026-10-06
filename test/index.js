const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const os = require('node:os')
const { randomUUID } = require('node:crypto')
const index = require('./../src/index.js')

const { FILE } = require('fsify')
const fsify = require('fsify').default({
  cwd: os.tmpdir(),
})

describe('index()', function () {
  it('should return an error when called without a filePath', async function () {
    await assert.rejects(index(), { message: `'filePath' must be a string` })
  })

  it('should return an error when called with invalid options', async function () {
    const structure = await fsify([
      {
        type: FILE,
        name: `${randomUUID()}.css`,
      },
    ])

    await assert.rejects(index(structure[0].name, ''), { message: `'opts' must be undefined or an object` })
  })

  it('should return an error when called with a fictive filePath', async function () {
    await assert.rejects(index(`${randomUUID()}.css`))
  })

  it('should load and transform CSS', async function () {
    const structure = await fsify([
      {
        type: FILE,
        name: `${randomUUID()}.css`,
        contents: '.test { color: black; }',
      },
    ])

    const result = await index(structure[0].name)

    assert.match(result, /\.test/)
    assert.match(result, /sourceMappingURL/)
  })

  it('should omit source maps when optimization is enabled', async function () {
    const structure = await fsify([
      {
        type: FILE,
        name: `${randomUUID()}.css`,
        contents: '.test { color: black; }',
      },
    ])

    const result = await index(structure[0].name, { optimize: true })

    assert.match(result, /\.test/)
    assert.doesNotMatch(result, /sourceMappingURL/)
  })

  describe('.in()', function () {
    it('should be a function', function () {
      assert.equal(typeof index.in, 'function')
    })

    it('should return a default extension', function () {
      assert.equal(index.in(), '.css')
    })

    it('should return a default extension when called with invalid options', function () {
      assert.equal(index.in(''), '.css')
    })

    it('should return a custom extension when called with options', function () {
      assert.equal(index.in({ in: '.custom' }), '.custom')
    })
  })

  describe('.out()', function () {
    it('should be a function', function () {
      assert.equal(typeof index.out, 'function')
    })

    it('should return a default extension', function () {
      assert.equal(index.out(), '.css')
    })

    it('should return a default extension when called with invalid options', function () {
      assert.equal(index.out(''), '.css')
    })

    it('should return a custom extension when called with options', function () {
      assert.equal(index.out({ out: '.min.css' }), '.min.css')
    })
  })

  describe('.cache', function () {
    it('should contain CSS files only', function () {
      assert.deepEqual(index.cache, ['**/*.css'])
    })
  })
})
