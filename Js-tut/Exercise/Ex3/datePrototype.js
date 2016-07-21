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
   month = getNameMonth(month);
   return month+" "+day+", "+year;
 }


//  Convert number time into string time.
function getMonth(time){
  time = time.toString();
  var month = time.slice(4,6);
  
  return month;
}
function getNameMonth(month){
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
  return month;
}
function getYear(time){
  time = time.toString();
  var year = time.slice(0,4);
  return year;
}