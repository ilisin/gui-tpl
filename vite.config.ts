import { rmSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import electron from 'vite-plugin-electron'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    plugins: [
      vue(),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG)
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            else
              options.startup()
          },
          vite: {
            build: {
              sourcemap, // For debugging
              minify: isBuild, // For production
              outDir: 'dist/electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload()
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist/electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
      ]),
      AutoImport({
        imports: ['vue', '@vueuse/core'],
        vueTemplate: true,
      }),
    ],
  }
})
