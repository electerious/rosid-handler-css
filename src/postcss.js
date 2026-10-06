const postcss = require('postcss')
const postcssImport = require('postcss-import')
const postcssNesting = require('postcss-nesting')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

/**
 * Add vendor prefixes and minify CSS.
 *
 * @public
 * @param {string} filePath - Absolute path to file.
 * @param {string} string - CSS.
 * @param {object} options - Optional options for the task.
 * @returns {Promise<string>} Vendor prefixed and minified CSS.
 */
module.exports = async function (filePath, string, options) {
  // Dismiss sourceMap when output should be optimized
  const sourceMap = options.optimize !== true

  const result = await postcss([postcssImport(), postcssNesting(), autoprefixer({ remove: false }), cssnano()]).process(
    string,
    {
      from: filePath,
      to: filePath,
      map: sourceMap,
    },
  )

  return result.css
}
