const fs = require('fs')
const path = require('path')

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

const srcGenerated = path.join(__dirname, '..', 'src', 'generated', 'prisma')
const destGenerated = path.join(__dirname, '..', 'dist', 'generated', 'prisma')
if (fs.existsSync(srcGenerated)) {
  copyDir(srcGenerated, destGenerated)
  console.log('[copy-prisma] Copied prisma generated files to dist/')
} else {
  console.warn('[copy-prisma] No generated prisma found in src/')
}

const srcEnv = path.join(__dirname, '..', '.env')
const destEnv = path.join(__dirname, '..', 'dist', '.env')
if (fs.existsSync(srcEnv)) {
  fs.copyFileSync(srcEnv, destEnv)
  console.log('[copy-prisma] Copied .env to dist/')
}
