"use strict";
/*! Developed by Illimar Pihlam�e | e-mail: illimar@idra.pri.ee | Euroland Estonia � 2016 | e-mail: illimar@euroland.com */
var CalendarMonthObject = function(_Settings) {
/*
	The month object of the calendar, that will manages one month
*/
	var
		CLASS_NAME = 'Month'
		
		, SUNDAY_INDEX = 0 //The sunday day index
		, MONDAY_INDEX = 1 //The monday day index
		, TUESDAY_INDEX = 2 //The tuesday day index
		, WEDNESDAY_INDEX = 3 //The wednesday day index
		, THURSDAY_INDEX = 4 //The thursday day index
		, FRIDAY_INDEX = 5 //The friday day index
		, SATURDAY_INDEX = 6 //The saturday day index
		
		, KEY_UP_ARROW = 38 //The keycode for the UP ARROW key
		, KEY_DOWN_ARROW = 40 //The keycode for the DOWN ARROW key
		, KEY_LEFT_ARROW = 37 //The keycode for the LEFT ARROW key
		, KEY_RIGHT_ARROW = 39 //The keycode for the RIGHT ARROW key
	;
	
	this.$root = $(document.createElement('div'));	 
	
	/********************************************************************************
	These variables are commented out, because they need to be added using prototype.
	---------------------------------------------------------------------------------
	
	this.Settings = {}
		
	********************************************************************************/
	
	var This = this
		,_DefaultSettings = {
			Phrases : {				
				sunShort : "Sun"
				, monShort : "Mon"
				, tueShort : "Tue"
				, wedShort : "Wed"
				, thuShort : "Thu"
				, friShort : "Fri"
				, satShort : "Sat"
				
				, sunday : "sunday"
				, monday : "monday"
				, tuesday : "tuesday"
				, wednesday : "wednesday"
				, thursday : "thursday"
				, friday : "friday"
				, saturday : "saturday"
				
				, january : "January"
				, february : "February"
				, march : "March"
				, april : "April"
				, may : "May"
				, june : "June"
				, july : "July"
				, august : "August"
				, september : "September"
				, october : "October"
				, november : "November"
				, december : "December"

				, useArrowKeys : 'Use the arrow keys to change the date'
				, startOfPeriod : 'Start of selection period reached'
				, endOfPeriod : 'End of selection period reached'
			}
			, parentClassName : '' //the parent class name name of the parent object that will be appended to this object
			, firstDayOfTheWeek : MONDAY_INDEX //the first day of the week
			, Weekend : [SATURDAY_INDEX, SUNDAY_INDEX] //marks the days that are the weekend
			
			, nextMonthCall : null //the method call for the next month
			, prevMonthCall : null //the method call for the previous month
			, nextYearCall : null //the method call for the next year
			, prevYearCall : null //the method call for the previous year
			
			, daySelectionCall : null //the method that will be called when a day is selected, the Date object is passed to the function
			
			,dateLimitFrom : null //JS Date Object, the date limiter, with limits the calendar to never go bellow this date (allows this date)
			,dateLimitTo : null //JS Date Object, the date limiter, with limits the calendar to never go above this date (allows this date)
		}
		
		,_$table = $(document.createElement('table')) //the table of the month
		,_shortWeekNameArr = [] //the short week names as an array
		,_longWeekNameArr = [] //the long week names as an array
		,_longMonthNameArr = [] //the long month names as an array
		
		,_activeDate = new Date() //the active date of the calendar
		,_activeDayObject = null //the active date object built by "buildDayObject()" method
		
		,_DayButtons = [] //The days as objects as built by the "buildDayObject()" method, is a multi dimensional array reflecting the calendar grid, with rowIndex being the first and cellIndex being the second dimension
		
		,_$doc = $(document) //the jQuery object of the document
		,_hasDocumentKeyDownCall = false //if true the documentKeydown method is binded to the document.keydown event
		
		,_strSelectedDayClass = '' //String, the selected day class
		,_selectedDate = null //Date, the date that is 		
		
		,_hasKeyBoardMovement = true //if FALSE the keyboard i.e. arrow key movement will not work for the active day
		,_hasArrowLabel = false //if TRUE shows that the calendar days have the label explaining the keyboard shortcuts
		
		,_dateLimitFrom = null //JS Date Object, the date limiter, with limits the calendar to never go bellow this date (allows this date)
		,_dateLimitTo = null //JS Date Object, the date limiter, with limits the calendar to never go above this date (allows this date)
		
		,_hasFromDateLimit = false //shows if _dateLimitFrom has been set, so you do not need to do the more expencive "instanceof" check when needed
		,_hasToDateLimt = false //shows if _dateLimitTo has been set, so you do not need to do the more expencive "instanceof" check when needed
	;
	
	function _init() {
		_Settings = $.extend(true, {}
			,_DefaultSettings
			,typeof This.Settings != 'object' ? {} : This.Settings
			,typeof _Settings != 'object' ? {} : _Settings			
		);
		
		if(_Settings.parentClassName.length) {
			CLASS_NAME = _Settings.parentClassName + '-' + CLASS_NAME;
		}
		
		_shortWeekNameArr = [
			_Settings.Phrases.sunShort
			, _Settings.Phrases.monShort
			, _Settings.Phrases.tueShort
			, _Settings.Phrases.wedShort
			, _Settings.Phrases.thuShort
			, _Settings.Phrases.friShort
			, _Settings.Phrases.satShort
		];
		
		_longWeekNameArr = [
			_Settings.Phrases.sunday
			, _Settings.Phrases.monday
			, _Settings.Phrases.tuesday
			, _Settings.Phrases.wednesday
			, _Settings.Phrases.thursday
			, _Settings.Phrases.friday
			, _Settings.Phrases.saturday
		];
		
		_longMonthNameArr = [
			_Settings.Phrases.january
			, _Settings.Phrases.february
			, _Settings.Phrases.march
			, _Settings.Phrases.april
			, _Settings.Phrases.may
			, _Settings.Phrases.june
			, _Settings.Phrases.july
			, _Settings.Phrases.august
			, _Settings.Phrases.september
			, _Settings.Phrases.october
			, _Settings.Phrases.november
			, _Settings.Phrases.december
		];
		
		if(_Settings.dateLimitFrom instanceof Date) {
			_dateLimitFrom = new Date(_Settings.dateLimitFrom.getFullYear(), _Settings.dateLimitFrom.getMonth(), _Settings.dateLimitFrom.getDate());
			_hasFromDateLimit = true;
		}
		
		if(_Settings.dateLimitTo instanceof Date) {
			_dateLimitTo = new Date(_Settings.dateLimitTo.getFullYear(), _Settings.dateLimitTo.getMonth(), _Settings.dateLimitTo.getDate());
			_hasToDateLimt = true;
		}
		
		This.$root.append(_$table);		
		_$table.addClass(CLASS_NAME + '-Table').attr({ role : 'presentation' });
		
		_strSelectedDayClass = CLASS_NAME + '-SelectedDay';
		
		_activeDate = new Date(_activeDate.getFullYear(), _activeDate.getMonth(), _activeDate.getDate());
		
		//buildCalendarMonth();
	}
	
	this.setDateLimit = function(dFrom, dTo, doNotSetMonth) {
	/*
		Allows the client programmer to set the calendars date limit
	*/
		
		if(_Settings.dateLimitFrom instanceof Date) {
			_dateLimitFrom = new Date(dFrom.getFullYear(), dFrom.getMonth(), dFrom.getDate());
			_hasFromDateLimit = true;
		} else {
			_dateLimitFrom = null;
			_hasFromDateLimit = false;
		}
		
		if(dTo instanceof Date) {
			_dateLimitTo = new Date(dTo.getFullYear(), dTo.getMonth(), dTo.getDate());
			_hasToDateLimt = true;
		} else {
			_dateLimitTo = null;
			_hasToDateLimt = false;
		}
		
		if(doNotSetMonth) {
			This.setMonth(_activeDate);
		}		
	}
	
	this.setSelectedDate = function(date, doNotBuildCalendar) {
	/*
		Sets the selected date
		
		date - Date, the Date object of the selected date
		doNotBuildCalendar - [Optional] Boolean, if TRUE the the calendar will not be built
	*/
		_selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		
		if(!doNotBuildCalendar) {
			buildCalendarMonth();
			
			//adds the proper selection for the active day
			_activeDayObject.Button.attr({
				tabIndex : 0
			});	
		}		
	};
	
	this.removeTabIndex = function() {
	/*
		Removes the calendar month object from the tabIndex
	*/
		if(_activeDayObject != null) {
			//adds the proper selection for the active day
			_activeDayObject.Button.attr({
				tabIndex : -1
			});	
		}		
	}
	
	this.addTabIndex = function() {
	/*
		Removes the calendar month object from the tabIndex
	*/
		if(_activeDayObject != null) {
			//adds the proper selection for the active day
			_activeDayObject.Button.attr({
				tabIndex : 0
			});	
		}
	}
	
	this.setMonth = function(date, rowIndex, colIndex) {
	/*
		Sets the Month based on the active date
		
		date - Date, the Date object of the new _activeDate
		rowIndex - [Optional] Integer, the row index of the _activeDate cell
		colIndex - [Optional] Integer, the cell index of the _activeDate cell
		
		Returns TRUE if the month was set to a date with was not limited and FALSE if it was shifted because of date limiters
	*/
		var hasDateBeenLimted = false, obj, errorDate, activeDateYear, activeDateMonth;		
		
		activeDateYear = date.getFullYear();
		activeDateMonth = date.getMonth();
		_activeDate = new Date(activeDateYear, activeDateMonth, date.getDate());
		
		
		if(_dateLimitFrom) {
			if(activeDateYear == _dateLimitFrom.getFullYear() && activeDateMonth == _dateLimitFrom.getMonth()) {
				_activeDate = new Date(activeDateYear, activeDateMonth, _dateLimitFrom.getDate());
				hasDateBeenLimted = true;
			} else if(_activeDate < _dateLimitFrom) {
				_activeDate = new Date(_dateLimitFrom.getFullYear(), _dateLimitFrom.getMonth(), _dateLimitFrom.getDate());
				hasDateBeenLimted = true;
			}			
		}		
		
		if(_dateLimitTo) {
			if(activeDateYear == _dateLimitTo.getFullYear() && activeDateMonth == _dateLimitTo.getMonth()) {
				_activeDate = new Date(activeDateYear, activeDateMonth, 1);
				hasDateBeenLimted = true;
			} else if(_activeDate > _dateLimitTo) {
				_activeDate = new Date(_dateLimitTo.getFullYear(), _dateLimitTo.getMonth(), 1);
				hasDateBeenLimted = true;
			}
		}
		
		buildCalendarMonth();
		
		if(typeof rowIndex == 'number' && typeof colIndex == 'number') {
			
			removeArrowKeysLabel();
			
			if(!hasDateBeenLimted) {
				rowIndex = Math.round(rowIndex);
				colIndex = Math.round(colIndex);

				if(rowIndex < 6 && colIndex < 7) { //sets the active date based on the row and cell index
					
					obj = _DayButtons[rowIndex][colIndex];
					errorDate = obj;
					if(obj.isDisabled) {
						if(_dateLimitTo && obj.date > _dateLimitTo) {
							for(;rowIndex > -1; rowIndex--) {
								for(;colIndex > -1; colIndex--){
									obj = _DayButtons[rowIndex][colIndex];
									if(!obj.isDisabled) {
										break; //stops when valid date is found
									}								
								}	
								
								if(!obj.isDisabled) {
									break; //stops when valid date is found
								}
								
								//resets the colIndex on new line
								colIndex = 5;
							}	
						} else if(_dateLimitFrom && _dateLimitFrom > obj.date) {
							for(;rowIndex < 6; rowIndex++) {
								for(;colIndex < 7; colIndex++){
									obj = _DayButtons[rowIndex][colIndex];
									if(!obj.isDisabled) {
										break; //stops when valid date is found
									}
								}
								
								if(!obj.isDisabled) {									
									break; //stops when valid date is found
								}
								
								//resets the colIndex on new line
								colIndex = 0;
							}
						} 
						
						if(obj.isDisabled) {												
							throw('[CalendarMonthObject].setMonth - no valid date found in month, all dates disabled:' + errorDate.date + ' _dateLimitFrom:' + _dateLimitFrom + ' _dateLimitTo:' + _dateLimitTo);
						}
						
						hasDateBeenLimted = true;
						_activeDate = obj.date;
					}
					
					_activeDayObject = _DayButtons[rowIndex][colIndex];
				}	
			} 
			
		} 
		
		//adds the proper selection for the active day
		_activeDayObject.Button.attr({
			tabIndex : 0
		});
		
		return {
			isLimited : hasDateBeenLimted 
			,date : _activeDayObject.date
		};
	}
	
	this.focusOnActiveDate = function() {
	/*
		Forces the focus onto the activeDate
	*/
		_activeDayObject.Button.focus();
	}
	
	this.preventKeyboardMovement = function() {
	/*
		Prevents the active day to change via keyboard 
	*/
		_hasKeyBoardMovement = false;
	}
	this.enableKeyboardMovement = function() {
	/*
		Allows the active day to change via keyboard 
	*/
		_hasKeyBoardMovement = true;
	}
	
	function documentKeydown(e) {
	/*
		Handles the arrow calendar focus movement
	*/
		var rowIndex = _activeDayObject.rowIndex
			, cellIndex = _activeDayObject.cellIndex
			, moveToNewMonth = false
			, obj, dDate
		;
		
		if(!_hasKeyBoardMovement) {
			return;
		}
		
		//allows only the arrow keys through
		switch(e.which) {
			case KEY_UP_ARROW:
				rowIndex--;
				break;
			case KEY_DOWN_ARROW:
				rowIndex++;
				break;
			case KEY_LEFT_ARROW:
				cellIndex--;
				break;
			case KEY_RIGHT_ARROW:
				cellIndex++;
				break;
			default:
				return;
		}
		
		if(cellIndex < 0) {
			cellIndex = 6;
			rowIndex--;
		}
		if(cellIndex > 6) {
			cellIndex = 0;
			rowIndex++;
		}
		
		if(rowIndex < 0 || rowIndex > 5) {
			moveToNewMonth = true;
		}
		
		if(!moveToNewMonth && (rowIndex != _activeDayObject.rowIndex || cellIndex != _activeDayObject.cellIndex)) {
			obj = _DayButtons[rowIndex][cellIndex];
			if(obj.monthIndex == _activeDayObject.monthIndex) {
				
				if(obj.isDisabled) {
					return;
				}
				
				obj.Button.focus();
				
				obj.Button.attr({
					tabIndex : 0
				});				
				
				_activeDayObject.Button.attr({
					tabIndex : -1
				});				
				
				_activeDayObject = obj;		
			} else {
				moveToNewMonth = true;
			}			
		}
		
		if(moveToNewMonth) {
			
			dDate = new Date(_activeDayObject.date.getFullYear(), _activeDayObject.monthIndex, 1);
			
			switch(e.which) {
				case KEY_UP_ARROW:
					dDate.setMonth(_activeDayObject.monthIndex - 1);
					obj = getNewMonthsGridCoords(dDate);
					
					//shifts the row index so the user will remain on the same week day on the previous years month
					rowIndex = obj.Last.rowIndex;
					if(cellIndex > obj.Last.cellIndex) {
						rowIndex--;
					}
					
					_Settings.prevMonthCall(rowIndex, cellIndex);
					break;
				case KEY_DOWN_ARROW:
					dDate.setMonth(_activeDayObject.monthIndex + 1);
					obj = getNewMonthsGridCoords(dDate);
					
					//shifts the row index so the user will remain on the same week day on the next years month
					rowIndex = obj.First.rowIndex;
					if(cellIndex < obj.First.cellIndex) {
						rowIndex++;
					}
					
					_Settings.nextMonthCall(rowIndex, cellIndex);
					break;
				case KEY_LEFT_ARROW:
					dDate.setMonth(_activeDayObject.monthIndex - 1);
					obj = getNewMonthsGridCoords(dDate);
					
					_Settings.prevMonthCall(obj.Last.rowIndex, obj.Last.cellIndex);
					break;
				case KEY_RIGHT_ARROW:
					dDate.setMonth(_activeDayObject.monthIndex + 1);
					obj = getNewMonthsGridCoords(dDate);
					
					_Settings.nextMonthCall(obj.First.rowIndex, obj.First.cellIndex);
					break;
			}		
		}
		
		return false;
	}
	
	function removeArrowKeysLabel() {
	/*
		Removes the label from the day buttons explaing the keyboard movement
	*/
		var rowIndex, cellIndex, obj, strLabel, limitToTimeStamp, limitFromTimeStamp;
		
		limitFromTimeStamp = _hasFromDateLimit ? _dateLimitFrom.getTime() : null;
		limitToTimeStamp = _hasToDateLimt ? _dateLimitTo.getTime() : null;
		
		if(_hasArrowLabel) {
			_hasArrowLabel = false;
			
			for(rowIndex = 0; rowIndex < 6; rowIndex++) {
				for(cellIndex = 0; cellIndex < 7; cellIndex++) {
					obj = _DayButtons[rowIndex][cellIndex];
					
					strLabel = '';
					
					if(_hasFromDateLimit && obj.timeStamp == limitFromTimeStamp) {
						strLabel += _Settings.Phrases.startOfPeriod + ', ';
					}
					
					if(_hasToDateLimt && obj.timeStamp == limitToTimeStamp) {
						strLabel += _Settings.Phrases.endOfPeriod + ', ';
					}
					
					obj.Button.setLabel(strLabel);
				}
			}
		}		
	}
	
	// function addArrowKeysLabel() {
		
	// }
	
	function getNewMonthsGridCoords(dDate) {
	/*
		Returns the given date's months first and last date's coodrinates on the calendar grid i.e. the row and cell indeces.
		
		dDate - JS Date Object, the date of for with the coordinates are given
	*/
		var rowIndex, cellIndex, index, date, noOfDays, intMonth, intYear, nrOfWeeks, daysInFirstWeek, daysInLastWeek
			, ret = {
				First : {
					rowIndex : 0
					,cellIndex : 0
				}
				,Last : {
					rowIndex : 0
					,cellIndex : 0
				}
			}
			
		;
		
		intMonth = dDate.getMonth()
		intYear = dDate.getFullYear();
		
		//calculates the cell index of the first day
		date = new Date(intYear, intMonth, 1);
		while(date.getDay() != _Settings.firstDayOfTheWeek)
		{
			date.setDate(date.getDate() - 1);
			ret.First.cellIndex++;
		}

		daysInFirstWeek = 7 - ret.First.cellIndex;
		noOfDays = intDaysInMonth(intMonth, intYear);
		nrOfWeeks = Math.floor((noOfDays - daysInFirstWeek) / 7);
		
		//calculates the nr of days in the last week of the month
		daysInLastWeek = noOfDays - (nrOfWeeks * 7) - daysInFirstWeek;
		if(daysInLastWeek < 1) {
			daysInLastWeek = 7;
			nrOfWeeks--;
		}
		
		//calculates the final coordinates of the last day
		ret.Last.cellIndex = daysInLastWeek - 1;
		ret.Last.rowIndex = nrOfWeeks + 1;
		
		return ret;
	}
	
	function buildCalendarMonth() {
	/*
		Builds the month of the active date
	*/
		var activeYear = _activeDate.getFullYear()
			, activeMonth = _activeDate.getMonth()
			, activeDay = _activeDate.getDate()
			
			, selectedYear, selectedMonth, selectedDay
			
			, firstDayOfTheMonth, lastDayOfTheMonth, row, cell, dayIndex, i, j, date, index, obj
			, todayYear, todayMonth, todayDay
			, currentYear, currentMonth, currentDay
			
			, isDisabled
		;
		
		_hasArrowLabel = true;
		
		if(_selectedDate == null) {
			selectedYear = selectedMonth = selectedDay = -1;
		} else {
			selectedYear = _selectedDate.getFullYear();
			selectedMonth = _selectedDate.getMonth();
			selectedDay = _selectedDate.getDate();	
		}	
		
		//creates the empty calendar grid
		_DayButtons = new Array(6);
		index = _DayButtons.length;
		while(index--) {
			_DayButtons[index] = new Array(7);
		}
		
		date = new Date();
		todayYear = date.getFullYear();
		todayMonth = date.getMonth();
		todayDay = date.getDate();
		
		_$table.empty();
		
		firstDayOfTheMonth = new Date(activeYear, activeMonth, 1);
		lastDayOfTheMonth = new Date(activeYear, activeMonth, intDaysInMonth(activeMonth, activeYear));
		
		date = new Date(activeYear, activeMonth, 1); //the date that is used to build the calendar
		
		//builds the weeknames of the month
		row = document.createElement('tr');		
		for(i = 0; i < 7; i++) {
			dayIndex = (_Settings.firstDayOfTheWeek + i ) % 7;
			cell = document.createElement('th');
			cell.innerHTML = _shortWeekNameArr[dayIndex];
			cell.className += CLASS_NAME + "-DayName ";
			row.appendChild(cell);
			
			cell.setAttribute('aria-hidden', 'true');
			cell.setAttribute('role', 'presentation');
			
			//adds the weekend class to the cell
			index = _Settings.Weekend.length;
			while(index--) {
				if(dayIndex == _Settings.Weekend[index]) {
					cell.className += CLASS_NAME + "-DayName-Weekend";
					break;
				}
			}
		}
		
		_$table.append(row);
		
		//rewinds the date so the date will start on the first day of the week
		while(date.getDay() != _Settings.firstDayOfTheWeek)
		{
			date.setDate(date.getDate() - 1);
		}
		
		//builds the calendar grid
		for(i = 0; i < 6; i++)
		{
			row = document.createElement('tr');
			for(j = 0; j < 7; j++)
			{
				cell = document.createElement('td');
				row.appendChild(cell);
				
				cell.className = "";
				
				//adds the weekend class to the cell
				index = _Settings.Weekend.length;
				dayIndex = date.getDay();
				while(index--) {
					if(dayIndex == _Settings.Weekend[index]){
						cell.className += CLASS_NAME + "-Weekend ";
						break;
					}
				}				
				
				if(date < firstDayOfTheMonth || date > lastDayOfTheMonth) {
					if(cell.className.length > 0)
						cell.className += CLASS_NAME + "-WeekendNotActive ";
					cell.className += CLASS_NAME + "-NotActive ";
				}
				
				currentYear = date.getFullYear();
				currentMonth = date.getMonth();
				currentDay = date.getDate();
				
				if(_hasFromDateLimit && _dateLimitFrom && _dateLimitFrom > date || _hasToDateLimt && _dateLimitTo && _dateLimitTo < date) {
					isDisabled = true;
				} else {
					isDisabled = false;
				}
				
				obj = buildDayObject(i, j, date, $(cell), isDisabled);
				
				if(currentDay == todayDay && currentMonth == todayMonth && currentYear == todayYear) {
					cell.className += CLASS_NAME + "-Today ";
				}
								
				if(currentDay == activeDay && currentMonth == activeMonth && currentYear == activeYear) {
					//cell.className += CLASS_NAME + "-Today ";
					_activeDayObject = obj;
				}
				
				if(currentDay == selectedDay && currentMonth == selectedMonth && currentYear == selectedYear) {
					obj.Button.addClass(_strSelectedDayClass);
				}
				
				cell.className += CLASS_NAME + "-Day";
				
				date.setDate(date.getDate() + 1);
			}
			
			_$table.append(row);
		}		
	}
	
	function buildDayObject(rowIndex, cellIndex, date, $cell, isDisabled) {
	/*
		Builds the day object
	*/
		var ret, dayClickCall, dDate, strLabel, dateTimestamp;
		
		dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		dateTimestamp = dDate.getTime();
		
		ret = {
			Button : null
			,rowIndex : rowIndex + 0
			,cellIndex : cellIndex + 0
			,date : dDate			
			,monthIndex : dDate.getMonth()
			,isDisabled : isDisabled
			,timeStamp : dateTimestamp
		};	
		
		dayClickCall = function() {
			
			if(typeof _Settings.daySelectionCall == 'function') {
				_Settings.daySelectionCall(dDate);
			}
		};
		
		strLabel = _Settings.Phrases.useArrowKeys + ', ';		
		
		if(_hasFromDateLimit && dateTimestamp == _dateLimitFrom.getTime()) {
			strLabel += _Settings.Phrases.startOfPeriod + ', ';
		} 
		
		if(_hasToDateLimt && dateTimestamp == _dateLimitTo.getTime()) {
			strLabel += _Settings.Phrases.endOfPeriod + ', ';
		}
		
		ret.Button = new CalendarButtonObject({
			Phrases : {
				hiddenButtonText :  _longMonthNameArr[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear() + ', ' + _longWeekNameArr[date.getDay()]
				,visualButtonText : date.getDate()
				,label : strLabel
			}
			, $root : $cell
			, extraVisualButtonClass : CLASS_NAME + '-DayButton'
			, onClickCall : dayClickCall
			, isDisabled : isDisabled			
		});
		
		_DayButtons[rowIndex][cellIndex] = ret;
		
		ret.Button.focusCall = dateFocus;		
		ret.Button.blurCall = dateBlur;
		
		ret.Button.attr({
			tabIndex : -1
		});
		
		return ret;
	}
	
	function dateFocus() {
		// console.log('Focus' + this.$root[0].innerText);
		if(!_hasDocumentKeyDownCall) {
			_hasDocumentKeyDownCall = true;
			_$doc.bind('keydown', documentKeydown);
		}		
	}
	function dateBlur() {
		// console.log('Blur' + this.$root[0].innerText);
		if(_hasDocumentKeyDownCall) {
			_hasDocumentKeyDownCall = false;
			_$doc.unbind('keydown', documentKeydown);
		}
		
		removeArrowKeysLabel();
	}
	
	function intDaysInMonth(intMonth, intYear) {
	/*
		intMonth - is the Month index of the [Date] object
	*/
		switch(intMonth)
        {
            case 3:
            case 5:
            case 8:
            case 10:
                return 30;
            case 1:
                return 28 + isLeapYear(intYear);
            default:
                return 31;
        }
	}
	
	function isLeapYear(intYear) {
		return ((intYear % 100 != 0) && (intYear % 4 == 0) || (intYear % 400 == 0)); 
	}
	
	_init();
};