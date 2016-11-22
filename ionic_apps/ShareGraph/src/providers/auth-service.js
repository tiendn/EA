"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/Rx');
var AuthService = (function () {
    function AuthService(http, storage, globalVars) {
        this.http = http;
        this.storage = storage;
        this.globalVars = globalVars;
        this.apiName = "account";
        this.userStorageKey = "user";
        this.requestHeader = new http_1.Headers();
        this.requestHeader.append('Content-Type', 'application/x-www-form-urlencoded');
    }
    /**
     * Create Account
     * @param userData
     */
    AuthService.prototype.createAccount = function (userData) {
        var _this = this;
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/";
        return new Promise(function (resolve) {
            _this.http.post(_this.servicesUrl + "register", userData)
                .timeout(_this.globalVars.requestTimeout)
                .retry(_this.globalVars.retry)
                .subscribe(function (res) {
                if (res != undefined && res != null) {
                    resolve(true);
                }
                else
                    resolve(false);
            }, function (error) {
                console.log(error);
                resolve(false);
            });
        });
    };
    /*Account info*/
    //getAccountInfo(email) {
    //    return new Promise(resolve => {
    //        resolve(this.userData);
    //    });
    //}
    /**
     * Login
     * @param userData
     */
    AuthService.prototype.login = function (userData) {
        var _this = this;
        var params = "grant_type=password&username=" + userData.userName + "&password=" + userData.password;
        return new Promise(function (resolve) {
            _this.http.post(_this.globalVars.externalAccServiceUrl + "token", params, { headers: _this.requestHeader })
                .timeout(_this.globalVars.requestTimeout)
                .retry(_this.globalVars.retry)
                .subscribe(function (res) {
                if (res != undefined && res != null) {
                    var data = res.json();
                    if (!data.userName)
                        data.userName = userData.userName;
                    resolve(data);
                }
                else
                    resolve(null);
            }, function (error) {
                console.log(error);
                resolve(null);
            });
        });
    };
    /**
     * Reset Password
     * @param email
     */
    AuthService.prototype.forgotPassword = function (email) {
        var _this = this;
        var servicesUrl = this.globalVars.servicesUrl + this.apiName + "/forgotpassword";
        var params = "Email=" + email;
        return new Promise(function (resolve) {
            _this.http.post(servicesUrl, params, { headers: _this.requestHeader })
                .timeout(_this.globalVars.requestTimeout)
                .retry(_this.globalVars.retry)
                .subscribe(function (res) {
                if (res != undefined && res != null) {
                    resolve(true);
                }
                else
                    resolve(false);
            }, function (error) {
                console.log(error);
                resolve(false);
            });
        });
    };
    /**
     * Change Password
     * @param data
     */
    AuthService.prototype.changePassword = function (data) {
        var _this = this;
        var servicesUrl = this.globalVars.servicesUrl + this.apiName + "/ResetPassword";
        var params = "Email=" + data.email + "&Password=" + data.password + "&Code=" + data.resetCode;
        return new Promise(function (resolve) {
            _this.http.post(servicesUrl, params, { headers: _this.requestHeader })
                .timeout(_this.globalVars.requestTimeout)
                .retry(_this.globalVars.retry)
                .subscribe(function (res) {
                if (res != undefined && res != null) {
                    resolve(true);
                }
                else
                    resolve(false);
            }, function (error) {
                console.log(error);
                resolve(false);
            });
        });
    };
    /**
     * Logout
     */
    AuthService.prototype.logout = function () {
        this.globalVars.setGlobalVar("user", null);
        //this.removeUserData();
        this.globalVars.setGlobalVar("profileSettings", {
            enableWatchlist: false,
            watchlist: [],
            enableIndices: false,
            indices: [],
            emailAlert: 0
        });
    };
    /**
     * Check user has logged in
     */
    AuthService.prototype.hasLoggedIn = function () {
        return this.globalVars.user && this.globalVars.user != null && this.globalVars.user.userName.length > 0;
    };
    /**
     * Get Username
     */
    AuthService.prototype.getUserName = function () {
        if (!this.globalVars.user.firstName && !this.globalVars.user.lastName)
            return this.globalVars.user.userName;
        else
            return this.globalVars.user.firstName + " " + this.globalVars.user.lastName;
    };
    /**
     * Get user info
     */
    AuthService.prototype.getUserInfo = function () {
        if (this.globalVars.user && this.globalVars.user != null)
            return this.globalVars.user;
        else
            return null;
    };
    /**
     * Get token of current user login
     */
    AuthService.prototype.getToken = function () {
        if (this.globalVars.user.access_token)
            return this.globalVars.user.access_token;
        else
            return null;
    };
    /**
     *  Check expires token
     */
    AuthService.prototype.tokenIsExpires = function () {
        return this.hasLoggedIn() && new Date(this.globalVars.user[".expires"]) < new Date();
    };
    /**
     * Get user data
     */
    AuthService.prototype.getUserData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.storage.get(_this.userStorageKey).then(function (data) {
                if (data != null)
                    resolve(data);
                else
                    resolve(null);
            });
        });
    };
    /**
     * Set user data to storage
     */
    AuthService.prototype.setUserData = function () {
        this.storage.set(this.userStorageKey, this.globalVars.user);
    };
    //Remove user data from storage
    AuthService.prototype.removeUserData = function () {
        this.storage.remove(this.userStorageKey);
    };
    AuthService = __decorate([
        core_1.Injectable()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
