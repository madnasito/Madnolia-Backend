
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
    'index.csr.html': {size: 35112, hash: 'f600d546ed79abcaac9d0990349fd36fbbefe108e7058baaea7e79bfcab25edc', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1661, hash: '9eca2fbc09d91e3b074a7dfef622fea78b58b7961dbb4d804b9a06b7d595f19f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-IIZIQCKJ.css': {size: 301304, hash: 'kcooMvmwg3Y', text: () => import('./assets-chunks/styles-IIZIQCKJ_css.mjs').then(m => m.default)}
  },
};
