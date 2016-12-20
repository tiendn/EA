import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { MediaService } from '../../providers/media-service';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { File } from 'ionic-native';
import { MediaDetailPage } from './media-detail';

@Component({
    selector: 'page-media',
    templateUrl: 'media.html',
    providers: [MediaService]
})
export class MediaPage {
    hideTab:boolean = false;
    moduleName:string = 'Media';
    headerTitle:string;
    tab:any[];
    currentTabId:any;
    rawdata:any[];
    yearTitle:any[];
    annualData:any[];
    currentYear:any;
    subfolder:any;
    oldData:any[];
    data:any;

    constructor(public nav: NavController, public helper: Helper, public globalVars: GlobalVars, public mediaService: MediaService, public actionSheetController: ActionSheetController){
        this.headerTitle = helper.getPhrase('Media','Common');
        this.tab = [];
        this.rawdata = [];
    }

    ionViewWillEnter(){
        if(this.globalVars.startDownloadingFile){
            this.globalVars.startDownloadingFile["downloadedCallback"] = (data1) => {
              setTimeout(() => {this.verifyDownloadedFile1()},1000);
            }
        }
    }

    ionViewDidLoad(){
        this.mediaService.loadCategory(this.globalVars.companyCode, this.globalVars.generalSettings.language.value).then(d => {
          let data:any = d;
          if(data.length > 0) localStorage.setItem('mediaCategoryIDList',JSON.stringify(data));
          else{
            data = JSON.parse(localStorage.getItem('mediaCategoryIDList'));
          }      
    
          for(let i=0;i<data.length;i++){
            let obj = {
              'Id':data[i].Id,
              'displayName':data[i].Name
            }
            this.tab.push(obj);
          }
          this.currentTabId = this.tab[0].Id;
          if(data.length > 0)
            this.mediaService.loadItemByCategory(this.globalVars.companyCode, this.globalVars.generalSettings.language.value, this.tab[0].Id).then(d1 => {
              let data1:any = d1;
              if(data1.length > 0) localStorage.setItem('raw'+this.tab[0].Id,JSON.stringify(data1));
              else{
                data1 = JSON.parse(localStorage.getItem('raw'+this.tab[0].Id));
                if(data1 === null) data1 = [];
              } 
    
              if(data1.length > 0){
                for(let i=0;i<data1.length;i++){
                  // add audio URL value, continue to use "rawdata"
                  let obj = data1[i];
                  obj.URL = data1[i].FileName;
                  let temp = data1[i].FileName.split('/');              
                  obj.FileNameWithNoETag = data1[i].FileName.split('/')[temp.length - 1];
                  obj.ETag = data1[i].ETag;
    
                  let justFile = obj.FileNameWithNoETag.split('.')[0];
                  obj.FileType = obj.FileNameWithNoETag.split('.')[1];
                  obj.FileName = justFile+'_'+data1[i].ETag+'.'+obj.FileType;
                  // obj.FileName = decodeURI(this.currentTabId+'-'+justFile+'_'+data1[i].ETag+'.'+obj.FileType).replace(/\s/g,"");
                                    
                  // obj.FileName = decodeURI(this.currentTabId+'-'+data1[i].ETag+'_'+data1[i].FileName.split('/')[temp.length - 1]);
                  // temp = obj.FileName.split('.');
                  // obj.FileType = temp[temp.length - 1];
                  obj.CategoryID = this.currentTabId;
                  obj.downloaded = false;

                  this.rawdata.push(obj);
                }
                this.yearTitle = [];
                for(let i=0;i<this.rawdata.length;i++){
                  let obj = {'Year':this.rawdata[i].Year};
                  let flag = false;
                  for(let j=0;j<this.yearTitle.length;j++)
                    if(this.yearTitle[j].Year === this.rawdata[i].Year) flag = true;
                  if(flag === false) this.yearTitle.push(obj);
                }
                this.currentYear = this.rawdata[0].Year;
                this.filterByYear(this.currentYear);
                for(let i=0;i<this.rawdata[i].length;i++)
                  this.rawdata[i].position = 0;        
              }else{
                this.rawdata = [];
                this.yearTitle = [];
              }
            });
          
        }).catch(function(){
          alert('yay');
        });		
    }
    
