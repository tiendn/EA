import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { KeyFinancialService } from '../../providers/key-financial-service';

@Component({
    templateUrl: 'keyfinancialsPhoneDetail.html',
    providers: [KeyFinancialService]
})

export class KeyFinancialsPhoneDetailPage {
    isTablet:boolean;
    loading:any;
    keyFinancialText:string;
    hideTab:boolean = false;
    tab:any[];
    currentTabId:number;
    QuarterData: any;
    AnnualData:any;
    FinalData:any;
    graph:any[];
    currentItem:any;
    currentIndex:number;
    note:string;
    historicalDataText:string;
    isArabic:boolean;

    constructor(public nav: NavController,public helper: Helper, public globalVars: GlobalVars, public KeyFinancialsService: KeyFinancialService, public navParams: NavParams){  
		this.isTablet = globalVars.isTablet;
        this.loading = null;    
        this.keyFinancialText = helper.getPhrase('KeyFinancials','Common');   
	   	this.tab = [{
	   			'id':1,
	   			'displayName':helper.getPhrase('Quarterly','KeyFinancials')
	   		},
	   		{
	   			'id':2,
	   			'displayName':helper.getPhrase('Annual','KeyFinancials')
	   		}
	   	];
	   	this.KeyFinancialsService = KeyFinancialsService;	
	   	this.currentTabId = navParams.data.currentTabId;   	
	   	this.QuarterData = navParams.data.QuarterData;
	   	this.AnnualData = navParams.data.AnnualData;

	   	if(this.currentTabId === 1) this.FinalData = this.QuarterData;
	   	else this.FinalData = this.AnnualData;

	   	this.currentIndex = navParams.data.index;
	   	this.currentItem = this.FinalData[navParams.data.index];
	   	this.historicalDataText = helper.getPhrase('HistoricalData','KeyFinancials').toUpperCase();
	   	this.note = helper.getPhrase('Note','KeyFinancials');
	   	this.graph = [];
	   	this.prepareData(this.currentItem);
	   	this.isArabic = globalVars.isArabic;		
    }

    prepareData(item){ 
		console.log(item);  
	    var total = 0;	    
	    var max = item.Data[0].Value;
	    for(var i=0;i<item.Data.length;i++){
	      total += item.Data[i].Value;
	      if(item.Data[i].Value > max) max = item.Data[i].Value;      
	    }
	    for(var i=0;i<item.Data.length;i++){
	      var object = {        
	        Key: item.Data[i].Key,
	        Value: item.Data[i].Value,
	        DecimalPlaces: item.DecimalPlaces,
	        nColorCode: 0,
            Width: '0vw'        
	      }
	      if(item.Data[i].Value === max) object.Width = '70vw';
	      else object.Width = String(Math.floor(item.Data[i].Value / max * 70))+'vw';

	      if(i === item.Data.length - 1 && i > 0){
	        if((item.Data[i].Value - item.Data[i-1].Value) >= 0) object.nColorCode = 1;
	        else object.nColorCode = -1;   
	      }        
	      this.graph.push(object);
	    } 
	    this.graph.reverse();	    
	}

    ViewPrevious(){
  		if(this.currentIndex > 0){
		    this.currentIndex--; 
		    this.graph = [];
		    this.currentItem = this.FinalData[this.currentIndex];
		    this.prepareData(this.FinalData[this.currentIndex]);  
	    }
  	}

  	ViewNext(){
  		if(this.currentIndex < this.FinalData.length - 1){
		    this.currentIndex++; 
		    this.graph = [];
		    this.currentItem = this.FinalData[this.currentIndex];
		    this.prepareData(this.FinalData[this.currentIndex]);
	    }
  	}

  	goToTab(item){
		this.currentTabId = item.id;
		if(item.id === 1){
			this.FinalData = this.QuarterData;
			this.globalVars.isAnnual = false;
		}else{
			this.FinalData = this.AnnualData;
			this.globalVars.isAnnual = true;
		}
		this.currentItem = this.FinalData[0];	
		this.graph = [];
	   	this.prepareData(this.currentItem);

	   	if(this.globalVars.isTablet){
	   		// set first color on left panel
	   	}
	}

}