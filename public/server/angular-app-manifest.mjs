
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
    'index.csr.html': {size: 35112, hash: 'e846e4daee0358f6ececa19240f680c955092ec4c6bc8e0981440f4834b60cd7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1661, hash: 'ccfd07051c7b01e66956cf297c042cdd9e7e9d95be48cdf9e5c19f4b9c448126', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PJVZMVQ6.css': {size: 386003, hash: 'Wcz3EsIFFeA', text: () => import('./assets-chunks/styles-PJVZMVQ6_css.mjs').then(m => m.default)}
  },
};