    filterByYear(year){
        this.annualData = [];    
        for(let i=0;i<this.rawdata.length;i++)
          if(this.rawdata[i].Year === year){    
            let obj = this.rawdata[i];
            this.annualData.push(obj);
          }
        this.verifyDownloadedFile1();  
    }

    goToTab(item){
		    this.currentTabId = item.Id;
        this.rawdata = [];   
          
        this.mediaService.loadItemByCategory(this.globalVars.companyCode, this.globalVars.generalSettings.language.value, this.currentTabId).then(d1 => {
          let data1:any = d1;
          if(data1.length > 0){
            localStorage.setItem('raw'+this.currentTabId,JSON.stringify(data1));
          } 
          else{
              data1 = JSON.parse(localStorage.getItem('raw'+this.currentTabId));
              if(data1 === null) data1 = [];
          } 
    
          // add audio / video URL value, continue to use "rawdata"
          if(data1.length > 0){        
            for(let i=0;i<data1.length;i++){
              // add audio URL value, continue to use "rawdata"
    
              let obj = data1[i];
              obj.URL = data1[i].FileName;
              let temp = data1[i].FileName.split('/');              
              obj.FileNameWithNoETag = data1[i].FileName.split('/')[temp.length - 1];
              
              obj.ETag = data1[i].ETag;
              let justFile = obj.FileNameWithNoETag.split('.')[0];
              obj.FileType = obj.FileNameWithNoETag.split('.')[1];
              obj.FileName = justFile+'_'+data1[i].ETag+'.'+obj.FileType;
              // obj.FileName = decodeURI(this.currentTabId+'-'+justFile+'_'+data1[i].ETag+'.'+obj.FileType).replace(/\s/g,"");
              obj.CategoryID = this.currentTabId;
              this.rawdata.push(obj);
            }
            this.yearTitle = [];
            for(let i=0;i<this.rawdata.length;i++){
              let obj = {'Year':this.rawdata[i].Year};
              let flag = false;
              for(let j=0;j<this.yearTitle.length;j++)
                if(this.yearTitle[j].Year === this.rawdata[i].Year) flag = true;
              if(flag === false) this.yearTitle.push(obj);
            }
            this.currentYear = this.rawdata[0].Year;
            this.filterByYear(this.currentYear);
          }else{
            this.rawdata = [];
            this.yearTitle = [];
            this.annualData = [];
          }    
        });
	}

  goToYear(item){
		this.currentYear = item.Year;
		this.filterByYear(this.currentYear);
	}

    play1(item){        
        let currentTabName;
        for(let i=0;i<this.tab.length;i++)
          if(this.tab[i].Id === this.currentTabId){
            currentTabName = this.tab[i].displayName;
            break;
          }
        this.mergeWithOldData(this.currentTabId);  
        if(document.getElementById('test1') != null || document.getElementById('test2') != null) alert('duplicated'); 
        this.nav.push(MediaDetailPage,{MediaList:this.rawdata, currentItem:item, currentTabName:currentTabName, currentTabId:this.currentTabId});        
  }

    createFolder(){
        let x = this;
        if (this.globalVars.rootEntry != null) {
          this.globalVars.rootEntry.getDirectory(this.moduleName, {
              create: true,
              exclusive: true
          }, function (entry) {          
              x.helper.setMetaDataNoBackup(entry);
              // if(x.currentTabId === 'audiocast') x.subfolder = 'Audio';
              // if(x.currentTabId === 'webcast') x.subfolder = 'Video';
              // if(x.currentTabId === 'corporate') x.subfolder = 'Corporate';
    
              x.subfolder = x.currentTabId;
              entry.getDirectory(x.subfolder, {
                  create: true,
                  exclusive: true
              }, function (entry1) {
             
                  x.helper.setMetaDataNoBackup(entry1);
                  for(let i=0;i<x.rawdata.length;i++) x.rawdata[i].downloaded = false;
              }, function () {
    
               });
              //=====================================
          }, function () { });
        }
      }

