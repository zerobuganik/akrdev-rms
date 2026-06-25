// Patches electron npm package so require('electron') returns the built-in API
// when running inside Electron's main process, instead of just the exe path.
const fs = require('fs')
const path = require('path')

const electronDir = path.resolve(__dirname, '..', 'node_modules', 'electron')
const indexJs = path.join(electronDir, 'index.js')
const origJs = path.join(electronDir, 'index-orig.js')

if (!fs.existsSync(indexJs)) {
  console.log('[electron-patch] electron not found, skipping')
  process.exit(0)
}

// Read original
const original = fs.readFileSync(indexJs, 'utf-8')

// Only patch if not already patched
if (original.includes('process.versions.electron')) {
  console.log('[electron-patch] already patched, skipping')
  process.exit(0)
}

// Backup original
fs.writeFileSync(origJs, original)

// Write shim
fs.writeFileSync(indexJs, `// Auto-patched by AKRDev RMS — delegates to built-in when inside Electron
if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
  // Resolve via the original path function (needed by cli.js to get exe path)
  // but then Electron overrides the exports
  const origPath = require('./index-orig.js')
  module.exports = typeof origPath === 'function' ? origPath() : (origPath || {})
} else {
  module.exports = require('./index-orig.js')
}
`)

console.log('[electron-patch] electron index.js shimmed for built-in module support')
