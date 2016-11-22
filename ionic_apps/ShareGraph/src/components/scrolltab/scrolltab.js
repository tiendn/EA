"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ScrollTabComponent = (function () {
    function ScrollTabComponent(helper) {
        this.helper = helper;
        this.hideTab = true;
        this.currentId = 0;
    }
    ScrollTabComponent.prototype.genTabData = function (target, data, idKey, nameKey) {
        var _this = this;
        if (idKey === void 0) { idKey = "instrumentid"; }
        if (nameKey === void 0) { nameKey = ""; }
        if (data.length > 1) {
            data.forEach(function (obj) {
                obj.id = obj[idKey];
                if (nameKey == "")
                    obj.displayName = _this.helper.getConfigValueByLang(obj.name);
                else {
                    var name_1 = obj[nameKey];
                    if (name_1.indexOf("/") > 0)
                        obj.displayName = _this.helper.getPhrase(name_1.split("/")[1], name_1.split("/")[0]);
                    else
                        obj.displayName = name_1;
                }
            });
            this.target = target;
            this.data = data;
            this.hideTab = false;
        }
    };
    ScrollTabComponent = __decorate([
        core_1.Component({
            selector: 'scroll-tab',
            templateUrl: 'scrolltab.html'
        })
    ], ScrollTabComponent);
    return ScrollTabComponent;
}());
exports.ScrollTabComponent = ScrollTabComponent;