      mergeWithOldData(data){    
        let previousData = JSON.parse(localStorage.getItem(data));    
        for(let i=0;i<this.rawdata.length;i++){
          let newItem = this.rawdata[i];      
          if(previousData != null) 
            for(let j=0;j<previousData.length;j++){
              let oldItem = previousData[j];
              if(newItem.FileName == oldItem.FileName){
                newItem.position = oldItem.position;            
                newItem.downloaded = oldItem.downloaded;
              }
            }
        }
      }

   
      verifyDownloadedFile1(){
        let ls = this.currentTabId, scope = this, folder = this.globalVars.appPath+'Media/', dir = this.currentTabId;
        let subfolder = folder+this.currentTabId+'/';
    
        let downloadingList = [];
        for(let i=0;i<this.globalVars.mediaDownloadingList.length;i++) downloadingList.push(this.globalVars.mediaDownloadingList[i].filename);
        let oldData = JSON.parse(localStorage.getItem(ls));
        if(oldData != undefined){
          for(let i=0;i<oldData.length;i++){
              if(oldData[i].downloaded === false && downloadingList.indexOf(oldData[i].FileName) === -1){
                File.removeFile(subfolder, oldData[i].FileName).then(function(){}).catch(function(){});
              }     
          }
             
        }
        File.checkDir(this.globalVars.appPath,'Media').then(function(){
            File.listDir(folder,dir).then(function(entry){  
    
              // console.log('=======================');
              // console.log(entry);
              // console.log(scope.annualData);
              // console.log('=======================');

              // for(let i:number=0;i<entry.length;i++){
              //    console.log(downloadingList.indexOf(entry[i].name));
              //    console.log(entry[i].name);
              //    console.log('=======================');
              //    for(let j:number=0;j<scope.annualData.length;j++){
              //       console.log(decodeURI(scope.annualData[j].FileName));
              //       if(entry[i].name === decodeURI(scope.annualData[j].FileName)){
              //           console.log(j);
              //           console.log('!!!!!!!!');
              //           console.log(downloadingList.indexOf(entry[i].name));
              //       } 
              //    } 
              // }

              let globalDownloadingFile:any = 'xxx';
              if(scope.globalVars.startDownloadingFile != undefined){
                let temp = scope.globalVars.startDownloadingFile.fileName;
                temp = temp.split('/')[1];  
                let file = temp.split('.')[0];
                let extention = temp.split('.')[1];
                globalDownloadingFile = file+'_'+scope.globalVars.startDownloadingFile.etag+'.'+extention;    
              } 
    
              // console.log(globalDownloadingFile); 
              for(let i:number=0;i<entry.length;i++){
                for(let j:number=0;j<scope.annualData.length;j++){
                  if(scope.annualData[j].downloaded === true) continue;

                  console.log(entry[i].name);
                  console.log(decodeURI(scope.annualData[j].FileName));
                  console.log(downloadingList.indexOf(entry[i].name));
                  console.log(globalDownloadingFile);
                  console.log((entry[i].name == decodeURI(scope.annualData[j].FileName) && downloadingList.indexOf(entry[i].name) == -1 && globalDownloadingFile != entry[i].name));

                  if(entry[i].name === decodeURI(scope.annualData[j].FileName) && downloadingList.indexOf(entry[i].name) === -1 && globalDownloadingFile != entry[i].name){
                    console.log(scope.annualData[j]);
                    scope.annualData[j].downloaded = true;
                    console.log('here');
                    break;
                  }
                  else scope.annualData[j].downloaded = false;
                }
              }
            });
        }).catch(function(){
           for(let i=0;i<scope.annualData[i].length;i++) scope.annualData[i].downloaded = false;
           scope.createFolder();
        });
      }

}
