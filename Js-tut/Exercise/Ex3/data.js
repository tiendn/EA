$(document).ready(function(){
  
  load();
  // init value
  var count = 0 ;
  var lastMonth ="";
  var lastYear ="";
  var isFirstLoad = true; // If the first load.
  //
  var myArr = [];
  var maxLength = 0;
  var data = [];
  var onScrollProcess = false;
  var index30 = "";
  const NUMBER_PER_LOAD = 30;
  var isSearch = false; // If use search function
  var contentSearch = "";
  function load(){
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
    //  Bug ???? Search lai mat group
    // Loop for print to html page
    for (let i = 0 ; i < length; i++){
      let dateClass="";
      let listViewMore="";
      let currentMonth = getMonth(myArr[i].prDateNumeric);
      let currentYear = getYear(myArr[i].prDateNumeric);
      //  time -> Add new li
      // Thiếu đối với trường hợp của tk đầu tiên -> Chưa được nhận class do chưa gán giá trị lastyear,month
      if (currentYear != lastYear)
        listViewMore =  "<li class = 'list-group-item list-more'>"+getNameMonth(currentMonth)+" "+currentYear+"</li>";
      else if (currentYear == lastYear){
        if (currentMonth == lastMonth)
          dateClass = currentMonth+currentYear;
        else
          listViewMore =  "<li class = 'list-group-item list-more'>"+getNameMonth(currentMonth)+" "+currentYear+"</li>";
      }

      // time content
      let time = new Date();
      time = (time.formatTime(myArr[i].prDateNumeric));
      // Print html
      listView += listViewMore+"<li class = 'list-group-item "+ dateClass+"'>"+myArr[i].prTitle+"<br>"+time+"</li>";
      lastMonth = currentMonth;
      lastYear = currentYear;
    }

    // Count the number of results print into html page
    count += length;

    if (!isSearch){
      $('.content-list').append(listView);
    }
    else {
      //  If the first load..
      if (isFirstLoad){
        isFirstLoad = false;
        $('.content-list').html(listView);
      }
      else
        $('.content-list').append(listView);
    }

  }

  // Scroll
  $(window).scroll(function(){
    let value =  Math.abs(($(window).scrollTop() + $(window).height()) - $(document).height());
    if (value <= 60 && !onScrollProcess){
      if (count < maxLength){
        // Filter and get only 30 elements
        if (!isSearch)
          myArr = jQuery.grep(data.slice(count,data.length),checkTime);
        else
          myArr = jQuery.grep(contentSearch.slice(count,contentSearch.length),checkTime);
        //  Update index30
        if (maxLength-count >= NUMBER_PER_LOAD)
          index30 = myArr[NUMBER_PER_LOAD-1].prDateNumeric;
        else
          index30 = myArr[maxLength-count-1].prDateNumeric;
        //  Print html page.
        onScrollProcess = true;
        loadMore();
        onScrollProcess = false;
        //  Count number of results was printed.
        console.log(count);
      }
    }
    // Scroll search ..
    if ($(window).scrollTop() >= 50) {
      $('#searchBox').css("width","100%");
      $('.search-bar').css("top","0px");
      $('.search-bar').css("box-shadow","10px 10px 5px #888888");
    }
    else {
      $('#searchBox').css("width","30%");
      $('.search-bar').css("box-shadow","0px 0px 0px ");
      $('.search-bar').css("top","5px");
    }
  });
  // Reinit some values
  function reinit(){
    count = 0;
    lastYear="";
    lastMonth="";
    isFirstLoad = true;
  }
 //  Search
  function search(data){
    let content = data.prTitle;
    content = content.toLowerCase();
    return content.indexOf(contentSearch) >= 0 ;
  }
  // Enter event
  $( "#searchBox" ).keypress(function(e) {
    if(e.keyCode === 13)
    {
      contentSearch = e.currentTarget.value.toLowerCase();
      // Check length of contentSearch
      if (contentSearch.length == 0 ) {
        isSearch = false;
        reinit();
        $('.content-list').html("");
        load();
      }
      else {
        // Fitler
        var searchResults = data.filter(search);
        if (searchResults.length === 0) {
         // If users not typed anything at here or this value is not existed on data
          alert(" No result! ");
          isSearch = false;
          // Reinit value
          reinit();
          $('.content-list').html("OOPs! No data available!");
          // load();
        }
        else { // ContentSearch != 0 and have results
          // Reinit value
          reinit();
          maxLength = searchResults.length;
          // Don't need this line, because when enter,
          // this search engine will be started without isSearch variable
          isSearch = true;
        // Set first date.
          index30 = searchResults[0].prDateNumeric;
          //  Filter
          myArr = jQuery.grep(searchResults,checkTime);
          // Change last date.
          if (maxLength >= NUMBER_PER_LOAD)
            index30 = myArr[NUMBER_PER_LOAD-1].prDateNumeric;
          else
            index30 = myArr[maxLength-1].prDateNumeric;
          // Load into HTML page/
          $('.content-list').html("Search result");
          loadMore();
        }
      }

    }
  });

});
