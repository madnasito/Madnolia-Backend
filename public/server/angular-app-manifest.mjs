
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
    'index.csr.html': {size: 34961, hash: '63a18c75ddad579d32f3562d530041a67bd1772da9a825a1e1d37f17f30f6d78', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1510, hash: 'ba4412d12c579a8e98c790429750da52256e4eef1f23c51e844b5a00be9e4b0b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PJVZMVQ6.css': {size: 386003, hash: 'Wcz3EsIFFeA', text: () => import('./assets-chunks/styles-PJVZMVQ6_css.mjs').then(m => m.default)}
  },
};
