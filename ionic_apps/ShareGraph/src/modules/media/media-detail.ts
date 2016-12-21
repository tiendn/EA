import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, PopoverController} from 'ionic-angular';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { File, Transfer, SocialSharing } from 'ionic-native';
import { MediaDownloadPopup } from './media-download-confirm/media-download-confirm';
import { MediaSharePopup } from './media-share/media-share';

@Component({
  templateUrl: 'media-detail.html'
})

export class MediaDetailPage {
    
    donebtn:string;
    downloadbtn:string;
    sharebtn:string;
    downloadCompletedMsg:string;
    isDisconnected:boolean = false;
    MediaList:any[];
    localStorageName:string;
    subFolder:string;
    TabName:string;
    MediaTitle:string;
    MediaName:string;
    isAudio:boolean;
    Time:string;
    isFullScreen:boolean = false;
    Script:string;
    pop:boolean = false;
    currentIndex:number;
    temp:any;
    internetStatusCheckingInterval:any;
    lastDisconnectPosition:number;
    roundedPercentage:number;
    isCompletedBuffering:boolean;
    isPauseAndJustDownloaded:boolean;
    downloaded:boolean;
    justDownloaded:boolean;
    pb1:string;
    pb2:string;
    isDownloading:boolean;
    currentText:string;
    currentRange:number;
    isPlaying:boolean;
    isBuffering:boolean;
    isHasPreviousMediaItem:boolean;
    isHasNextMediaItem:boolean;
    isPortrait:boolean;
    enableDownload:boolean;
    durationText:string;
    durationRange:number;
    defaultIonContentMarginTop:any;
    notFullScreenControlBarHeight:any;
    transfer:any;
    downloadMessage:string;

    constructor(public nav: NavController, public navParams: NavParams, public helper: Helper, public actionSheetController:ActionSheetController, public popoverController:PopoverController, public globalVars: GlobalVars){
      
        this.donebtn = helper.getPhrase('Done','Common');
        this.downloadbtn = helper.getPhrase('Download','Media');
        this.sharebtn = helper.getPhrase('Share','Media');  
        this.downloadCompletedMsg = helper.getPhrase('DownloadCompleted','Media');
    
        this.MediaList = navParams.data.MediaList;
        this.localStorageName = navParams.data.currentTabId;
        this.subFolder = this.localStorageName + '/';
        this.TabName = navParams.data.currentTabName;
        this.MediaTitle = navParams.data.currentItem.Title;
        this.MediaName = navParams.data.currentItem.FileName;
        this.isAudio = navParams.data.currentItem.FileType === 'mp3' ? true : false;
        this.Time = navParams.data.currentItem.Date; 
        this.Script = navParams.data.currentItem.Desc;  
        for(var i=0;i<this.MediaList.length;i++){    
          if(this.MediaList[i].FileName === navParams.data.currentItem.FileName){
            this.currentIndex = i;        
            break;
          }
        }
        this.init();  
    }

    init() :void{
        clearInterval(this.temp);
        clearInterval(this.internetStatusCheckingInterval);
        this.lastDisconnectPosition = 0;
        this.roundedPercentage = -1;
        this.isCompletedBuffering = false;
        this.isPauseAndJustDownloaded = false;
        this.downloaded = false;
        this.justDownloaded = false;
        this.pb1 = '0%';
        this.pb2 = '100%';    
        this.isDownloading = false;
        this.checkDownloadingStatus();
        this.currentText = '00:00';
        this.durationText = '00:00';
        this.currentRange = 0;
        this.isPlaying = false;
        this.isBuffering = true;    
        if(this.MediaList.length === 1){
          this.isHasPreviousMediaItem = false;
          this.isHasNextMediaItem = false;  
        }else{
          if(this.currentIndex === 0){
            this.isHasPreviousMediaItem = false;
            this.isHasNextMediaItem = true;
          }else if(this.currentIndex === this.MediaList.length - 1){
            this.isHasPreviousMediaItem = true;
            this.isHasNextMediaItem = false;
          }else{
            this.isHasPreviousMediaItem = true;
            this.isHasNextMediaItem = true;
          }
        }
        if(this.globalVars.isIOS) window.innerHeight > window.innerWidth ? this.isPortrait = true : this.isPortrait = false;
        else screen.height > screen.width ? this.isPortrait = true : this.isPortrait = false;
    }

    checkDownloadingStatus() :void{
        var n = this.globalVars.mediaDownloadingList.length;
        var index;
        if(n === 0) this.isDownloading = false;
        else{
          for(var i=0;i<n;i++){
            if(this.globalVars.mediaDownloadingList[i].filename === this.MediaName){
              this.isDownloading = true;
              this.enableDownload = false;
              index = i;
              break;
            }
          }
        }
    }

    done():void{
        if(this.isAudio){
          document.getElementsByTagName('audio')[0].pause();
          this.MediaList[this.currentIndex].position = document.getElementsByTagName('audio')[0].currentTime;
        }else{
          document.getElementsByTagName('video')[0].pause();
          this.MediaList[this.currentIndex].position = document.getElementsByTagName('video')[0].currentTime;
        }
        localStorage.setItem(this.localStorageName, JSON.stringify(this.MediaList));
        document.getElementById('mediaDetailEventCatcher').removeEventListener('mediaDownloadComplete', () => {      
        });
        this.pop = true;
        this.nav.pop();
    }

