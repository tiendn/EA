$(document).ready(function(){
  load();
  Date.prototype.formatTime = function(time) {
   time = time.toString();
   var month = time.slice(4,6);
   var day = time.slice(6,8);
   var year = time.slice(0,4);
   switch(Number(day)){
    case 1 : day += "st";
            break;
    case 2 : day += "nd";
            break;
    case 1 : day += "rd";
            break;   
    default : day += "th";
            break;                     
   }
   switch(Number(month)){
     case 1 : month = "January";
             break;
     case 2 : month = "February";
             break;
     case 3 : month = "March";
             break;        
     case 4 : month = "April";
             break;
     case 5 : month = "May";
             break;
     case 6 : month = "June";
             break;
     case 7 : month = "July";
             break;        
     case 8 : month = "August";
             break;
     case 9 : month = "September";
             break;
     case 10 : month = "Octorber";
             break;
     case 11 : month = "November";
             break;        
     case 12 : month = "December";
             break;               
   }
   return day+" "+month+","+year;
 }
 //  Convert number time into string time.
 var date = new Date();
 console.log(date.formatTime(20160511065716));


  var myArr = []; 
  var data = [];
  var count = 0 ;
  
  var maxLength = 0;
  var index30 = "";
  var isFirstLoad = true;
  const NUMBER_PER_LOAD = 30;

  var today = new Date();
  //  Convert number time into string time.
  function convertTime(time){
    var month = time.slice(4,6);
    var day = time.slice(6,8);
    var year = time.slice(0,4);
    return day+"/"+month+"/"+year;
  }
  Date.prototype.format = function(time){
    return convertTime(time);
  }
  function load(){
   // JSONP..
    $.ajax({
      url: "http://10.10.15.234/pr/prData.json",
      dataType: "jsonp",
      jsonp: "callback",
      jsonpCallback: "callbackFn",
      method: "GET",
      success: function(result){
        console.log("dsfdsf");
        // Get data.
        data = result;
        // Get length
        maxLength = result.length;
        // Set first date.
        index30 = data[0].prDateNumeric;
        //  Filter 
        myArr = jQuery.grep(data,checkTime);
        // Change last date.
        if (maxLength >= NUMBER_PER_LOAD)
          index30 = myArr[NUMBER_PER_LOAD-1].prDateNumeric;
        else 
          index30 = myArr[maxLength-1].prDateNumeric;
        // Load into HTML page/
        loadMore();
      },
      error: function(a,b){
        console.log("error");
      }
    });


    //  JSON.
    $.getJSON('prdata.json',function(result){
      data = result;
        // Get length
        maxLength = result.length;
        // Set first date.
        index30 = data[0].prDateNumeric;
        //  Filter 
        myArr = jQuery.grep(data,checkTime);
        // Change last date.
        if (maxLength >= NUMBER_PER_LOAD)
          index30 = myArr[NUMBER_PER_LOAD-1].prDateNumeric;
        else 
          index30 = myArr[maxLength-1].prDateNumeric;
        // Load into HTML page/
        loadMore();
      });
 
  }
  // Filter date ..
  function checkTime(n,i){
    // Get 30 first elements
    if ( i < 30 ){
      if (isFirstLoad){
        isFirstLoad = false;
        return n.prDateNumeric <= index30;
      }
      else 
        return n.prDateNumeric < index30;
    }
    else
      return null;
  }

  // Load data into page.
  function loadMore(){
    let length = myArr.length;
    var listView = "";
    // Loop for print to html page
    for (let i = 0 ; i < length; i++){
      let icon = "" ;
      let time = convertTime(myArr[i].prDateNumeric.toString());
      if (myArr[i].prAttachment === true)    
        icon = "<img src=\"pr_attachment_icon_iphone_3x.png\" height=\"20px\" width =\"20px\">";
      listView += "<li class = 'content-list-item'>"+icon+"<b>"+time+"</b><br>"+myArr[i].prTitle+"</li>";
    }
    // Count the number of results print into html page
    count += length;
    $('.content-list').append(listView);
  }

  // Scroll
  $(window).scroll(function(){
      if ($(window).scrollTop() + $(window).height() == $(document).height() ) {
        if (count < maxLength){
          // Filter and get only 30 elements
          myArr = jQuery.grep(data.slice(count,data.length),checkTime);
          //  Update index30
          if (maxLength-count >= NUMBER_PER_LOAD)
            index30 = myArr[NUMBER_PER_LOAD-1].prDateNumeric;
          else 
            index30 = myArr[maxLength-count-1].prDateNumeric;
          //  Print html page.
          loadMore();
          //  Count number of results was printed.
          console.log(count);
        }
      }
  });
});
