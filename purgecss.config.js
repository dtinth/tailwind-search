// https://tailwindcss.com/docs/controlling-file-size#setting-up-purgecss
module.exports = {
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
}
