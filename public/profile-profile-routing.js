(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["profile-profile-routing"],{

/***/ "dr/r":
/*!**************************************************!*\
  !*** ./src/app/pages/profile/profile.routing.ts ***!
  \**************************************************/
/*! exports provided: ProfileRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileRoutingModule", function() { return ProfileRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _user_user_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user/user.component */ "oLT7");
/* harmony import */ var _matches_matches_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./matches/matches.component */ "2fzH");
/* harmony import */ var _partners_partners_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./partners/partners.component */ "+jMV");
/* harmony import */ var _games_games_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./games/games.component */ "MnMd");
/* harmony import */ var _profile_page_profile_page_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./profile-page/profile-page.component */ "qr/k");
/* harmony import */ var _profile_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./profile.component */ "Y5Lh");
/* harmony import */ var _platforms_platforms_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./platforms/platforms.component */ "apg/");











const routes = [
    { path: '', component: _profile_component__WEBPACK_IMPORTED_MODULE_7__["ProfileComponent"], children: [
            { path: '', component: _profile_page_profile_page_component__WEBPACK_IMPORTED_MODULE_6__["ProfilePageComponent"] },
            { path: 'user', component: _user_user_component__WEBPACK_IMPORTED_MODULE_2__["UserComponent"] },
            { path: 'matches', component: _matches_matches_component__WEBPACK_IMPORTED_MODULE_3__["MatchesComponent"] },
            { path: 'games', component: _games_games_component__WEBPACK_IMPORTED_MODULE_5__["GamesComponent"] },
            { path: 'partners', component: _partners_partners_component__WEBPACK_IMPORTED_MODULE_4__["PartnersComponent"] },
            { path: 'platforms', component: _platforms_platforms_component__WEBPACK_IMPORTED_MODULE_8__["PlatformsComponent"] }
        ] }
];
class ProfileRoutingModule {
}
ProfileRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: ProfileRoutingModule });
ProfileRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function ProfileRoutingModule_Factory(t) { return new (t || ProfileRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](ProfileRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](ProfileRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=profile-profile-routing.js.map