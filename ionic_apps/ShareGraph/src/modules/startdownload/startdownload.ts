import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Helper} from '../../common/helper';
import {File, Transfer} from 'ionic-native';
import { GlobalVars } from '../../common/global-vars';
import {DownloadService} from '../../providers/download-service';
import {MediaService} from '../../providers/media-service'

@Component({
    selector: 'start-download-page',
    templateUrl: 'startdownload.html',
    providers: [DownloadService, MediaService]
})

export class StartDownloadPage {
    moduleName:string="download";
    downloadQueue:any=[];
    totalLength:any=0;
    downloadedLength:any=0;
    downloadedPercent:any=0;
    downloadedProgress:any=0;
    startDownloadTime:any=0;
    remainingLength:any=0;
    remainingTime:any=0;
    folderPath:string;
    mediaBlob:string;
    blobReportUrl:string;
    downloader:any;
    mediaCategory:any=[];
    constructor(public nav: NavController, 
                navParams:NavParams, 
                public view:ViewController, 
                public helper:Helper, 
                public downloadService:DownloadService, 
                public mediaService:MediaService,
                public globalVars: GlobalVars) {
        this.folderPath = globalVars.appPath;
        this.mediaBlob = "http://northeurope.blob.euroland.com/media/" + globalVars.companyCode.toUpperCase() + "/";
        this.blobReportUrl = globalVars.configData.common.bloburl + globalVars.configData.common.pdfreportsblobcontainer + "/" + globalVars.companyCode.toUpperCase() + "/";
        
        mediaService.loadCategory(globalVars.companyCode, 'en-GB').then(data=>{
            this.mediaCategory = data;
        });
    }

    ionViewDidLoad(){
        let self=this;
        
        this.downloadService.getDownloadQueue().then(data=>{
            if(data)
            {
                self.downloadQueue = JSON.parse(data.toString());
            }
            self.getDownloadFiles();            
        })
    }

    getDownloadFiles(){
        let self=this;
        if(this.downloadQueue && this.downloadQueue.length>0)
        {
            let self=this;
            this.downloadQueue.forEach((f)=>{
                self.totalLength += f.FileSize;
            });

            this.totalLength = Math.round(this.totalLength*100)/100;
            this.remainingLength = this.totalLength;
            this.startDownloadTime = new Date().getTime();
            this.startDownload();
        }
        else
        {
            this.downloadService.getDownloadData().then(data => {
                //Process for media File
                self.mediaCategory.forEach(function(m){
                    data["media"][m.Name].forEach((f)=>{
                        self.totalLength += f.FileSize;
                        f.Type = m.Id;
                        self.downloadQueue.push(f);
                    });
                });

                Object.keys(data["report"]).forEach(function(r){
                    data["report"][r].forEach((f)=>{
                        self.totalLength += f.FileSize;
                        f.Type = "report";
                        self.downloadQueue.push(f);
                    });
                });

                this.totalLength = Math.round(this.totalLength*100)/100;
                this.remainingLength = this.totalLength;
                this.startDownloadTime = new Date().getTime();
                this.startDownload();
            });
        }
    }

