const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs')

const src = path.join(__dirname, '..', 'src', 'api-local', 'server.ts')
const out = path.join(__dirname, '..', 'dist', 'api-local', 'server.js')

const outDir = path.dirname(out)
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true })
}
fs.mkdirSync(outDir, { recursive: true })

const packagesDir = path.join(__dirname, '..', '..', '..', 'packages')

const workspaceResolvePlugin = {
  name: 'workspace-ts-resolve',
  setup(build) {
    const workspaceMap = {
      '@akrdev/shared': path.join(packagesDir, 'shared', 'src', 'index.ts'),
      '@akrdev/schemas': path.join(packagesDir, 'schemas', 'src', 'index.ts'),
      '@akrdev/types': path.join(packagesDir, 'types', 'src', 'index.ts'),
    }
    const filter = /^@akrdev\/(shared|schemas|types)$/
    build.onResolve({ filter }, (args) => {
      return { path: workspaceMap[args.path], sideEffects: false }
    })
  },
}

esbuild.build({
  entryPoints: [src],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  outfile: out,
  plugins: [workspaceResolvePlugin],
  external: [
    'electron',
    'argon2',
    'usb',
    '@luckykiet/node-printer',
    '@prisma/client',
    '@prisma/client-runtime-utils',
    '@prisma/adapter-libsql',
    '@libsql',
    'libsql',
    '*.node',
    'pngjs',
    'socket.io',
  ],
  sourcemap: false,
  minify: false,
  logLevel: 'info',
}).then(() => {
  console.log(`[bundle-server] Bundled to ${out}`)
}).catch((err) => {
  console.error('[bundle-server] Build failed:', err)
  process.exit(1)
})
