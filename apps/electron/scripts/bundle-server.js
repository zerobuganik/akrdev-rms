const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs')

const src = path.join(__dirname, '..', 'src', 'api-local', 'server.ts')
const out = path.join(__dirname, '..', 'dist', 'api-local', 'server.js')

fs.mkdirSync(path.dirname(out), { recursive: true })

const inlineWorkspacePlugin = {
  name: 'inline-workspace',
  setup(build) {
    const filter = /^@akrdev\/(shared|schemas|types)$/
    build.onResolve({ filter }, (args) => {
      const pkg = args.path.replace('@akrdev/', '')
      const pkgDir = path.join(__dirname, '..', '..', '..', 'packages', pkg)
      const srcIndex = path.join(pkgDir, 'src', 'index.ts')
      return { path: srcIndex, namespace: 'workspace-inline' }
    })
    build.onLoad({ filter: /.*/, namespace: 'workspace-inline' }, async (args) => {
      const contents = fs.readFileSync(args.path, 'utf-8')
      const resolveDir = path.dirname(args.path)
      return { contents, loader: 'ts', resolveDir }
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
  plugins: [inlineWorkspacePlugin],
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
}).then(() => {
  console.log(`[bundle-server] Bundled server.cjs to ${out}`)
}).catch((err) => {
  console.error('[bundle-server] Build failed:', err)
  process.exit(1)
})
