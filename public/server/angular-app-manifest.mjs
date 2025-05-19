
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
    'index.csr.html': {size: 35112, hash: 'd19031da18d8fd6917893260d02d870c784774b997cbaafb0149aec128e70b52', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1661, hash: 'e4fe638646f3560328463305dbda5b8b189177618ee71b4f8775b66d796929c4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PJVZMVQ6.css': {size: 386003, hash: 'Wcz3EsIFFeA', text: () => import('./assets-chunks/styles-PJVZMVQ6_css.mjs').then(m => m.default)}
  },
};
