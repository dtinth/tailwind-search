// @ts-check

;(function (root, factory) {
  // @ts-ignore
  if (typeof define === 'function' && define.amd) {
    define(['csstree', 'fuzzysort'], factory)
  } else if (typeof module === 'object' && module.exports) {
    // @ts-ignore
    module.exports = factory(require('csstree'), require('fuzzysort'))
  } else {
    // @ts-ignore
    root.tailwindCssClassSearch = factory(root.csstree, root.fuzzysort)
  }
})(typeof self !== 'undefined' ? self : this, function (csstree, fuzzysort) {
  return async function tailwindCssClassSearch(
    css,
    { reportStatus = async (text) => {} },
  ) {
    const setStatus = (status) => async (x) => {
      await reportStatus(status)
      return x
    }
    return Promise.resolve(css)
      .then(setStatus('Parsing CSS...'))
      .then((css) => {
        const ast = csstree.toPlainObject(csstree.parse(css))
        const items = []
        const walk = (tree, prefix) => {
          for (const child of tree.children) {
            if (child.type === 'Comment') {
              // skip
            } else if (child.type === 'Rule') {
              const selector = csstree.generate(child.prelude)
              const classes = []
              csstree.walk(child.prelude, {
                visit: 'ClassSelector',
                enter(node) {
                  classes.push(node.name)
                },
              })
              if (classes.length === 0) {
                // skip
              } else if (classes.length > 1) {
                console.log('Found more than 1 classes:', selector)
              } else if (child.block) {
                const declarations = child.block.children
                  .map((node) => {
                    if (node.type !== 'Declaration') {
                      console.warn('Non-declaration found', node)
                      return
                    }
                    return {
                      property: node.property,
                      value: csstree.generate(node.value),
                      important: node.important,
                    }
                  })
                  .filter((x) => x)
                if (declarations.length) {
                  const filteredSelector = selector.replace(
                    `.${classes[0]}`,
                    '&',
                  )
                  const add = filteredSelector === `&` ? [] : [filteredSelector]
                  const css = [...prefix, ...add].reduceRight((css, prefix) => {
                    return `${prefix} { ${css} }`
                  }, child.block.children.map((node) => csstree.generate(node)).join('; '))
                  items.push({
                    prefix: [...prefix, ...add],
                    className: classes[0].replace(/\\(.)/g, '$1'),
                    declarations,
                    css,
                  })
                } else {
                  console.log('No declaration found', child)
                }
              }
            } else if (child.type === 'Atrule') {
              const prelude = `@${child.name} ${csstree.generate(
                child.prelude,
              )}`
              if (child.block) {
                walk(child.block, [...prefix, prelude])
              }
            } else {
              console.log('Unhandled', child.type)
            }
          }
        }
        walk(ast, [])
        return items
      })
      .then(setStatus('Generating search index...'))
      .then((items) => {
        const entries = []
        const byClassName = new Map()
        for (const item of items) {
          const { prefix, className, css, declarations } = item
          let entry = byClassName.get(className)
          if (!entry) {
            entry = { className, results: [] }
            entries.push(entry)
            byClassName.set(className, entry)
          }
          entry.results.push({ css, prefix, declarations })
        }
        return entries
      })
      .then(setStatus('Preparing search index for blazing fast search...'))
      .then((entries) => {
        for (const entry of entries) {
          entry.classNamePrepared = fuzzysort.prepare(entry.className)
          entry.cssPrepared = fuzzysort.prepare(
            entry.results.map((r) => r.css).join(' '),
          )
        }
        return entries
      })
      .then((entries) => {
        const options = {
          keys: ['classNamePrepared', 'cssPrepared'],
          allowTypo: false,
          threshold: -10000,
        }
        function search(text) {
          return fuzzysort.go(text, entries, options).map((r) => r.obj)
        }

        // Trigger a first search...
        search(':')
        return { entries, search }
      })
      .then(setStatus('Ready'))
  }
})
