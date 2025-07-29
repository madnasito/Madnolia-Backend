
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
    'index.csr.html': {size: 35112, hash: '6bbfc870f9228d1452f647cb5874a59790b12ba2b9fb62afd1115023c4841e6c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1661, hash: '077a1e7fe160ea998c8448017c0e27703dc01b21b6a7d5f885e857bf0f4e3f5a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PJVZMVQ6.css': {size: 386003, hash: 'Wcz3EsIFFeA', text: () => import('./assets-chunks/styles-PJVZMVQ6_css.mjs').then(m => m.default)}
  },
};
