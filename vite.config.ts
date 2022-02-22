import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import federation from '@originjs/vite-plugin-federation'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Inspect from 'vite-plugin-inspect'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AlegraCommonsResolver, SmileAlegraResolver } from '@alegradev/smile-ui-alegra-next'
import { SmileResolver } from '@alegradev/smile-ui-next'

export default defineConfig({
  // set to microfrontend base path
  // ex: '/invoice' | '/feco-wizard'
  base: '/',
  build: {
    target: 'esnext',
    minify: true,
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        format: 'system',
        entryFileNames: '[name].js',
      }
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['./']
    }
  },
  plugins: [
    Vue({
      template: {
        transformAssetUrls: {
          base: '/src'
        }
      }
    }), 
    // https://github.com/originjs/vite-plugin-federation
    federation({
      // name: 'app-alegra-template',
      // filename: 'remoteEntry.js',
      // exposes: {
      //   foo: './foo_component.vue',
      // },
      // remotes:{
      //     common: 'http://localhost:3000/assets/remoteEntry.js',
      // },
      // shared: ['vue', 'single-spa-vue', 'vue-i18n', 'vue-router', 'pinia', '@vueuse/core']
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'vitest',
      ],
      dts: 'src/auto-imports.d.ts',
      resolvers: [
        AlegraCommonsResolver()
      ]
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load components under `./src/components/`
      extensions: ['vue'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/],

      // custom resolvers
      resolvers: [
        SmileResolver(),
        SmileAlegraResolver(),
        // SmileAlegraDirectivesResolver()
      ],

      dts: 'src/components.d.ts',
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect()
  ],
})