     ionViewWillEnter(){
        if(this.globalVars.startDownloadingFile){
            this.globalVars.startDownloadingFile["progressCallback"] = (data) => {
              let globalDownloadingFile:any = 'xxx';
              if(this.globalVars.startDownloadingFile != undefined){
                let temp = this.globalVars.startDownloadingFile.fileName;
                temp = temp.split('/')[1];  
                let file = temp.split('.')[0];
                let extention = temp.split('.')[1];
                globalDownloadingFile = file+'_'+this.globalVars.startDownloadingFile.etag+'.'+extention;    
              }  
              if(globalDownloadingFile === decodeURI(this.MediaName)){
                this.isDownloading = true; 
                this.enableDownload = false;
                let loaded = Math.round(data.loaded / data.total * 100);
                let remain = 100 - loaded;
                let filename = decodeURI(this.MediaList[this.currentIndex].FileNameWithNoETag);
                if(this.roundedPercentage === -1) this.roundedPercentage = loaded;
                else{
                  if(this.roundedPercentage != loaded){
                    this.roundedPercentage = loaded; 
                    this.downloadMessage = filename + ' - ' + String((data.loaded / 1048576).toFixed(2)) + 'MB '+ this.helper.getPhrase('OutOf','Media') + ' '+ String((data.total / 1048576).toFixed(2)) + 'MB';
                    this.pb1 = loaded+'%';
                    this.pb2 = remain+'%'; 
                  }
                }
              }

            }

            this.globalVars.startDownloadingFile["downloadedCallback"] = (data1) => {
              this.isDownloading = false;
              this.justDownloaded = true;
              this.downloaded = true;    
              this.MediaList[this.currentIndex].downloaded = true;
              localStorage.setItem(this.localStorageName, JSON.stringify(this.MediaList));

              let globalDownloadingFile:any = 'xxx';
              if(this.globalVars.startDownloadingFile != undefined){
                let temp = this.globalVars.startDownloadingFile.fileName;
                temp = temp.split('/')[1];  
                let file = temp.split('.')[0];
                let extention = temp.split('.')[1];
                globalDownloadingFile = file+'_'+this.globalVars.startDownloadingFile.etag+'.'+extention;    
              }   
                    
              if(globalDownloadingFile === decodeURI(this.MediaName) && this.pop === false){  
                this.isDownloading = false;
                this.justDownloaded = true;
                this.downloaded = true;
                this.enableDownload = false;
                if(this.isPlaying === false) this.isPauseAndJustDownloaded = true;
                if(this.isAudio){
                  var a = document.getElementsByTagName('audio')[0].currentTime;  
                  document.getElementsByTagName('audio')[0].pause();
                  this.MediaList[this.currentIndex].position = a;
                  document.getElementsByTagName('audio')[0].src = this.globalVars.appPath+'Media/'+this.subFolder+this.MediaName;
                }else{
                  var a = document.getElementsByTagName('video')[0].currentTime;
                  document.getElementsByTagName('video')[0].pause();
                  this.MediaList[this.currentIndex].position = a;
                  document.getElementsByTagName('video')[0].src = this.globalVars.appPath+'Media/'+this.subFolder+this.MediaName;
                }        
                setTimeout(function(){
                  document.getElementById('downloadCompletedBox').classList.add('fadeOut'); 
                },100);     
              }
            }

            this.globalVars.startDownloadingFile["downloadFailed"] = (data1) => {
              let globalDownloadingFile:any = 'xxx';
              if(this.globalVars.startDownloadingFile != undefined){
                let temp = this.globalVars.startDownloadingFile.fileName;
                temp = temp.split('/')[1];  
                let file = temp.split('.')[0];
                let extention = temp.split('.')[1];
                globalDownloadingFile = file+'_'+this.globalVars.startDownloadingFile.etag+'.'+extention;    
              }                
                if(decodeURI(this.MediaName) === globalDownloadingFile){
                    this.pb1 = '0%';
                    this.pb2 = '100%';   
                    this.isDownloading = false;                
                }
            }
        }
    }


