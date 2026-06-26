const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs')

const src = path.join(__dirname, '..', 'src', 'api-local', 'server.ts')
const out = path.join(__dirname, '..', 'dist', 'api-local', 'server.js')

fs.mkdirSync(path.dirname(out), { recursive: true })

esbuild.buildSync({
  entryPoints: [src],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  outfile: out,
  external: [
    'electron',
    'argon2',
    'usb',
    '@luckykiet/node-printer',
    '@prisma/client*',
    '@prisma/adapter-libsql*',
    '@libsql/*',
    'libsql*',
    '*.node',
    'pngjs',
    'socket.io',
  ],
  sourcemap: false,
  minify: false,
  logLevel: 'info',
})

console.log(`[bundle-server] Bundled server.cjs to ${out}`)
