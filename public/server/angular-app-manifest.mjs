
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
    'index.csr.html': {size: 35060, hash: 'f0c7fc43ae26e9fa0b7bdf87981999ce0479acd08f80ada621c9a2d653c36879', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1609, hash: 'e964401579f934b98724fc016b639af2dcd883ba93d4d7e07fd5aab6b0346e04', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-IIZIQCKJ.css': {size: 301304, hash: 'kcooMvmwg3Y', text: () => import('./assets-chunks/styles-IIZIQCKJ_css.mjs').then(m => m.default)}
  },
};
