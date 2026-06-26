const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs')

const src = path.join(__dirname, '..', 'src', 'api-local', 'server.ts')
const out = path.join(__dirname, '..', 'dist', 'api-local.bundle.js')

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

const EXTERNAL = [
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
]

esbuild.build({
  entryPoints: [src],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  outfile: out,
  plugins: [workspaceResolvePlugin],
  external: EXTERNAL,
  sourcemap: false,
  minify: false,
  logLevel: 'info',
}).then(() => {
  const contents = fs.readFileSync(out, 'utf-8')
  const forbidden = ['@akrdev/shared', '@akrdev/schemas', '@akrdev/types']
  for (const pkg of forbidden) {
    if (contents.includes(`require("${pkg}")`) || contents.includes(`require('${pkg}')`)) {
      console.error(`[bundle-server] FATAL: Workspace package ${pkg} was NOT inlined — found require() call in output`)
      process.exit(1)
    }
  }
  console.log(`[bundle-server] Bundled to ${out} (${(contents.length / 1024).toFixed(0)} KB, workspace deps inlined)`)
}).catch((err) => {
  console.error('[bundle-server] Build failed:', err)
  process.exit(1)
})
