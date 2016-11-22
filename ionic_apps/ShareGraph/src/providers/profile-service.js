"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
require('rxjs/Rx');
var ProfileService = (function () {
    function ProfileService(http, storage, globalVars) {
        this.http = http;
        this.storage = storage;
        this.globalVars = globalVars;
    }
    ProfileService.prototype.getProfileStatus = function () {
        return new Promise(function (resolve) {
            resolve(null);
        });
    };
    ProfileService.prototype.getProfileData = function () {
        return new Promise(function (resolve) {
            resolve(null);
        });
    };
    ProfileService.prototype.isEnabledWatchlist = function () {
        return false;
    };
    ProfileService.prototype.isEnabledIndices = function () {
        return false;
    };
    ProfileService = __decorate([
        core_1.Injectable()
    ], ProfileService);
    return ProfileService;
}());
exports.ProfileService = ProfileService;
