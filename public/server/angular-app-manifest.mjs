
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
    'index.csr.html': {size: 34972, hash: '3a3ccf62ce31713e5f05e6539e5e8fece647a58590f0049e8c7c2d4f1439fcf9', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1521, hash: '89e3de448a02d89e1346a5c3e0a331b11919ec9319cb2c17c6128ceb9935eb7e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-JTUCIHJV.css': {size: 301239, hash: 'R0RhmDrWMTc', text: () => import('./assets-chunks/styles-JTUCIHJV_css.mjs').then(m => m.default)}
  },
};
