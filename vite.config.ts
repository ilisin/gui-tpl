/* eslint-disable import/default */
import { rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import Electron from 'vite-plugin-electron'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)

  return {
    plugins: [
      VueRouter({
        // Folder(s) to scan for vue components and generate routes. Can be a string, or
        // an object, or an array of those. Each option allows to override global options.
        // like exclude, extensions, etc.
        routesFolder: 'src/pages',

        // allowed extensions for components to be considered as pages
        // can also be a suffix: e.g. `.page.vue` will match `home.page.vue`
        // but remove it from the route path
        extensions: ['.vue'],

        // list of glob files to exclude from the routes generation
        // e.g. ['**/__*'] will exclude all files and folders starting with `__`
        // e.g. ['**/__*/**/*'] will exclude all files within folders starting with `__`
        // e.g. ['**/*.component.vue'] will exclude components ending with `.component.vue`
        exclude: [],

        // Path for the generated types. Defaults to `./typed-router.d.ts` if typescript
        // is installed. Can be disabled by passing `false`.
        dts: './typed-router.d.ts',

        // Override the name generation of routes. unplugin-vue-router exports two versions:
        // `getFileBasedRouteName()` (the default) and `getPascalCaseRouteName()`. Import any
        // of them within your `vite.config.ts` file.
        // getRouteName: routeNode => myOwnGenerateRouteName(routeNode),

        // Customizes the default langage for `<route>` blocks
        // json5 is just a more permissive version of json
        // routeBlockLang: 'json5',

        // Change the import mode of page components. Can be 'async', 'sync', or a function with the following signature:
        // (filepath: string) => 'async' | 'sync'
        importMode: 'async',
      }),
      Vue(),
      Electron([
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
        imports: [
          'vue',
          'pinia',
          '@vueuse/core',
          VueRouterAutoImports,

          // {
          //   // add any other imports you were relying on
          //   'vue-router/auto': ['useLink'],
          // },
        ],
        dirs: [
          '@/store',
        ],
        resolvers: [ElementPlusResolver({
          importStyle: 'sass',
        })],
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
          IconsResolver(),
        ],
      }),
      Icons({
        autoInstall: true,
        compiler: 'vue3',
      }),
      ElementPlus({
        useSource: true,
      }),
      Unocss({
        presets: [
          presetUno(),
          presetAttributify(),
          presetIcons({
            scale: 1.2,
            warn: true,
          }),
        ],
        transformers: [
          transformerDirectives(),
          transformerVariantGroup(),
        ],
      }),
    ],
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@images': fileURLToPath(new URL('./src/assets/images', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@styles/element/index.scss" as *;',
        },
      },
    },
    server: {
      host: url.hostname,
      port: +url.port,
    },
    clearScreen: false,
  }
})
