
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: "en-US",
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    {
      "path": "chunk-YBU6RLOO.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 34972, hash: '9c5223c5b6a1125208ca58543f384787f16ab9a842149e3d038091a63d71d1d7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1521, hash: '437236fc430a8f43d8911ad045454d812b1109d0f9e33433f63661e8fd3469df', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-JTUCIHJV.css': {size: 301239, hash: 'R0RhmDrWMTc', text: () => import('./assets-chunks/styles-JTUCIHJV_css.mjs').then(m => m.default)}
  },
};