    ionViewDidLoad(){
        document.getElementById('mediaDetailEventCatcher').addEventListener("mediaDownloadComplete", (e:any) => {
          if(e.detail === this.MediaName){
            this.isDownloading = false;
            this.enableDownload = false;
            this.downloaded = true; 
            if(this.isPlaying === false) this.isPauseAndJustDownloaded = true;
            if(this.isAudio === false){
              var a = document.getElementsByTagName('video')[0].currentTime;
              document.getElementsByTagName('video')[0].pause();
              document.getElementsByTagName('video')[0].src = this.globalVars.appPath+'Media/'+this.subFolder+this.MediaName;
              document.getElementsByTagName('video')[0].currentTime = a;
            }else{
              var a = document.getElementsByTagName('audio')[0].currentTime;
              document.getElementsByTagName('audio')[0].pause();
              document.getElementsByTagName('audio')[0].src = this.globalVars.appPath+'Media/'+this.subFolder+this.MediaName;
              document.getElementsByTagName('audio')[0].currentTime = a;
            }        
            setTimeout(function(){
              document.getElementsByClassName('downloadCompletedBox')[0].classList.add('fadeOut'); 
            },100);  
          }
        });
        var audioPlayer = document.getElementsByTagName('audio')[0];
        var videoPlayer = document.getElementsByTagName('video')[0];    
        var x = this;
    
        audioPlayer.addEventListener('timeupdate', () => {
          var now = Math.round(audioPlayer.currentTime);
          x.currentText = x.convertTime(now);
          x.currentRange = audioPlayer.currentTime;
          x.isBuffering = false;
    
          if(!x.isCompletedBuffering && audioPlayer.buffered.length > 0){
            // console.log(audioPlayer.buffered.length);
            let bufferEnd:number = audioPlayer.buffered.end(audioPlayer.buffered.length - 1);
            if(!isNaN(bufferEnd) && !isNaN(audioPlayer.duration)){
              let r:any = (audioPlayer.duration - bufferEnd) / audioPlayer.duration * 100;
              if(r === 0){
                x.isCompletedBuffering = true;
                document.getElementById('bufferRange').parentNode.removeChild(document.getElementById('bufferRange'));
                if(this.globalVars.isIOS) (<HTMLElement> document.getElementById('bufferRange')).style.backgroundColor = '#E7E7E7';
                else (<HTMLElement> document.getElementById('bufferRange')).style.backgroundColor = 'red';
              }else{
                r = r + '%';
                if(document.getElementById('bufferRange') != null){
                  document.getElementById('bufferRange').style.right = r;
                  document.getElementById('bufferRange').style.left = (<HTMLElement>document.getElementsByClassName('range-knob-handle')[0]).style.left;  
                }
              }                  
            } 
          }        
        });
    
        audioPlayer.addEventListener('play',function(){      
          x.isPlaying = true;
        });
        
        audioPlayer.addEventListener('waiting', function(){
          x.isBuffering = true;
        });
    
        audioPlayer.addEventListener('pause',() => {    
          console.log('pause'); 
          if(this.globalVars.isOnline === true){
            // clearInterval(x.interval); 
            x.isPlaying = false;   
            x.isBuffering = false;
          }else{
            x.isDisconnected = true;
            x.internetStatusCheckingInterval = setInterval(() => {
              if(this.globalVars.isOnline === true){
                x.lastDisconnectPosition = audioPlayer.currentTime;
                audioPlayer.src = x.MediaList[x.currentIndex].URL;
                clearInterval(x.internetStatusCheckingInterval);
              }
            }, 1000);
          }
        });
        audioPlayer.addEventListener('ended',() => {    
          console.log('end');  
          // clearInterval(x.interval);      
          x.isPlaying = false; 
          x.isBuffering = false;
          x.currentRange = audioPlayer.duration;
          x.currentText = x.durationText;
          x.MediaList[x.currentIndex].position = 0;   
          localStorage.setItem(x.localStorageName, JSON.stringify(this.MediaList));   
        });
        audioPlayer.addEventListener('loadedmetadata',function(){
          // clearInterval(x.interval);
          x.durationText = x.convertTime(Math.round(audioPlayer.duration));
          x.durationRange = audioPlayer.duration; 
          var t = 0; 
          if(x.MediaList[x.currentIndex].position != undefined && x.MediaList[x.currentIndex].position != 0){
            t = x.MediaList[x.currentIndex].position;
          }            
          if(x.isPauseAndJustDownloaded === false){
            audioPlayer.play();
            if(x.lastDisconnectPosition != 0) audioPlayer.currentTime = x.lastDisconnectPosition;
            else audioPlayer.currentTime = t;
            // audioPlayer.currentTime = t;
          } 
        });
    
        // ===================================================================
      
        videoPlayer.addEventListener('timeupdate',() => {
          var now = Math.round(videoPlayer.currentTime);
          x.currentText = x.convertTime(now);
          x.currentRange = videoPlayer.currentTime;
          x.isBuffering = false;
          if(x.isFullScreen === true)
            if(!document.getElementById('videoButton').classList.contains('fadeOut')) document.getElementById('videoButton').classList.add('fadeOut');
          
          if(!x.isCompletedBuffering && videoPlayer.buffered.length > 0){         
            var bufferEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
            if(!isNaN(bufferEnd) && !isNaN(videoPlayer.duration)){
              let r:any = (videoPlayer.duration - bufferEnd) / videoPlayer.duration * 100;
              if(r === 0){
                x.isCompletedBuffering = true;
                document.getElementById('bufferRange').parentNode.removeChild(document.getElementById('bufferRange'));
                if(this.globalVars.isIOS) (<HTMLElement> document.getElementById('bufferRange')).style.backgroundColor = '#E7E7E7';
                else (<HTMLElement> document.getElementById('bufferRange')).style.backgroundColor = 'red';
              }else{
                r = r + '%';
                if(document.getElementById('bufferRange') != null){
                  document.getElementById('bufferRange').style.right = r;
                  document.getElementById('bufferRange').style.left = (<HTMLElement>document.getElementsByClassName('range-knob-handle')[0]).style.left;  
                }
              }            
            } 
          }        
        });    
    
        videoPlayer.addEventListener('play',function(){
          x.isPlaying = true;
          // var lastMoment = -1;
          if(x.isFullScreen){
            document.getElementById('videoRangeDiv').classList.add('fadeOut');
            document.getElementById('videoButton').classList.add('fadeOut');
          }
        });
    
        videoPlayer.addEventListener('waiting', function(){
          x.isBuffering = true;
          if(x.isFullScreen === true)
            if(document.getElementById('videoButton').classList.contains('fadeOut')) document.getElementById('videoButton').classList.remove('fadeOut');
        });
    
        videoPlayer.addEventListener('pause',() => {
          if(this.globalVars.isOnline === true){
            // clearInterval(x.interval); 
            x.isPlaying = false;   
            x.isBuffering = false;
            if(x.isFullScreen) setTimeout(function(){        
              document.getElementById('videoButton').classList.remove('fadeOut');
              document.getElementById('videoRangeDiv').classList.remove('fadeOut');
            },200);
          }else{
            x.isDisconnected = true;
            x.internetStatusCheckingInterval = setInterval(() => {
              if(this.globalVars.isOnline === true){
                x.lastDisconnectPosition = videoPlayer.currentTime;
                videoPlayer.src = x.MediaList[x.currentIndex].URL;
                clearInterval(x.internetStatusCheckingInterval);
              }
            }, 1000);
          }
        });
    
        videoPlayer.addEventListener('ended',function(){
          // clearInterval(x.interval);      
          x.isPlaying = false; 
          x.isBuffering = false;
          x.currentRange = videoPlayer.duration;
          x.currentText = x.durationText;
          x.MediaList[x.currentIndex].position = 0;
          if(x.isFullScreen){
            document.getElementById('videoButton').classList.remove('fadeOut');
            document.getElementById('videoRangeDiv').classList.remove('fadeOut');  
          }
          localStorage.setItem(x.localStorageName, JSON.stringify(x.MediaList));
        });
    
        videoPlayer.addEventListener('loadedmetadata',function(){
          x.durationText = x.convertTime(Math.round(videoPlayer.duration));
          x.durationRange = videoPlayer.duration; 
          var t = 0; 
          if(x.MediaList[x.currentIndex].position != undefined && x.MediaList[x.currentIndex].position != 0){
            t = x.MediaList[x.currentIndex].position;
          }            
          document.getElementById('videoContainer').style.visibility = 'visible';
          if(!x.isPauseAndJustDownloaded){        
            videoPlayer.play();
            if(x.lastDisconnectPosition != 0) videoPlayer.currentTime = x.lastDisconnectPosition;
            else videoPlayer.currentTime = t;
          }   
        });
    }

