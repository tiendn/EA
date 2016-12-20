import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { KeyFinancialService } from '../../providers/key-financial-service';
import { KeyFinancialsPhoneDetailPage } from './keyfinancialsPhoneDetail';

@Component({
    selector: 'page-keyfinancials',
    templateUrl: 'keyfinancials.html',
    providers: [KeyFinancialService]
})
export class KeyFinancialsPage {
	isTablet:boolean;
	keyFinancialText: string;
	hideTab:boolean;
	tab:any[];
	dataLoaded:boolean = false;
	isArabic:boolean;
	QuarterData:any;
	AnnualData:any;
	currentTabId:number;
	FinalData:any;
	currentIndex:number;
	currentItem:any;
	graph:any[];
	note:string;
	historicalDataText:string;

    constructor(public nav: NavController,public helper: Helper, public globalVars: GlobalVars, public KeyFinancialsService: KeyFinancialService){
    	this.isTablet = globalVars.isTablet;
        this.keyFinancialText = helper.getPhrase('KeyFinancials','Common');    
        this.hideTab = false; 
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
	   	this.isArabic = globalVars.isArabic;
    }

    ionViewDidLoad(){
  		// check in local storage first
 
  		if(localStorage.getItem('keyFinancialQuarterData') === null || localStorage.getItem('keyFinancialAnnualData') === null 
  			|| (Date.now() - Number(localStorage.getItem('keyFinancialTime')) > this.globalVars.keyfinancials.storageTTL)){
  			this.helper.showLoading(this); 		
	  		this.KeyFinancialsService.load(this.globalVars.companyCode,  this.globalVars.generalSettings.language.value, false).then(data => {        
		        this.QuarterData = data;
		        this.KeyFinancialsService.load(this.globalVars.companyCode,  this.globalVars.generalSettings.language.value, true).then(data1 => {
		        	this.AnnualData = data1; 
		        	this.helper.hideLoading(this); 

		        	localStorage.setItem('keyFinancialAnnualData', JSON.stringify(this.AnnualData));
		        	localStorage.setItem('keyFinancialQuarterData', JSON.stringify(this.QuarterData));
		        	localStorage.setItem('keyFinancialTime', Date.now().toString());		        	
		        });  		       			   	         
		    }); 
  		}else{  
  			this.QuarterData = JSON.parse(localStorage.getItem('keyFinancialQuarterData'));
  			this.AnnualData = JSON.parse(localStorage.getItem('keyFinancialAnnualData'));
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
		if(this.globalVars.isTablet){
	   		this.currentIndex = 0;
	   		this.currentItem = this.FinalData[this.currentIndex];
	   		this.graph = [];	   		
	   		this.prepareData(this.currentItem);
	   		document.getElementById('keyFinancialRightCol').scrollTop = -1000;
	   		document.getElementById('keyFinancialLeftCol').scrollTop = -1000;
	   	} 
	}

	ionViewDidEnter(){	
		// console.log(this.globalVars);
		if(this.globalVars.isAnnual === true){
			this.currentTabId = 2;
			this.FinalData = this.AnnualData;
		}else{
			this.currentTabId = 1;
			this.FinalData = this.QuarterData;
		}		
		if(this.globalVars.isTablet){
	   		this.currentIndex = 0;	   
	   		this.currentItem = this.FinalData[this.currentIndex];
	   		this.historicalDataText = this.helper.getPhrase('HistoricalData','KeyFinancials').toUpperCase();
	   		this.note = this.helper.getPhrase('Note','KeyFinancials');
	   		this.graph = [];	   		
	   		this.prepareData(this.currentItem);
	   		this.dataLoaded = true;
	   	} 	
	}

	getItemIndex(item){
	    for(var i=0;i<this.FinalData.length;i++) if(this.FinalData[i] === item) return i;
	}

	viewInDetail(event, item){    
    	if(!this.globalVars.isTablet) this.nav.push(KeyFinancialsPhoneDetailPage, {index: this.getItemIndex(item), AnnualData:this.AnnualData, QuarterData:this.QuarterData, currentTabId:this.currentTabId});
  		else{
  			this.currentIndex = this.getItemIndex(item);
  			this.graph = [];	  
  			this.currentItem = this.FinalData[this.currentIndex]; 		
	   		this.prepareData(this.currentItem);
  		}
  	}

  	ViewPrevious(){
  		if(this.globalVars.isTablet){
  			if(this.currentIndex > 0){
			    this.currentIndex--; 
			    this.graph = [];
			    this.currentItem = this.FinalData[this.currentIndex];
			    this.prepareData(this.FinalData[this.currentIndex]);  
		    }
  		}
  	}

  	ViewNext(){
  		if(this.globalVars.isTablet){
  			if(this.currentIndex < this.FinalData.length - 1){
			    this.currentIndex++; 
			    this.graph = [];
			    this.currentItem = this.FinalData[this.currentIndex];
			    this.prepareData(this.FinalData[this.currentIndex]);
			    
		    }
  		}
  	}

  	prepareData(item){   
	    var total = 0;	    
	    var max = item.Data[0].Value;
	    for(var i=0;i<item.Data.length;i++){
	      total += item.Data[i].Value;
	      if(item.Data[i].Value > max) max = item.Data[i].Value;      
	    }
	    for(var i=0;i<item.Data.length;i++){
	      let object = {        
	        Key: item.Data[i].Key,
	        Value: item.Data[i].Value,
	        DecimalPlaces: item.DecimalPlaces,
	        nColorCode: 0,
	        Width:'0vw'        
	      }
	      if(item.Data[i].Value === max) object.Width = '45vw';
	      else object.Width = String(Math.floor(item.Data[i].Value / max * 45))+'vw';

	      if(i === item.Data.length - 1 && i > 0){
	        if((item.Data[i].Value - item.Data[i-1].Value) >= 0) object.nColorCode = 1;
	        else object.nColorCode = -1;   
	      }        
	      this.graph.push(object);
	    } 
	    this.graph.reverse();	    
	}
}
