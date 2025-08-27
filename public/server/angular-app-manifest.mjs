
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
    'index.csr.html': {size: 35112, hash: '1f9a2d5065d642714909a5597403f280cc923a397f608978509d408b1b6ecc89', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1661, hash: '435419c80378bc741452a4532206ae2cc16becdb189166bd04fbc962a0eda857', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-IIZIQCKJ.css': {size: 301304, hash: 'kcooMvmwg3Y', text: () => import('./assets-chunks/styles-IIZIQCKJ_css.mjs').then(m => m.default)}
  },
};