    convertTime(totalSecond:number):string{
        if(!isNaN(totalSecond)){
          let minutes:any = Math.floor(totalSecond / 60);
          let seconds = (totalSecond - minutes * 60).toString();
          minutes = minutes.toString();
    
          if(minutes.length < 2) minutes = '0'+minutes;
          if(seconds.length < 2) seconds = '0'+seconds;
          return (minutes+':'+seconds)
        }
    } 

    play(){
        if(this.isBuffering === false){
          if(this.isAudio === true) document.getElementsByTagName('audio')[0].play();
          else document.getElementsByTagName('video')[0].play();
        }
    }
    
    pause(){
        if(this.isBuffering === false){
          if(this.isAudio === true) document.getElementsByTagName('audio')[0].pause();
          else document.getElementsByTagName('video')[0].pause();
        }
    }
    
    showControl(){
        if(this.isFullScreen === true){
          document.getElementById('videoRangeDiv').classList.remove('fadeOut');
          document.getElementById('videoButton').classList.remove('fadeOut');
          setTimeout(function(){
            document.getElementById('videoRangeDiv').classList.add('fadeOut');
            document.getElementById('videoButton').classList.add('fadeOut');
          },100);
        }
    }

    initBufferBar(){
        this.isCompletedBuffering = false;
        var a = document.createElement("div");
        a.setAttribute("id", "bufferRange");
        a.setAttribute("class","range-bar range-bar-active");  
        if(this.globalVars.isIOS){
          a.style.backgroundColor = '#E7E7E7';  
          // if(this.isAudio === false) (<HTMLElement>document.getElementById('videoRange').childNodes[1].childNodes[2]).style.backgroundColor = '#9C9B99';
          // else (<HTMLElement>document.getElementById('audioRange').childNodes[1].childNodes[2]).style.backgroundColor = '#9C9B99';
          if(this.isAudio === false) (<HTMLElement>document.getElementById('videoRange').querySelector(".range-bar-active")).style.backgroundColor = '#9C9B99';
          else (<HTMLElement>document.getElementById('audioRange').querySelector(".range-bar-active")).style.backgroundColor = '#9C9B99';
        }else{
          a.style.backgroundColor = 'red';  
          // if(this.isAudio === false) (<HTMLElement>document.getElementById('videoRange').childNodes[1].childNodes[2]).style.backgroundColor = 'green';
          // else (<HTMLElement>document.getElementById('audioRange').childNodes[1].childNodes[2]).style.backgroundColor = 'green';
          if(this.isAudio === false) (<HTMLElement>document.getElementById('videoRange').querySelector(".range-bar-active")).style.backgroundColor = 'green';
          else (<HTMLElement>document.getElementById('audioRange').querySelector(".range-bar-active")).style.backgroundColor = 'green';
        }     
        // if(this.isAudio === false) document.getElementById('videoRange').childNodes[1].appendChild(a);
        // else document.getElementById('audioRange').childNodes[1].appendChild(a);
        if(this.isAudio === false) document.getElementById('videoRange').querySelector(".range-slider").appendChild(a);
        else document.getElementById('audioRange').querySelector(".range-slider").appendChild(a);
    }

     zoom(){
        if(this.isFullScreen === false) this.isFullScreen = true;
        else{
          this.isFullScreen = false;
        }
        this.resizeVideo();
      }
    
