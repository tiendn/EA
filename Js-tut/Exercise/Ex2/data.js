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

var myArr = [];    
var count = 0 ;
var listView = "";

function loadJSON(){

	$.getJSON('prdata.json', function (result) {
      console.log(result[2].prTitle);
      myArr = result.slice(count,20+count);
      for (let i = 0 ; i < myArr.length; i++){
         // myArr.push(myArr.prId,myArr.prDateNumeric,myArr.prTitle,myArr.prAttachment);
            listView += "<li class = 'content-list-item'>"+myArr[i].prTitle+"</li>";
      }
      count+=20;
      // $.each(result, function(i, data){
            // var object = JSON.parse
            // myArr.push(data.prId,data.prDateNumeric,data.prTitle,data.prAttachment);
            // count++;
            // listView += "<li class = 'content-list-item'>"+data.prTitle+"</li>";
            
           // if (count % 20 == 0 ) break;
      // });
      $('.content-list').html(listView);
       console.log(count);
      // var items = data.items.map(function (item) {
      //   return item.prTitle + ': ' + item.prId;
      // });

      // showData.empty();

      // if (items.length) {
      //   var content = '<li>' + items.join('</li><li>') + '</li>';
      //   var list = $('<ul />').html(content);
      //   showData.append(list);
      // }
    });

	// do{
	// 	if (count >= data.length ) break;
	// 	listView += "<li class = 'content-list-item'>"+data[count].content+"</li>";
	// 	count++;
	// }
	// while (count % 20 !== 0 );
};
function load(){
  // let arr = [];
  loadJSON();
  console.log(count);
  // do{
  //   // if (count >= myArr.length ) break;
  //   // listView += "<li class = 'content-list-item'>"+myArr[count].content+"</li>";
  //   count++;
  // }
  // while (count % 20 !== 0 );
  // $('.content-list').html(listView);
}
$(window).scroll(function(){
    if ($(window).scrollTop() + $(window).height() == $(document).height() ) {
    	load();
    }
});
