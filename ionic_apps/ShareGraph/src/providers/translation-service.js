"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var TranslationService = (function () {
    function TranslationService(http, globalVars) {
        this.http = http;
        this.globalVars = globalVars;
    }
    TranslationService.prototype.load = function (langCode) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get('assets/data/lang/' + langCode + '.json').subscribe(function (res) {
                _this.data = res.json();
                resolve(_this.data);
            }, function (error) {
                console.log(error);
                resolve(null);
            });
        });
    };
    TranslationService = __decorate([
        core_1.Injectable()
    ], TranslationService);
    return TranslationService;
}());
exports.TranslationService = TranslationService;