     resizeVideo(){         
        if(this.isAudio === true) return;
        var videoPlayer = document.getElementsByTagName('video')[0]; 
        var w;
        if(this.globalVars.isTablet && !this.isPortrait && this.globalVars.isIOS) w = window.innerWidth;
        else w = screen.width;
        if(this.isPortrait === true && this.isFullScreen === true){
          videoPlayer.style.width = String(w)+'px';
          videoPlayer.style.height = String(window.innerHeight)+'px';
          (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0].childNodes[1]).style.marginTop = '0px';
          (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0]).style.zIndex = '100';
        }
        if(this.isPortrait === true && this.isFullScreen === false){
          videoPlayer.style.width = String(w)+'px';
          videoPlayer.style.height = String(w / 16 * 9)+'px';      
          if(this.defaultIonContentMarginTop != undefined) (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0].childNodes[0]).style.marginTop = this.defaultIonContentMarginTop;
          (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0]).style.zIndex = null;
          (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0].childNodes[1]).style.overflowY ='hidden';
        }
        if(this.isPortrait === false && this.isFullScreen === true){      
          videoPlayer.style.width = String(w)+'px';
          // console.log('w : '+w);
          // console.log('window.innerWidth : '+window.innerWidth);
          // console.log('videoPlayer.style.width : '+videoPlayer.style.width);
          // console.log('screen.width : '+screen.width);
          videoPlayer.style.height = String(window.innerHeight)+'px';
          (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0].childNodes[1]).style.marginTop = '0px';
          (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0]).style.zIndex = '100';
        }
        if(this.isPortrait === false && this.isFullScreen === false){
          var headearHeight = parseInt(this.defaultIonContentMarginTop.split('px')[0]);
          // videoPlayer.style.height = String(window.innerHeight - headearHeight - this.notFullScreenControlBarHeight)+'px';
          // videoPlayer.style.width = String((window.innerHeight - headearHeight - this.notFullScreenControlBarHeight) / 9 * 16)+'px';  
          videoPlayer.style.height = String(window.innerHeight - headearHeight - this.notFullScreenControlBarHeight - 200)+'px';
          videoPlayer.style.width = String((window.innerHeight - headearHeight - this.notFullScreenControlBarHeight - 200) / 9 * 16)+'px';  
    
          if(this.defaultIonContentMarginTop != undefined) (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0].childNodes[0]).style.marginTop = this.defaultIonContentMarginTop;
          (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0]).style.zIndex = null;
          (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0].childNodes[1]).style.overflowY ='visible';
        }
     }

     loadData1(){
        this.initBufferBar();        
        this.MediaName = this.MediaList[this.currentIndex].FileName;
        this.MediaTitle = this.MediaList[this.currentIndex].Title;
        this.Script = this.MediaList[this.currentIndex].Desc;
        this.Time = this.MediaList[this.currentIndex].Date;
        this.isAudio = this.MediaList[this.currentIndex].FileType === 'mp3' ? true : false;        
        var f = false, x = this;
        for(var i=0;i<this.globalVars.mediaDownloadingList.length;i++)
          if(this.globalVars.mediaDownloadingList[i].filename === this.MediaName){
            f = true;
            break;
          } 

        let globalDownloadingFile:any = 'xxx';
        if(this.globalVars.startDownloadingFile != undefined){
          let temp = this.globalVars.startDownloadingFile.fileName;
          temp = temp.split('/')[1];  
          let file = temp.split('.')[0];
          let extention = temp.split('.')[1];
          globalDownloadingFile = file+'_'+this.globalVars.startDownloadingFile.etag+'.'+extention;  
          if(decodeURI(this.MediaName) === globalDownloadingFile) f = true;  
        }  
          
        // console.log('***********************');
        // console.log(this.MediaName);
        // console.log(globalDownloadingFile);

        if(f === true){
          if(this.isAudio === false) document.getElementsByTagName('video')[0].src = this.MediaList[this.currentIndex].URL; 
          else document.getElementsByTagName('audio')[0].src = this.MediaList[this.currentIndex].URL;
          console.log('remote');
          this.downloaded = false; 
          this.enableDownload = true;
        }else{
          if(this.isAudio){
            File.checkFile(this.globalVars.appPath+'Media/'+this.subFolder, this.MediaName).then(function(){
              document.getElementsByTagName('audio')[0].src = x.globalVars.appPath+'Media/'+x.subFolder+x.MediaName;
              console.log('local');
              x.downloaded = true; 
              x.enableDownload = false;
            }).catch(function(){
              // console.log(x.helper.getPhrase("MsgNoDataAvailableOfflineMode","Common"));
              x.temp = setInterval(function(){
                if(x.globalVars.isOnline === true){
                  document.getElementsByTagName('audio')[0].src = x.MediaList[x.currentIndex].URL; 
                  console.log('remote');
                  x.downloaded = false; 
                  x.enableDownload = true;
                  clearInterval(x.temp);
                }else document.getElementsByTagName('audio')[0].src = ''; 
              },1000);
            });
          }else{
            this.isFullScreen = false;
            this.notFullScreenControlBarHeight = (<HTMLElement>document.getElementsByClassName('videoControl')[0]).offsetHeight;
            this.defaultIonContentMarginTop = (<HTMLElement>document.getElementsByClassName('mediaDetailContent')[0].childNodes[0]).style.marginTop;
            this.resizeVideo();      
            File.checkFile(this.globalVars.appPath+'Media/'+this.subFolder, this.MediaName).then(function(){
              document.getElementsByTagName('video')[0].src = x.globalVars.appPath+'Media/'+x.subFolder+x.MediaName;     
              console.log('local');
              x.downloaded = true; 
              x.enableDownload = false;
            }).catch(function(){  
              x.temp = setInterval(function(){
                if(x.globalVars.isOnline === true){
                   document.getElementsByTagName('video')[0].src = x.MediaList[x.currentIndex].URL;
                   console.log(x.MediaList[x.currentIndex].URL);       
                   console.log('remote');
                   x.downloaded = false; 
                   x.enableDownload = true;
                   clearInterval(x.temp);
                }else document.getElementsByTagName('video')[0].src = ''; 
              },1000);
            });
          }
        }
     }

    ionViewDidEnter(){
        this.loadData1();
        var x = this;
        window.addEventListener('orientationchange', () => {    
          if(!this.globalVars.isIOS){
            setTimeout(()=>{        
              screen.height > screen.width ? x.isPortrait = true : x.isPortrait = false;          
              x.resizeVideo();
            },300);
          }else{
            setTimeout(()=>{        
              if(window.orientation === 0 || window.orientation === 180){
                x.isPortrait = true;
              }else{
                x.isPortrait = false;
              }           
              x.resizeVideo();
            },300);
          }      
        });    
     }

       showDownloadPopup(event){
          if(this.globalVars.isTablet){
            var headerPiece = this.helper.getPhrase('Download','Media');
            var notification = this.helper.getPhrase('DownloadNotification','Media');
            var yes = this.helper.getPhrase('Yes','Media');
            var no = this.helper.getPhrase('No','Media');
            var filename = decodeURI(this.MediaList[this.currentIndex].FileNameWithNoETag);
            var scope = this;
            let popover = this.popoverController.create(MediaDownloadPopup,{
                'scope':scope,
                'headerPiece' : headerPiece,
                'notification': notification,
                'yes': yes,
                'no': no,
                'filename': filename
            },{
              'cssClass':'mediaTabletDownloadPopup'
            });
            popover.present({
                ev: event
            });
          }else{
            let actionSheet = this.actionSheetController.create({      
            buttons: [
              {
                text: this.helper.getPhrase('Download','Media'),
                handler: () => {
                  this.startDownload();
                }
              },{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          actionSheet.present();
          }     
        }
      
        deleteOutdatedFile(medianame){
          var x = this;
      
          var temp = medianame.split('.')[0];
          var jusfilename_new = temp.split('_')[0];
          var etag_new = temp.split('_')[1];
          var foldername = this.localStorageName;
          File.listDir(this.globalVars.appPath+'Media/', foldername).then(function(entry){
            for(var i=0;i<entry.length;i++){
              temp = entry[i].name.split('.')[0];
              var jusfilename_old = temp.split('_')[0];
              var etag_old = temp.split('_')[1];
              if(jusfilename_new === jusfilename_old && etag_new != etag_old){
                File.removeFile(x.globalVars.appPath+'Media/'+x.subFolder, entry[i].name).then(function(){}).catch(function(){});
                break;
              }  
            }
          });
      }


      startDownload(){    
            this.isDownloading = true; 
            this.enableDownload = false;   
            this.transfer = new Transfer(); 
            var currentIndex = this.currentIndex;
            var x = this;    
            
            this.deleteOutdatedFile(this.MediaName);
            var src;
            if(this.isAudio) src = document.getElementsByTagName('audio')[0].src;
            else src = document.getElementsByTagName('video')[0].src;
            
            var downloadObj = {
              filename:this.MediaName,
              loaded:0,
              total:0,
              downloadingHandler:this.transfer
            };
            this.globalVars.mediaDownloadingList.push(downloadObj);
            console.log(this.MediaName);
            /*
            file.downloadedCallback = function(f){

            }*/
            
            this.transfer.download(src, this.globalVars.appPath + "Media/"+this.subFolder + this.MediaName, true).then(function(entry){      
              for(var i=0;i<x.globalVars.mediaDownloadingList.length;i++)
                if(x.globalVars.mediaDownloadingList[i].filename === downloadObj.filename){
                  x.globalVars.mediaDownloadingList.splice(i,1);
                  break;
                }  
        
              x.helper.setMetaDataNoBackup(entry);
              x.isDownloading = false;
              x.justDownloaded = true;
              x.downloaded = true;    
              x.MediaList[currentIndex].downloaded = true;
              localStorage.setItem(x.localStorageName, JSON.stringify(x.MediaList));
                    
              if(downloadObj.filename === x.MediaName && x.pop === false){  
                x.isDownloading = false;
                x.justDownloaded = true;
                x.downloaded = true;
                x.enableDownload = false;
                if(x.isPlaying === false) x.isPauseAndJustDownloaded = true;
                if(x.isAudio){
                  var a = document.getElementsByTagName('audio')[0].currentTime;  
                  document.getElementsByTagName('audio')[0].pause();
                  x.MediaList[currentIndex].position = a;
                  document.getElementsByTagName('audio')[0].src = x.globalVars.appPath+'Media/'+x.subFolder+x.MediaName;
                }else{
                  var a = document.getElementsByTagName('video')[0].currentTime;
                  document.getElementsByTagName('video')[0].pause();
                  x.MediaList[currentIndex].position = a;
                  document.getElementsByTagName('video')[0].src = x.globalVars.appPath+'Media/'+x.subFolder+x.MediaName;
                }        
                setTimeout(function(){
                  document.getElementById('downloadCompletedBox').classList.add('fadeOut'); 
                },100);     
              }else{
                var event = new CustomEvent('mediaDownloadComplete',{'detail':downloadObj.filename});
                if(document.getElementById('mediaDetailEventCatcher') != null) document.getElementById('mediaDetailEventCatcher').dispatchEvent(event); 
              }      
                  
            }).catch(function(){
              x.isDownloading = false;
              x.downloaded = false;    
              x.enableDownload = true;
              x.transfer.abort();
              for(var i=0;i<this.globalVars.mediaDownloadingList.length;i++)
                if(this.globalVars.mediaDownloadingList[i].filename === downloadObj.filename){
                  this.globalVars.mediaDownloadingList.splice(i,1);
                  break;
                } 
            });
            this.transfer.onProgress((progressEvent) => { 
              downloadObj.loaded = progressEvent.loaded;
              downloadObj.total = progressEvent.total; 
              var loaded = Math.round(progressEvent.loaded / progressEvent.total * 100);
              var remain = 100 - loaded;
              var filename = decodeURI(this.MediaList[this.currentIndex].FileNameWithNoETag);
              if(x.pop === false){
                if(x.MediaName === downloadObj.filename){          
                  if(x.roundedPercentage === -1) x.roundedPercentage = loaded;
                  else{
                    if(x.roundedPercentage != loaded){
                      x.roundedPercentage = loaded; 
                      x.downloadMessage = filename + ' - ' + String((progressEvent.loaded / 1048576).toFixed(2)) + 'MB '+ x.helper.getPhrase('OutOf','Media') + ' '+ String((progressEvent.total / 1048576).toFixed(2)) + 'MB';
                      x.pb1 = loaded+'%';
                      x.pb2 = remain+'%'; 
                    }
                  }
                }  
              }else{
                if(document.getElementById('downloadMessage') != null){
                  document.getElementById('downloadMessage').innerHTML = filename + ' - ' + String((progressEvent.loaded / 1048576).toFixed(2)) + 'MB '+ x.helper.getPhrase('OutOf','Media') + ' '+ String((progressEvent.total / 1048576).toFixed(2)) + 'MB';
                  (<HTMLElement>document.getElementsByClassName('progressBar1')[0]).style.width = loaded+'%';
                  (<HTMLElement>document.getElementsByClassName('progressBar2')[0]).style.width = remain+'%';
                }
              }
            });   
      }

      showSharePopup(event){
            let scope = this;
            let actionSheet = this.actionSheetController.create({ 
              buttons: [
                {
                  text: 'Facebook',               
                  icon: 'irapp-share-facebook',
                  handler: () => {            
                    scope.shareWithFacebook();
                  }
                },
                {
                  text: 'Twitter',
                  icon: 'irapp-share-twitter',
                  handler: () => {
                    scope.shareWithTwitter();
                  }
                },
                {
                  text: 'Mail',
                  icon: 'irapp-share-email',
                  handler: () => {  
                    scope.shareWithEmail();
                  }
                },
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                }
              ]
            });   
            let popover = this.popoverController.create(MediaSharePopup,{'scope':scope},{'cssClass':'mediaTabletSharePopup'});

            if(this.globalVars.isTablet && !this.globalVars.isIOS){

            }
            if(!this.globalVars.isTablet && this.globalVars.isIOS){
              actionSheet.present();
              setTimeout(function(){
                (<HTMLElement>document.getElementsByClassName('action-sheet-group')[0]).style.display = 'flex';
                // document.getElementsByClassName('action-sheet-group')[0].style.width = '100vw';
                (<HTMLElement>document.getElementsByClassName('action-sheet-group')[0]).style.paddingBottom = '1vh';
                var x = document.getElementsByClassName('action-sheet-icon');
                for(var i=0;i<x.length;i++){             
                  (<HTMLElement>x[i]).style.margin = "0px 0px 5px 0px";
                  (<HTMLElement>x[i].parentNode).style.display = "flex";
                  (<HTMLElement>x[i].parentNode).style.flexDirection  = "column";
                  x[i].classList.add('irapp-icon');
                  (<HTMLElement>document.getElementsByClassName('action-sheet-wrapper')[0]).style.margin = "0px 0px 0px 0px"
                }
                var y = document.getElementsByClassName('action-sheet-button');
                for(var i=0;i<y.length;i++){
                  if(!y[i].classList.contains('action-sheet-cancel')){
                    (<HTMLElement>y[i]).style.color = 'grey';
                    (<HTMLElement>y[i]).style.fontSize = '12px';
                    (<HTMLElement>y[i]).style.borderBottom = '0px';
                  }
                }
              },100); 
            }

            if(this.globalVars.isTablet && this.globalVars.isIOS){
                popover.present({
                  ev: event
                });
            }

            if(!this.globalVars.isTablet && !this.globalVars.isIOS){

            }


          }
        
          shareWithFacebook(){
            SocialSharing.shareViaFacebook(this.helper.getConfigData("common","companyname", true)+' - '+this.TabName+' - '+this.Time+' - '+decodeURI(this.MediaList[this.currentIndex].FileNameWithNoETag), null, this.MediaList[this.currentIndex].URL);
          }
        
          shareWithLinkedIn(){
            
          }
        
          shareWithTwitter(){
            SocialSharing.shareViaTwitter(this.helper.getConfigData("common","companyname", true)+' - '+this.TabName+' - '+this.Time+' - '+decodeURI(this.MediaList[this.currentIndex].FileNameWithNoETag), null, this.MediaList[this.currentIndex].URL);
          }
        
          shareWithEmail(){
            var companyName = this.helper.getConfigData("common","companyname", true);
            var appName = this.helper.getConfigData("common", "appname", true);
            var subjectEmail = companyName + " - " + decodeURI(this.MediaList[this.currentIndex].FileNameWithNoETag);
            var hrefAttr = "http://www.euroland.com/?selectlanguage=" + this.helper.getLanguageName();
            var appUrl = this.globalVars.isIOS ? this.helper.getConfigData("shareviaemail", "itunesappurl") : this.helper.getConfigData("shareviaemail", "androidappurl");
            var bodyEmail = '<bdo dir="auto">'+this.Time+'</bdo><br/><br/>';
            bodyEmail += '<a href="'+this.MediaList[this.currentIndex].URL+'"><bdo dir="auto">'+decodeURI(this.MediaList[this.currentIndex].FileNameWithNoETag)+'</bdo></a>';
            bodyEmail += '<br/><br/>';
            bodyEmail += '<bdo dir="auto">'+this.helper.getPhrase("Follow","Calendar") + " " + companyName+'</bdo><br/><br/>';
            bodyEmail += '<bdo dir="auto">'+this.helper.getPhrase("DownloadApp", "ShareViaEmail").replace("[appname]", appName)+'</bdo><br/>';
            bodyEmail += '<bdo dir="auto"><a href="'+appUrl+'">'+appUrl+'</a></bdo><br/><br/>';
            bodyEmail += '<div style="color:#97969;padding-top:30px;font-size:14px;"><bdo dir="auto">'+appName+' '+this.helper.getPhrase("Footer", "ShareViaEmail").replace('[euroland.com]', '<a href="' + hrefAttr + '" class="ui-link">Euroland.com</a>')+'</bdo></div><br/>';
            
            if(this.globalVars.isIOS){
                var imgUrl = this.globalVars.serviceBaseUrl + "company" + "/" + this.globalVars.configData.companycode.toLowerCase() + "/appicon.png";
                bodyEmail += "<img style='display:table-cell;' src='" + imgUrl + "' width='60px' height='60px' border=0></img>";
                window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
            }
            else
                SocialSharing.shareViaEmail(bodyEmail, subjectEmail, []);
      }

      listenPreviousMediaItem(){
            if(this.isAudio){
              document.getElementsByTagName('audio')[0].pause();
              this.MediaList[this.currentIndex].position = document.getElementsByTagName('audio')[0].currentTime;
            }else{
              document.getElementsByTagName('video')[0].pause();
              this.MediaList[this.currentIndex].position = document.getElementsByTagName('video')[0].currentTime;
            }
            this.initBufferBar();
            this.currentIndex--;
        
            this.MediaName = this.MediaList[this.currentIndex].FileName;
            this.MediaTitle = this.MediaList[this.currentIndex].Title;
            this.Script = this.MediaList[this.currentIndex].Desc;
            this.Time = this.MediaList[this.currentIndex].Date;
            this.isAudio = this.MediaList[this.currentIndex].FileType === 'mp3' ? true : false;
        
            this.init();   
            
            if(!this.isAudio && this.isFullScreen) this.zoom(); 
            this.loadData1();
      }
        
      listenNextMediaItem(){
            if(this.isAudio){
              document.getElementsByTagName('audio')[0].pause();
              this.MediaList[this.currentIndex].position = document.getElementsByTagName('audio')[0].currentTime;
            }else{
              document.getElementsByTagName('video')[0].pause();
              this.MediaList[this.currentIndex].position = document.getElementsByTagName('video')[0].currentTime;
            }
            this.initBufferBar();
            this.currentIndex++;   
            
            this.MediaName = this.MediaList[this.currentIndex].FileName;
            this.MediaTitle = this.MediaList[this.currentIndex].Title;
            this.Script = this.MediaList[this.currentIndex].Desc;
            this.Time = this.MediaList[this.currentIndex].Date;
            this.isAudio = this.MediaList[this.currentIndex].FileType === 'mp3' ? true : false;
        
            this.init();   
            
            if(!this.isAudio && this.isFullScreen) this.zoom(); 
            this.loadData1();
      }
        
      setCurrentTime(event){ 
            if(this.isAudio === false){
              if(this.isFullScreen === true)   
                if(document.getElementById('videoRangeDiv').classList.contains('fadeOut')) document.getElementById('videoRangeDiv').classList.remove('fadeOut');
              if(this.isPlaying === false){      
                document.getElementsByTagName('video')[0].currentTime = event.value;
              }else{    
                document.getElementsByTagName('video')[0].pause();    
                document.getElementsByTagName('video')[0].currentTime = event.value;    
                document.getElementsByTagName('video')[0].play();
              }
            }else{
              if(this.isPlaying === false){      
                document.getElementsByTagName('audio')[0].currentTime = event.value;
              }else{    
                document.getElementsByTagName('audio')[0].pause();    
                document.getElementsByTagName('audio')[0].currentTime = event.value;    
                document.getElementsByTagName('audio')[0].play();
              }
            }
      }
        
      stopDownload(){
        let globalDownloadingFile:any = 'xxx';
        if(this.globalVars.startDownloadingFile != undefined){
          let temp = this.globalVars.startDownloadingFile.fileName;
          temp = temp.split('/')[1];  
          let file = temp.split('.')[0];
          let extention = temp.split('.')[1];
          globalDownloadingFile = file+'_'+this.globalVars.startDownloadingFile.etag+'.'+extention; 
        }

        if(decodeURI(this.MediaName) === globalDownloadingFile){
              this.globalVars.startDownloadingFile.downloader.abort();
        }else{     
              this.transfer.abort();
              for(var i=0;i<this.globalVars.mediaDownloadingList.length;i++)
                if(this.globalVars.mediaDownloadingList[i].filename === this.MediaName){
                  this.globalVars.mediaDownloadingList.splice(i,1);
                  break;
                } 
        }
        this.pb1 = '0%';
        this.pb2 = '100%';   
        this.isDownloading = false;
        this.enableDownload = true;
      }


}