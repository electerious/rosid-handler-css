const fs = require('node:fs').promises
const postcss = require('./postcss.js')

/**
 * Add vendor prefixes and minify CSS.
 *
 * @public
 * @param {string} filePath - Absolute path to file.
 * @param {?object} options - Options.
 * @returns {Promise<string>} Vendor prefixed and minified CSS.
 */
module.exports = async function (filePath, options = {}) {
  if (typeof filePath !== 'string') throw new Error(`'filePath' must be a string`)
  if (typeof options !== 'object') throw new Error(`'opts' must be undefined or an object`)

  options = Object.assign(
    {
      optimize: false,
    },
    options,
  )

  const output = await fs.readFile(filePath, 'utf8')

  return postcss(filePath, output, options)
}

/**
 * Tell Rosid with which file extension it should load the file.
 *
 * @public
 * @param {?object} options - Options.
 * @returns {string} File extension.
 */
module.exports.in = function (options) {
  return options != null && options.in != null ? options.in : '.css'
}

/**
 * Tell Rosid with which file extension it should save the file.
 *
 * @public
 * @param {?object} options - Options.
 * @returns {string} File extension.
 */
module.exports.out = function (options) {
  return options != null && options.out != null ? options.out : '.css'
}

/**
 * Attach an array to the function, which contains a list of
 * file patterns used by the handler. The array will be used by Rosid for caching purposes.
 *
 * @public
 */
module.exports.cache = ['**/*.css']
