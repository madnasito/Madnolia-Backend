(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["new-new-routing"],{

/***/ "sTBm":
/*!******************************************!*\
  !*** ./src/app/pages/new/new.routing.ts ***!
  \******************************************/
/*! exports provided: NewRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewRoutingModule", function() { return NewRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _new_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./new.component */ "OCoP");
/* harmony import */ var _new_page_new_page_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./new-page/new-page.component */ "ky76");
/* harmony import */ var _match_create_match_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./match/create-match.component */ "T83Y");
/* harmony import */ var _tournament_tournament_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tournament/tournament.component */ "ktAK");








const routes = [
    { path: '', component: _new_component__WEBPACK_IMPORTED_MODULE_2__["NewComponent"], children: [
            { path: '', component: _new_page_new_page_component__WEBPACK_IMPORTED_MODULE_3__["NewPageComponent"] },
            { path: 'match', component: _match_create_match_component__WEBPACK_IMPORTED_MODULE_4__["CreateMatchComponent"] },
            { path: 'tournament', component: _tournament_tournament_component__WEBPACK_IMPORTED_MODULE_5__["TournamentComponent"] }
        ] }
];
class NewRoutingModule {
}
NewRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: NewRoutingModule });
NewRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function NewRoutingModule_Factory(t) { return new (t || NewRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](NewRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](NewRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=new-new-routing-es2015.js.map