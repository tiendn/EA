import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/Rx';

@Injectable()
export class AuthService {
    apiName = "account";
    userStorageKey = "user";
    servicesUrl: any;
    requestHeader: any;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars) {
        this.requestHeader = new Headers();
        this.requestHeader.append('Content-Type', 'application/x-www-form-urlencoded');
    }

    /**
     * Create Account
     * @param userData
     */
    createAccount(userData) {
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/";
        return new Promise(resolve => {
            this.http.post(this.servicesUrl + "register", userData)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        resolve(true);
                    }
                    else
                        resolve(false);
                },
                error => {
                    console.log(error);
                    resolve(false);
                }
                );
        });
    }

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
    login(userData) {
        let params = "grant_type=password&username=" + userData.userName + "&password=" + userData.password;
        return new Promise(resolve => {
            this.http.post(this.globalVars.externalAccServiceUrl + "token", params, { headers: this.requestHeader })
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        let data = res.json();
                        if (!data.userName)
                            data.userName = userData.userName;
                        resolve(data);
                    }
                    else
                        resolve(null);
                },
                error => {
                    console.log(error);
                    resolve(null);
                }
                )
        });
    }

    /**
     * Reset Password
     * @param email
     */
    forgotPassword(email) {
        let servicesUrl = this.globalVars.servicesUrl + this.apiName + "/forgotpassword";
        let params = "Email=" + email;
        return new Promise(resolve => {
            this.http.post(servicesUrl, params, { headers: this.requestHeader })
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        resolve(true);
                    }
                    else
                        resolve(false);
                },
                error => {
                    console.log(error);
                    resolve(false);
                }
                )
        });
    }

    /**
     * Change Password
     * @param data
     */
    changePassword(data) {
        let servicesUrl = this.globalVars.servicesUrl + this.apiName + "/ResetPassword";
        let params = "Email=" + data.email + "&Password=" + data.password + "&Code=" + data.resetCode;
        return new Promise(resolve => {
            this.http.post(servicesUrl, params, { headers: this.requestHeader })
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        resolve(true);
                    }
                    else
                        resolve(false);
                },
                error => {
                    console.log(error);
                    resolve(false);
                }
                )
        });
    }

    /**
     * Logout
     */
    logout() {
        this.globalVars.setGlobalVar("user", null);
        //this.removeUserData();
        this.globalVars.setGlobalVar("profileSettings", {
            enableWatchlist: false,
            watchlist: [],
            enableIndices: false,
            indices: [],
            emailAlert: 0
        });
    }

    /**
     * Check user has logged in
     */
    hasLoggedIn() {
        return this.globalVars.user && this.globalVars.user != null && this.globalVars.user.userName.length > 0;
    }

    /**
     * Get Username
     */
    getUserName() {
        if (!this.globalVars.user.firstName && !this.globalVars.user.lastName)
            return this.globalVars.user.userName;
        else
            return this.globalVars.user.firstName + " " + this.globalVars.user.lastName;
    }

    /**
     * Get user info
     */
    getUserInfo() {
        if (this.globalVars.user && this.globalVars.user != null)
            return this.globalVars.user;
        else
            return null;
    }

    /**
     * Get token of current user login
     */
    getToken() {
        if (this.globalVars.user.access_token)
            return this.globalVars.user.access_token;
        else
            return null;
    }

    /**
     *  Check expires token
     */
    tokenIsExpires() {
        return this.hasLoggedIn() && new Date(this.globalVars.user[".expires"]) < new Date();
    }
    
    /**
     * Get user data
     */
    getUserData() {
        return new Promise(resolve => {
            this.storage.get(this.userStorageKey).then(data => {
                if (data != null)
                    resolve(data);
                else
                    resolve(null);
            });
        });
    }

    /**
     * Set user data to storage
     */
    setUserData() {
        this.storage.set(this.userStorageKey, this.globalVars.user);
    }

    //Remove user data from storage
    removeUserData() {
        this.storage.remove(this.userStorageKey);
    }
}