    startDownload()
    {
        if(this.downloadQueue.length>0){
            let f = this.downloadQueue[0];
            //Update queue item before download starting
            this.downloadService.setDownloadQueue(this.downloadQueue);
            
            this.downloadQueue.splice(0,1);
            let filenameWithETag = "";
            let folderPath = this.folderPath;
            let serverPath = "";
            if(f.Type=="report")
            {
                filenameWithETag = f.FileName.replace(".", "_" + f.ETag + ".");
                folderPath = folderPath + "Reports/";
                serverPath = this.blobReportUrl + f.FileName;
            }
            else
            { 
                
                if(f.FileName.indexOf('/')!=-1)
                    filenameWithETag = encodeURI(f.FileName).split('/')[1].replace(".","_"+f.ETag +".");
                else
                    filenameWithETag = encodeURI(f.FileName).replace('/','-').replace(".","_"+ f.ETag +".");
                folderPath = folderPath + "Media/"+ f.Type +"/";
                serverPath = this.mediaBlob + f.FileName;
            }
            let self=this;
            //DucTM: Check file is downloading in Report module
            if(this.isDownloadingFile(f.FileName)){
                this.downloadService.setDownloadQueue(this.downloadQueue);
                //Skip existed file 
                this.startDownload();
            }
            else{
                //Check existed file before download if not existed
                File.checkFile(folderPath, filenameWithETag).then(()=>{
                    self.downloadService.setDownloadQueue(self.downloadQueue);
                    //Skip existed file 
                    self.startDownload();
                }).catch(()=>{
                    let localFile = folderPath + filenameWithETag;
                    if(!this.downloader)
                    this.downloader = new Transfer();
                    
                    let sLength = 0;
                    let eLength = 0;
                    // #1 Add downloading file to global for another module tracking
                    let downloadingFile = {
                        fileName: f.FileName,
                        etag: f.ETag,
                        module: f.Type,
                        downloader: this.downloader,
                        downloadedCallback: null,
                        downloadFailed: null,
                        progressCallback:null
                    }
                    //Maintain event for new file 
                    if(this.globalVars.startDownloadingFile)
                    {
                        downloadingFile.downloadedCallback = this.globalVars.startDownloadingFile.downloadedCallback;
                        downloadingFile.progressCallback = this.globalVars.startDownloadingFile.progressCallback;
                        downloadingFile.downloadFailed = this.globalVars.startDownloadingFile.downloadFailed;
                    }
                    this.globalVars.startDownloadingFile = downloadingFile;
                    // End #1
                    //console.log("\n\nMedia File: "+ localFile +"\n\n");
                    this.downloader.download(encodeURI(serverPath), localFile, true).then((entry)=>{
                        sLength=0;
                        eLength=0;
                        self.helper.setMetaDataNoBackup(entry);
                        //Update queue items after download finished
                        self.downloadService.setDownloadQueue(self.downloadQueue);
                        
                        //invoke downloaded Callback from another module
                        if(downloadingFile["downloadedCallback"] && typeof downloadingFile["downloadedCallback"] === "function")
                        {
                            downloadingFile["downloadedCallback"](f);
                        }
                        //Processing next file.
                        setTimeout(()=>{self.startDownload()},1000);

                    }).catch(function(error){
                        console.error(error);
                        //invoke downloaded Callback from another module
                        if(downloadingFile["downloadFailed"] && typeof downloadingFile["downloadFailed"] === "function")
                        {
                            downloadingFile["downloadFailed"](f);
                        }
                        self.downloadQueue.push(f);
                        // Process next file
                        setTimeout(()=>{self.startDownload()},1000);

                    });

                    this.downloader.onProgress(function(progressEvent) {
                        if(progressEvent.lengthComputable){
                            eLength = Math.round(progressEvent.loaded*100/(1000*1000))/100;
                            self.downloadedLength = self.downloadedLength - sLength + eLength;
                            sLength=eLength;
                            
                            //Put to previous 
                            if(downloadingFile.progressCallback)
                            {
                                downloadingFile.progressCallback({
                                    total: progressEvent.total,
                                    loaded: progressEvent.loaded
                                })
                            }
                            //
                            if(document.getElementById('downloadedLength'))
                            {
                                document.getElementById('downloadedLength').innerHTML= (Math.round(self.downloadedLength*100)/100).toString();
                            }
                            if(document.getElementById('downloadedPercent'))
                            {
                                let percent = Math.round((self.downloadedLength/self.totalLength)*10000)/100;
                                document.getElementById('downloadedPercent').innerHTML = percent +'%';
                                if(self.downloadedProgress!= Math.round(percent))
                                {
                                    self.downloadedProgress = Math.round(percent);
                                    document.getElementById('circleProgress').setAttribute('class', "c100 p" +self.downloadedProgress);
                                }
                            }

                            //Calculate remaining time
                            if(document.getElementById('remainingTime'))
                            { 
                                let currentTime = new Date().getTime();
                                let downloadedTime = currentTime - self.startDownloadTime;
                                self.remainingTime = Math.round(((self.totalLength -self.downloadedLength) * downloadedTime)/self.downloadedLength);
                                if(Math.round(self.remainingTime/(1000*60))>0)
                                {
                                    document.getElementById('remainingTime').innerHTML = "About "+ Math.round(self.remainingTime/(1000*60)) +" minutes remaining";
                                }
                                else
                                {
                                    document.getElementById('remainingTime').innerHTML = "About "+ Math.round(self.remainingTime/(1000)) +" seconds remaining";
                                }

                            }
                        }
                    });
                })
            }
        }
        else
        {
            this.view.dismiss();
        }
    }

    cancelDownload(){
        if(this.downloader)
        {
            this.downloadService.setDownloadQueue(this.downloadQueue);
            this.downloader.abort();
        }
        this.view.dismiss();
    }

    onDismiss(){
        this.view.dismiss();
    }

    /**
     * Check file is downloading in module
     * Author: DucTM (08-Dec-2016)
     * Params: filename => file name return from Service
     */
    isDownloadingFile(filename){
        if(this.globalVars.reportsDownloading && this.globalVars.reportsDownloading.indexOf(filename) >= 0)
            return true;
        else
            return false;
    }
}
