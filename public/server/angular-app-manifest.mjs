
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: "en-US",
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    {
      "path": "chunk-BFHLUV4J.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 35060, hash: 'd34e05d6af1f0d6622aff832731380b40938cbee6e8086b94f4fb77c48bdeb4b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1609, hash: 'c4de9e4928d7bbc8df00c5f390ae626cb5e49ec233d4569386258d340854d186', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-IIZIQCKJ.css': {size: 301304, hash: 'kcooMvmwg3Y', text: () => import('./assets-chunks/styles-IIZIQCKJ_css.mjs').then(m => m.default)}
  },
};
