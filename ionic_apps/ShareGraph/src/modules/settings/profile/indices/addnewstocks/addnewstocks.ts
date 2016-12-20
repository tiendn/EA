import {NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {Helper} from '../../../../../common/helper';
import {ProfileService} from '../../../../../providers/profile-service';
import { GlobalVars } from '../../../../../common/global-vars';

@Component({
    selector: 'indices-add-stock-page',
    templateUrl: 'addnewstocks.html',
    providers: [ProfileService]
})
export class IndicesAddStocks {
    apiName:any="indices";
    searchInput:string = "";
    searchByTickerCode:string="";
    useEnglishKeywords:string="";
    done:string;
    selectedcount:any=0;
    items:any=[];
    selectedItems:any=[];
    isLoading:any=false;

    constructor(public nav:NavController, navParams:NavParams, public helper:Helper, public profileService:ProfileService, public globalVars:GlobalVars) {
        this.done =  this.helper.getPhrase("Done", "Common");
        this.searchByTickerCode = this.helper.getPhrase("SearchByTickerCode", "Settings");
        this.useEnglishKeywords = this.helper.getPhrase("UseEnglishKeywords", "Settings")
    }

    selectedShare(sender, item) {
        if(sender.checked)
        {
            this.selectedcount ++;
            this.selectedItems.push(item);
        }
        else
        {
            this.selectedcount --;
        }
    }

    closeModal(){
        var lstIndices = this.globalVars.profileSettings.indices.concat(this.selectedItems);
        this.saveIndices(lstIndices);
        this.nav.pop();
    }

    instantSearch(evt)
    {
        var $scope=this, $request = null;
        if($scope.searchInput.length>=3)
        {
            if($request)
            {
                clearTimeout($request);
            }

            $request = setTimeout(function(){ 
                $scope.items = [];
                $scope.isLoading=true;
                $scope.profileService.getSearchData($scope.apiName,$scope.searchInput,10).then(function(data){
                    $scope.items = $scope.helper.excludeListObject(data, $scope.globalVars.profileSettings.indices);
                    $scope.selectedItems = [];
                    $scope.selectedcount = 0;
                    
                    setTimeout(() => {
                        $scope.isLoading=false;
                    }, 100);
                });
            }, 300);
        }
    }

    saveIndices(lstShares)
    {
        this.globalVars.profileSettings.indices = lstShares;
        //Save watchlist to database
        var arrInstrumentID = [];
        lstShares.forEach(function(item){
            arrInstrumentID.push(item.Id);
        })
        if(arrInstrumentID.length>0)
        {
            this.profileService.saveWatchlistData(this.apiName, arrInstrumentID.toString());
        }
    }
}
