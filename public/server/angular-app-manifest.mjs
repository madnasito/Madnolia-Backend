
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
    'index.csr.html': {size: 35112, hash: '014c25627c10dbd143645c7e1dd9a91efda12f014888c38d4d1b19bf28651184', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1661, hash: 'e8436c01ada478dc8bd6cb329ad872ac41694caa3ce33fbedf63ee4a540a92da', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-IIZIQCKJ.css': {size: 301304, hash: 'kcooMvmwg3Y', text: () => import('./assets-chunks/styles-IIZIQCKJ_css.mjs').then(m => m.default)}
  },
};
