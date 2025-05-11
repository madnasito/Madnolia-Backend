
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: "en-US",
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    {
      "path": "chunk-LH6HTYRS.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 34604, hash: '9544743caa638107e9a9c57df51a12b90376c1a572d32b527cbd8eb87565a09c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1153, hash: '50cd36601decc3150494ad2015403d04d9d044f36b54a6117dc1796dc4fdacff', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-P2CYIHZC.css': {size: 301065, hash: '+wkeglJgDrk', text: () => import('./assets-chunks/styles-P2CYIHZC_css.mjs').then(m => m.default)}
  },
};
