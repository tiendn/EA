$(document).ready(function(){
  load();
  var myArr = []; 
  var data = [];
  var count = 0 ;
  var listView = "";
  var maxLength = 0;
  var countPerLoad = 0;
  var index30 = "";
  function convertTime(time){
    var month = time.slice(4,6);
    var day = time.slice(6,8);
    var year = time.slice(0,4);
    return day+"/"+month+"/"+year;
  }

  function load(){
    $.getJSON('prdata.json', function (result) {
      // Get data.
      data=result;
      // Get length
      maxLength = result.length;
      // Set first date.
      index30 = data[0].prDateNumeric.toString();

      //  Filter 
      myArr.push(data.filter(checkTime));

      // Change last date.
      index30 = myArr[0][29].prDateNumeric.toString();
      console.log(myArr[0][0].prDateNumeric + "  " + index30);

      // Load into HTML page/
      loadMore();
    });
  }
  // Filter date ..
  function checkTime(dataSm){
    console.log(index30);
    var lastday = convertTime(index30);
    var nextday = convertTime(dataSm.prDateNumeric.toString());
    // console.log(dataSm.prDateNumeric);
    return nextday <= lastday;
  }

  // Load data into page.
  function loadMore(){
      for (let i = 0 ; i < 30; i++){
        var icon = "" ;
        var time = convertTime(myArr[0][i].prDateNumeric.toString());

        if (myArr[0][i].prAttachment === true)    
          icon = "<img src=\"pr_attachment_icon_iphone_3x.png\" height=\"20px\" width =\"20px\">";
        listView += "<li class = 'content-list-item'>"+icon+"<b>"+time+"</b><br>"+myArr[0][i].prTitle+"</li>";
      }
      $('.content-list').html(listView);
  }
  $(window).scroll(function(){
      if ($(window).scrollTop() + $(window).height() == $(document).height() ) {
        if (count < maxLength){
          // myArr = [];
          // myArr.push(data.filter(checkTime));
          // index30 = myArr[0][29].prDateNumeric.toString();
          // loadMore();
        }
      }
  });
});
