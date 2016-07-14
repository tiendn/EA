var data = [];
data.push({id:0,content:"abcd"});
data.push({id:1,content:"abcd"});
data.push({id:2,content:"abcd"});
data.push({id:3,content:"abcd"});
data.push({id:4,content:"abcd"});
data.push({id:5,content:"abcd"});
data.push({id:6,content:"abcd"});
data.push({id:7,content:"abcd"});
data.push({id:8,content:"abcd"});
data.push({id:9,content:"abcd"});
data.push({id:10,content:"abcd"});
data.push({id:11,content:"abcd"});
data.push({id:12,content:"abcd"});
data.push({id:13,content:"abcd"});
data.push({id:14,content:"abcd"});
data.push({id:15,content:"abcd"});
data.push({id:16,content:"abcd"});
data.push({id:17,content:"abcd"});
data.push({id:18,content:"abcd"});
data.push({id:19,content:"abcd"});
data.push({id:20,content:"abcd"});
data.push({id:21,content:"abcd"});
data.push({id:22,content:"abcd"});
data.push({id:23,content:"abcd"});
data.push({id:24,content:"abcd"});
data.push({id:25,content:"abcd"});
data.push({id:26,content:"abcd"});
data.push({id:27,content:"abcd"});
data.push({id:28,content:"abcd"});
data.push({id:29,content:"abcd"});
data.push({id:30,content:"abcd"});
data.push({id:31,content:"abcd"});
data.push({id:32,content:"abcd"});
data.push({id:33,content:"abcd"});
data.push({id:34,content:"abcd"});
data.push({id:35,content:"abcd"});
data.push({id:36,content:"abcd"});
data.push({id:37,content:"abcd"});
data.push({id:38,content:"abcd"});
data.push({id:39,content:"abcd"});
data.push({id:40,content:"abcd"});
data.push({id:41,content:"abcd"});
data.push({id:42,content:"abcd"});
data.push({id:43,content:"abcd"});
data.push({id:44,content:"abcd"});
data.push({id:45,content:"abcd"});
data.push({id:46,content:"abcd"});
data.push({id:47,content:"abcd"});
data.push({id:48,content:"abcd"});

var count = 0 ;
var listView = "";
function load(){
	do{
		if (count >= data.length ) break;
		listView += "<li class = 'content-list-item'>"+data[count].content+"</li>";
		count++;
	}
	while (count % 20 !== 0 );
	$('.content-list').html(listView);
}
$(window).scroll(function(){
    if ($(window).scrollTop() + $(window).height() == $(document).height() ) {
    	load();
    }
});
