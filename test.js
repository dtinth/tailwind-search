const assert = require('assert')

;(async function () {
  try {
    const tailwindCssClassSearch = require('.')
    const css = require('fs').readFileSync(
      require.resolve('tailwindcss/dist/tailwind.css'),
    )
    const out = await tailwindCssClassSearch(css)
    assert.equal(typeof out.search, 'function')
    const entries = out.search('font-size')
    assert(Array.isArray(entries))
    assert(entries.length > 0)
    assert.equal(entries[0].className, 'text-base')
    assert.equal(entries[0].results[0].css, 'font-size:1rem')
    console.log('ok')
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
})()
