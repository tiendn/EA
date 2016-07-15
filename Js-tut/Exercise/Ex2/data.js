// var data = [];
// data.push({id:0,content:"abcd"});
// data.push({id:1,content:"abcd"});
// data.push({id:2,content:"abcd"});
// data.push({id:3,content:"abcd"});
// data.push({id:4,content:"abcd"});
// data.push({id:5,content:"abcd"});
// data.push({id:6,content:"abcd"});
// data.push({id:7,content:"abcd"});
// data.push({id:8,content:"abcd"});
// data.push({id:9,content:"abcd"});
// data.push({id:10,content:"abcdefg"});
// data.push({id:11,content:"abcdefg"});
// data.push({id:12,content:"abcdefg"});
// data.push({id:13,content:"abcdefg"});
// data.push({id:14,content:"abcdefg"});
// data.push({id:15,content:"abcdefg"});
// data.push({id:16,content:"abcdefg"});
// data.push({id:17,content:"abcdefg"});
// data.push({id:18,content:"abcdefg"});
// data.push({id:19,content:"abcd"});
// data.push({id:20,content:"abcdefg"});
// data.push({id:21,content:"abcd"});
// data.push({id:22,content:"abcdefg"});
// data.push({id:23,content:"abcd"});
// data.push({id:24,content:"abcd"});
// data.push({id:25,content:"abcd"});
// data.push({id:26,content:"abcdefg"});
// data.push({id:27,content:"abcd"});
// data.push({id:28,content:"abcd"});
// data.push({id:29,content:"abcd"});
// data.push({id:30,content:"abcd"});
// data.push({id:31,content:"abcd"});
// data.push({id:32,content:"abcd"});
// data.push({id:33,content:"abcd"});
// data.push({id:34,content:"abcd"});
// data.push({id:35,content:"abcd"});
// data.push({id:36,content:"abcd"});
// data.push({id:37,content:"abcd"});
// data.push({id:38,content:"abcd"});
// data.push({id:39,content:"abcd"});
// data.push({id:40,content:"abcd"});
// data.push({id:41,content:"abcdefg"});
// data.push({id:42,content:"abcd"});
// data.push({id:43,content:"abcdefg"});
// data.push({id:44,content:"abcd"});
// data.push({id:45,content:"abcdefg"});
// data.push({id:46,content:"abcd"});
// data.push({id:47,content:"abcdefg"});
// data.push({id:48,content:"abcd"});
 // {
 //    "prId": 3200086,
 //    "prDateNumeric": 20160329121757,
 //    "prTitle": "Major shareholder announcement – BlackRock, Inc.",
 //    "prAttachment": true
 //  },
var myArr = [];    
var count = 0 ;
var listView = "";
function convertTime(time){
  var month = time.slice(4,6);
  var day = time.slice(6,8);
  var year = time.slice(0,4);
  return day+"/"+month+"/"+year;
}

function load(){
  $.getJSON('prdata.json', function (result) {
      myArr = result.slice(count,20+count);
      for (let i = 0 ; i < myArr.length; i++){
        var icon = "" ;
        var time = convertTime(myArr[i].prDateNumeric.toString());
        // console.log(time);
        if (myArr[i].prAttachment === true)    
          icon = "<img src=\"pr_attachment_icon_iphone_3x.png\" height=\"10px\" width =\"10px\">";
        // console.log(myArr[i].prTitle.indexOf('-'));
        var x = myArr[i].prTitle.indexOf('-');
        if(x !== -1){
          myArr[i].prTitle[x] = '&oline;';
        }
        listView += "<li class = 'content-list-item'>"+icon+"<b>"+time+"</b><br>"+myArr[i].prTitle+"</li>";
      }
      count+=20;
     
      $('.content-list').html(listView);
       console.log(count);
      
    });
}
$(window).scroll(function(){
    if ($(window).scrollTop() + $(window).height() == $(document).height() ) {
    	load();
    }
});
