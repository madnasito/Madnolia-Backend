
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: "en-US",
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    {
      "path": "chunk-ZW3AUS7C.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 35112, hash: 'c69c4dd763fda9aeed60bd73bf451fad6e281f717f2da4bae4f3703d4c328054', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1661, hash: 'bab69d9189f3bcb7afa484c130cad85519a80bd8cd59e6281d6c385a848df5fa', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PJVZMVQ6.css': {size: 386003, hash: 'Wcz3EsIFFeA', text: () => import('./assets-chunks/styles-PJVZMVQ6_css.mjs').then(m => m.default)}
  },
};
