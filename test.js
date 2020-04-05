const assert = require('assert')

;(async function () {
  try {
    const tailwindCssClassSearch = require('.')
    const css = require('fs').readFileSync(
      require.resolve('tailwindcss/dist/tailwind.css'),
    )
    const out = await tailwindCssClassSearch(css)
    assert.equal(typeof out.search, 'function')
    const searchResults = out.search('font-size')
    assert(Array.isArray(searchResults))
    assert(searchResults.length > 0)
    assert.equal(searchResults[0].className, 'text-base')
    console.log('ok')
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
})()
