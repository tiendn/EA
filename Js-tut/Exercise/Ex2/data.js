$(document).ready(function(){

  load();
  var myArr = []; 
  var data = [];
  var count = 0 ;
  var listView = "";
  var maxLength = 0;
  var index30 = "";
  var isFirstLoad = true;
  const NUMBER_PER_LOAD = 30;

  //  Convert number time into string time.
  function convertTime(time){
    var month = time.slice(4,6);
    var day = time.slice(6,8);
    var year = time.slice(0,4);
    return day+"/"+month+"/"+year;
  }

  function load(){
    $.getJSON('prdata.json', function (result) {
      // Get data.
      data = result;
      // Get length
      console.log(maxLength = result.length);
      // Set first date.
      index30 = data[0].prDateNumeric.toString();
      //  Filter 
      myArr = data.filter(checkTime);
      // Change last date.
      if (maxLength >= NUMBER_PER_LOAD)
        index30 = myArr[NUMBER_PER_LOAD-1].prDateNumeric.toString();
      else 
        index30 = myArr[maxLength-1].prDateNumeric.toString();
      // Load into HTML page/
      loadMore();
    });
  }
  // Filter date ..
  function checkTime(dataSm){
    // 
    var lastday = convertTime(index30);
    lastday = lastday.split('/');
    lastday = new Date(lastday[2],lastday[1],lastday[0]);

    // Filter all days after lastday
    var nextday = convertTime(dataSm.prDateNumeric.toString());
    nextday = nextday.split('/');
    nextday = new Date(nextday[2],nextday[1],nextday[0]);
    if (isFirstLoad){
      isFirstLoad = false;
      return nextday <= lastday;
    }
    else 
      return nextday < lastday;
  }

  // Load data into page.
  function loadMore(){
    let length = 0;
    // If maxLength of array > 30 then make 30 next elements to print 
    if (count + NUMBER_PER_LOAD <= maxLength){
      length = NUMBER_PER_LOAD;
    }
    // Else take all remain elements.
    else length = maxLength - count  ;

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
    $('.content-list').html(listView);
  }

  // Scroll
  $(window).scroll(function(){
      if ($(window).scrollTop() + $(window).height() == $(document).height() ) {
        if (count < maxLength){
          myArr = data.filter(checkTime);
          if (maxLength-count >= NUMBER_PER_LOAD)
            index30 = myArr[NUMBER_PER_LOAD-1].prDateNumeric.toString();
          else 
            index30 = myArr[maxLength-count-1].prDateNumeric.toString();
          loadMore();
          console.log(count);
        }
      }
  });
});
