/**
 * This script is used to adjust the index.html file
 * so that the script tags have the correct src attribute.
 * Since we use the build generated by webpack to run e2e tests,
 * the script tags need to have the correct src attribute (with /).
 * But when we run the build in production, the script tags need to have the correct src attribute (without /).
 */

const fs = require('fs')
const cheerio = require('cheerio')

// Read the HTML file
const filePath = 'dist/index.html'
const htmlContent = fs.readFileSync(filePath, 'utf-8')

// Load the HTML content into Cheerio
const $c = cheerio.load(htmlContent)

// Iterate over script tags and update the src attribute
$c('script[defer="defer"]').each((index, element) => {
  const srcAttribute = $c(element).attr('src')
  if (srcAttribute && !srcAttribute.startsWith('/')) {
    $c(element).attr('src', `/${srcAttribute}`)
  }
})

// Save the modified HTML content
const modifiedHTML = $c.html()
fs.writeFileSync('dist/modified_index.html', modifiedHTML, 'utf-8')

console.log('HTML file has been modified successfully.')
