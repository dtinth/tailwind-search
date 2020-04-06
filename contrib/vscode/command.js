const fs = require('fs')
const tailwindCssClassSearch = require('../..')

exports.execute = async (args) => {
  const vscode = args.require('vscode')
  let qp = global.dtinthTailwindSearchQuickPick
  if (!qp) {
    const css = fs.readFileSync(
      require.resolve('tailwindcss/dist/tailwind.css'),
    )
    qp = vscode.window.createQuickPick()
    qp.matchOnDetail = true
    qp.sortByLabel = false
    const searchIndexPromise = tailwindCssClassSearch(css)
    qp.onDidAccept(() => {
      const className = qp.selectedItems[0].label
      qp.hide()
      qp.value = ''
      vscode.window.activeTextEditor.insertSnippet(
        new vscode.SnippetString(className),
      )
    })
    qp.onDidChangeValue((text) => {
      searchIndexPromise.then((searchIndex) => {
        qp.items = searchIndex.search(text).map(({ className, results }) => ({
          label: className,
          detail: results.map((r) => r.css).join(' '),
        }))
      })
    })
    global.dtinthTailwindSearchQuickPick = qp
  }
  qp.show()
}
