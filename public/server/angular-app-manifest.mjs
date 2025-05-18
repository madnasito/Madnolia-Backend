
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
    'index.csr.html': {size: 34972, hash: '9dffcb0f81cfe05ff5d726dc7466182061d2fe7dea8708f90e25c161480995dd', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1521, hash: '0028b9d6c02755859ce59998251f1fb56e576a7311a79819c7eb130e5d117cb1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-JTUCIHJV.css': {size: 301239, hash: 'R0RhmDrWMTc', text: () => import('./assets-chunks/styles-JTUCIHJV_css.mjs').then(m => m.default)}
  },
};
