"use strict";
/*! Developed by Illimar Pihlamäe | e-mail: illimar@idra.pri.ee | Euroland Estonia © 2016 | e-mail: illimar@euroland.com */
var CalendarObject = function(_Settings) {
/*
	Generates and maintains the WAI-ARIA Calendar object i.e. basic navigation 
*/
	var
		CLASS_NAME = 'Euroland-CommonObjects-Calendar'
		
		,INSTANSE_NR = 0 //shows with instance of the calendar this is
		
		, ANIMATE_MONTHS_NONE = 0 //animation indicator, shows that the month should not be animated 
		, ANIMATE_MONTHS_FROM_LEFT = 1 //animation indicator, shows that the month animation will move from left to right
		, ANIMATE_MONTHS_FROM_RIGHT = 2 //animation indicator, shows that the month animation will move from right to left
		, ANIMATE_MONTHS_FROM_TOP = 3 //animation indicator, shows that the month animation will move from top to bottom
		, ANIMATE_MONTHS_FROM_BOTTOM = 4 //animation indicator, shows that the month animation will move from bottom to top
		
		, SET_NEXT_MONTH = 0 //shows how the _activeDate should be moved in the setMonth() method
		, SET_PREVIOUS_MONTH = 1 //shows how the _activeDate should be moved in the setMonth() method
		, SET_NEXT_YEAR = 2 //shows how the _activeDate should be moved in the setMonth() method
		, SET_PREVIOUS_YEAR = 3 //shows how the _activeDate should be moved in the setMonth() method
		
		, NAVIGATION_LEVEL_MONTH = 0 //Is the navigation level marker where months are shown
		, NAVIGATION_LEVEL_YEAR = 1 //Is the navigation level marker where years are shown
		, NAVIGATION_LEVEL_DECADE = 2 //Is the navigation level marker where decades are shown
		
		, KEY_ESC = 27 //The keycode for the ESC key
		, KEY_CTRL = 17 //The keycode for the CTRL key
		
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
	
	********************************************************************************
	These variables are commented out, because they are system variables.
	Used mainly to track how many instances of the object exist an the sort. 
	NB! - Never mannualy change these
	---------------------------------------------------------------------------------
	
	this.calendarCount = 0 //Integer, shows how many calendars have been created
	
	********************************************************************************/
	
	var This = this
		,_DefaultSettings = {
			Phrases : {
				dateSelectionLabel : 'Date Selection'
				, noDateSelected : 'No date selected'				
				, previousYear : 'Select Previous Year'
				, nextYear : 'Select Next Year'
				, previousMonth : 'Select Previous Month'
				, nextMonth : 'Select Next Month'
				, getYearBreakDown : 'Get {0} breakdown in months'
				, closeCalendar : 'Close date selection calendar'
				, closeNavigationPanel : 'Close the period navigation'
				
				, getDecadeBreakdownInYears : 'Get decade breakdown in years'
				, getCenturyBreakdownInDecades : 'Get century Breakdown in decades'
				
				, getPreviousDecadeBreakdownInYears : "Get previous decade breakdown in years"
				, getNextDecadeBreakdownInYears : "Get next decade's breakdown in years"
								
				, getPreviousCenturyBreakdownInDecades : 'Get previous century Breakdown in decades'
				, getNextCenturyBreakdownInDecades : 'Get next century Breakdown in decades'

				, fromTo : '{0} to {1}'
				, selectMonth : 'Select Month'
				
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
				
				, janShort : "Jan"
				, febShort : "Feb"
				, marShort : "Mar"
				, aprShort : "Apr"
				, mayShort : "May"
				, junShort : "Jun"
				, julShort : "Jul"
				, augShort : "Aug"
				, sepShort : "Sep"
				, octShort : "Oct"
				, novShort : "Nov"
				, decShort : "Dec"
				
				, close : 'Close'
				
				, startOfPeriod : 'Start of selection period reached'
				, endOfPeriod : 'End of selection period reached'
			}
			,parentClassName : '' //the parent class name name of the parent object that will be appended to this object
			,iconURL : './img/cal.png'			
			
			,dateFormatCall : null //the method with will format the a DateTime object into a visible text for the selection, the Date will be passed as the first variable
			
			,isDropDown : false //if FALSE the calendar is a fully visible calendar entered into the DOM else is the standard drop down calendar
			
			,defaultSelectedDate : null //the date with is selected by default on initial load, if left at NULL, no date selected
			
			,dateLimitFrom : null //JS Date Object, the date limiter, with limits the calendar to never go bellow this date (allows this date)
			,dateLimitTo : null //JS Date Object, the date limiter, with limits the calendar to never go above this date (allows this date)
			
		}
		,_$hiddenButton = $(document.createElement('button')).attr({ type : 'button' }) //the hidden button for the accessible version
		,_$selectionIndicator = $(document.createElement('div')) //the visible selected date indicator
		,_$selectionFocusIndicator = $(document.createElement('div')) //the visible selection focus indicator
		,_$selectionIndicatorText = $(document.createElement('span')) //the text of the selection indicator
		
		,_$calendar = $(document.createElement('div')) //the calendar container
		
		
		,_$doc = $(document) //the jQuery object of the document
		
		,_NextYearButton = null //the Next Year Button
		,_PrevYearButton = null //the Previous Year Button
		
		,_NextMonthButton = null //the Next Month Button
		,_PrevMonthButton = null //the Previous Month Button		
		
		,_CurrentMonthButton = null //the current month button with opens more navigation options
		
		,_MonthA = null //One of the [CalendarMonthObject]s 
		,_MonthB = null //One of the [CalendarMonthObject]s 
		
		,_ActiveMonth = null //the currently active [CalendarMonthObject]
		,_InactiveMonth = null //the currently inactive [CalendarMonthObject]
		
		,_activeDate = null //the active date of the month i.e. the month currently on display, always set to the first of the month
		,_longMonthNameArr = [] //the long month names as an array
		,_shortMonthNameArr = [] //the short month names as an array
		
		,_$monthContainer = $(document.createElement('div')) //the container for the months
		
		,_$extraSelection = $(document.createElement('div')) //the extra selection panel with holds the extra preiod navigation
		
		,_ExtraNextButton = null //the Extra panel's next Button
		,_ExtraPrevButton = null //the Extra panel's previous Button
		,_ExtraCurrentButton = null //the Exctra panel's current button
		
		,_$extraSelectionPanel = $(document.createElement('div')) //the extra navigation panel with holds the invidivual periods on the extra navigation
		,_isExtraNavigatorOpen = false //Boolean, if TRUE shows that the extra navigation panel is opened
		
		,_ExtraPanelCloseButton = null //the Exctra panel's current button
		,_currentNavigationLevel = NAVIGATION_LEVEL_MONTH //the current extra panel navigation level
		
		,_ExtraNavigationPeriods = [] //Array that holds all the extra navigation level period buttons
		,_strOutOfPeriodNavigationButtonClass = '' //the CSS class name for the out of period extra preiod navigation button
		,_strPeriodNavigationButtonClass = '' //the CSS class name for the extra preiod navigation button
		
		,_currentExtraNavigationBaseYear = 0 //the current year based on what the period navigation levels are built
		
		,_CloseButton = null //The close button of the calendar
		,_selectedDate = null //the currently selected date 
		
		,_isCalendarOpen = false //Boolean, if TRUE shows that the calendar is currently open
		,_blurTimeoutTimer = null //the timeout timer for the blur (needed so the selection click would not be interfered when needed to blur as well)		
		
		,_isCtrlDown = false //if true, the CTRL button is being pressed down
		
		,_touchX = 0 //Integer, the X coordinate when of a touch, used to see if the touch has moved from touchstart i.e. user has scrolled
		,_touchY = 0 //Integer, the Y coordinate when of a touch, used to see if the touch has moved from touchstart i.e. user has scrolled
		,_swipeTimer = null //the timer used to time the swipe speeds
		
		,_dateLimitFrom = null //JS Date Object, the date limiter, with limits the calendar to never go bellow this date (allows this date)
		,_dateLimitTo = null //JS Date Object, the date limiter, with limits the calendar to never go above this date (allows this date)
		
		,_inactiveMonthLeft = 0 //Integer, the animation's final left position for the inactive month's animation
		,_inactiveMonthTop = 0 //Integer, the animation's final top position for the inactive month's animation
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
		
		_strPeriodNavigationButtonClass = CLASS_NAME + '-ExtraNavigation-PeriodButton';
		_strOutOfPeriodNavigationButtonClass = CLASS_NAME + '-ExtraNavigation-PeriodButton-OutOfPeriod';
		
		if(typeof CalendarObject.prototype.calendarCount == 'number') {
			CalendarObject.prototype.calendarCount++;
		} else {
			CalendarObject.prototype.calendarCount = 1;
		}
		
		INSTANSE_NR = CalendarObject.prototype.calendarCount;
		
		var $label = $(document.createElement('label'))
			,$prevButtonContainers = $(document.createElement('td'))
			,$nextButtonContainers = $(document.createElement('td'))
			,$currentMonthButtonContainer = $(document.createElement('td'))
			
			,$extraPrevButtonContainers = $(document.createElement('td'))
			,$extraNextButtonContainers = $(document.createElement('td'))
			,$extraCurrentMonthButtonContainer = $(document.createElement('td'))
			
			,$extraPanelCloseButtonContainer = $(document.createElement('div'))
			
			,$extraPeriodButtonContainer_1 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_2 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_3 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_4 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_5 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_6 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_7 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_8 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_9 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_10 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_11 = $(document.createElement('td'))
			,$extraPeriodButtonContainer_12 = $(document.createElement('td'))
			
			,$closeButtonContainer = $(document.createElement('div'))
			
			,strCalendarPanelID = CLASS_NAME + '-' + INSTANSE_NR + '-CalendarPanelID'
			,strExtraPeriodNavigationPanelID = CLASS_NAME + '-' + INSTANSE_NR + '-ExtraPeriodNavigationPanelID'
			
			,objCalendarDefaultSettings
		;
		
		makeExtraNavigationPeriod($extraPeriodButtonContainer_1);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_2);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_3);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_4);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_5);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_6);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_7);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_8);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_9);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_10);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_11);
		makeExtraNavigationPeriod($extraPeriodButtonContainer_12);
		
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
		
		_shortMonthNameArr = [
			_Settings.Phrases.janShort
			, _Settings.Phrases.febShort
			, _Settings.Phrases.marShort
			, _Settings.Phrases.aprShort
			, _Settings.Phrases.mayShort
			, _Settings.Phrases.junShort
			, _Settings.Phrases.julShort
			, _Settings.Phrases.augShort
			, _Settings.Phrases.sepShort
			, _Settings.Phrases.octShort
			, _Settings.Phrases.novShort
			, _Settings.Phrases.decShort
		];
		
		_PrevYearButton = new CalendarButtonObject({
			Phrases : {
				hiddenButtonText : 'N/A'
				, visualButtonText : '«'
				, label : _Settings.Phrases.previousYear
			}
			,$root : $prevButtonContainers
			,extraVisualButtonClass : CLASS_NAME + '-Navigator-Button'
			,onClickCall : setPrevYear
		});
		_PrevMonthButton = new CalendarButtonObject({
			Phrases : {
				hiddenButtonText : 'N/A'
				, visualButtonText : '‹'
				, label : _Settings.Phrases.previousMonth
			}
			,$root : $prevButtonContainers
			,extraVisualButtonClass : CLASS_NAME + '-Navigator-Button'
			,onClickCall : setPrevMonth
		});
		_NextMonthButton = new CalendarButtonObject({
			Phrases : {
				hiddenButtonText : 'N/A'
				, visualButtonText : '›'
				, label : _Settings.Phrases.nextMonth
			}
			,$root : $nextButtonContainers
			,extraVisualButtonClass : CLASS_NAME + '-Navigator-Button'
			,onClickCall : setNextMonth
		});
		_NextYearButton = new CalendarButtonObject({
			Phrases : {
				hiddenButtonText : 'N/A'
				, visualButtonText : '»'				
				, label : _Settings.Phrases.nextYear
			}
			,$root : $nextButtonContainers
			,extraVisualButtonClass : CLASS_NAME + '-Navigator-Button'
			,onClickCall : setNextYear
		});
		
		_CurrentMonthButton = new CalendarButtonObject({
			Phrases : {
				visualButtonText : 'N/A'				
			}
			,$root : $currentMonthButtonContainer
			,extraVisualButtonClass : CLASS_NAME + '-Navigator-Button ' + CLASS_NAME + '-Navigator-MonthButton'
			,onClickCall : openExtraNavigation
		});
		
		if(_Settings.dateLimitFrom instanceof Date) {
			_dateLimitFrom = new Date(_Settings.dateLimitFrom.getFullYear(), _Settings.dateLimitFrom.getMonth(), _Settings.dateLimitFrom.getDate());
		}
		
		if(_Settings.dateLimitTo instanceof Date) {
			_dateLimitTo = new Date(_Settings.dateLimitTo.getFullYear(), _Settings.dateLimitTo.getMonth(), _Settings.dateLimitTo.getDate());
		}
		
		objCalendarDefaultSettings = {
			parentClassName : CLASS_NAME
			
			, nextMonthCall : setNextMonth //the method call for the next month
			, prevMonthCall : setPrevMonth //the method call for the previous month
			, nextYearCall : setNextYear //the method call for the next year
			, prevYearCall : setPrevYear //the method call for the previous year
			
			, daySelectionCall : selectDay

			,dateLimitFrom : _dateLimitFrom
			,dateLimitTo : _dateLimitTo
		};
		
		_MonthA = new CalendarMonthObject(objCalendarDefaultSettings);
		_MonthB = new CalendarMonthObject(objCalendarDefaultSettings);
		
		_ActiveMonth = _MonthA;
		_InactiveMonth = _MonthB;
		
		_CurrentMonthButton.attr({
			'aria-controls' : strExtraPeriodNavigationPanelID
			,'aria-expanded' : 'false'
		});		
		
		_ExtraPrevButton = new CalendarButtonObject({
			Phrases : {
				hiddenButtonText : ''
				, visualButtonText : '‹'				
			}
			,extraVisualButtonClass : CLASS_NAME + '-ExtraNavigation-Button ' + CLASS_NAME + '-ExtraNavigation-MovementButton'
			,$root : $extraPrevButtonContainers
			,onClickCall : previusExtraPeriodButtonClick
		});
		_ExtraNextButton = new CalendarButtonObject({
			Phrases : {
				hiddenButtonText : ''
				, visualButtonText : '›'				
			}
			,extraVisualButtonClass : CLASS_NAME + '-ExtraNavigation-Button ' + CLASS_NAME + '-ExtraNavigation-MovementButton'
			,$root : $extraNextButtonContainers
			,onClickCall : nextExtraPeriodButtonClick
		});		
		
		_ExtraCurrentButton = new CalendarButtonObject({
			onClickCall : extraCurrentButtonClickCall
			,extraVisualButtonClass : CLASS_NAME + '-ExtraNavigation-Button ' + CLASS_NAME + '-ExtraNavigation-CurrentButton'
			,$root : $extraCurrentMonthButtonContainer
		});
		
		_ExtraPanelCloseButton = new CalendarButtonObject({
			Phrases : {
				visualButtonText : _Settings.Phrases.close
				, hiddenButtonText : ''
				, label : _Settings.Phrases.closeNavigationPanel
			}
			,extraVisualButtonClass : CLASS_NAME + '-ExtraNavigation-Button ' + CLASS_NAME + '-ExtraNavigation-CloseButton'
			,$root : $extraPanelCloseButtonContainer
			,onClickCall : closeExtraNavigation
		});
		
		_ExtraPanelCloseButton.attr({
			'aria-controls' : strExtraPeriodNavigationPanelID
			,'aria-expanded' : 'false'
		});
		
		
		_CloseButton = new CalendarButtonObject({
			Phrases : {
				visualButtonText : _Settings.Phrases.close
				,hiddenButtonText : ''
				,label : _Settings.Phrases.closeCalendar
			}
			,extraVisualButtonClass : CLASS_NAME + '-Calendar-CloseButton'
			,$root : $closeButtonContainer
			,onClickCall : closeCalendar
		});

		_CloseButton.attr({
			'aria-expanded' : 'false'
			, 'aria-controls' : strCalendarPanelID
		});
		
		_$selectionIndicator			
			.addClass(CLASS_NAME + '-SelectionIndicator')	
			.append(_$selectionIndicatorText.text(_Settings.Phrases.noDateSelected))
			.append(_$selectionFocusIndicator.addClass(CLASS_NAME + '-SelectionFocusIndicator'))
			//.bind('click', openCalendar)
		;
		
		$label
			.addClass(CLASS_NAME + '-HiddenSelectionButton')
			.append(document.createTextNode(_Settings.Phrases.dateSelectionLabel))
			.append(_$hiddenButton.text(_Settings.Phrases.noDateSelected)
				.bind('focus', buttonFocus)
				.bind('blur', buttonBlur)
				.bind('click', selectionIndicatorClick)
				.attr({
					'aria-expanded' : 'false'
					, 'aria-controls' : strCalendarPanelID
				})
			)
			.attr({
				tabIndex : -1
			})
		;
		
		if(_Settings.isDropDown) {
			This.$root
				.append($(document.createElement('div')).addClass(CLASS_NAME + '-Selection')
					.append(_$selectionIndicator)
					.append($(document.createElement('img')).attr({ src : _Settings.iconURL }).addClass(CLASS_NAME + '-CalendarIcon'))				
					.bind('click', selectionIndicatorClick)
					.bind('click', stopEvent)
					.attr({
						"aria-hidden" : 'true'
						,role : 'presentation'
					})
				)
		}
		
		This.$root
			.append($label)
			.append($(document.createElement('div')).addClass(CLASS_NAME + '-CalendarPositioner')
				.append(_$calendar.addClass(CLASS_NAME + '-CalendarContainer').attr({ 
						id : strCalendarPanelID
						,'aria-hidden' : 'true'
					})
					.append($(document.createElement('div')).addClass(CLASS_NAME + '-Calendar')
						.append($(document.createElement('div')).addClass(CLASS_NAME + '-Calendar-Navigator')
							.append($(document.createElement('table')).attr({ role : 'presentation' }).addClass(CLASS_NAME + '-Calendar-NavigatorStructTable').append($(document.createElement('tr'))
									.append($prevButtonContainers.addClass(CLASS_NAME + '-Calendar-Navigator-PreviousButtons'))
									.append($currentMonthButtonContainer.addClass(CLASS_NAME + '-Calendar-Navigator-CurrentMonth'))
									.append($nextButtonContainers.addClass(CLASS_NAME + '-Calendar-Navigator-NextButtons'))
								)
							)
						)
						.append(_$monthContainer
							.append(_MonthA.$root)
							.append(_MonthB.$root)
						)
						.append($closeButtonContainer.addClass(CLASS_NAME + '-Calendar-CloseButtonContainer'))
					)					
					.append(_$extraSelection.append($(document.createElement('div')).addClass(CLASS_NAME + '-ExtraNavigation')
						.append($(document.createElement('div')).addClass(CLASS_NAME + '-ExtraNavigation-Navigation')
							.append($(document.createElement('table')).attr({ role : 'presentation' }).addClass(CLASS_NAME + '-Calendar-NavigatorStructTable').append($(document.createElement('tr'))
									.append($extraPrevButtonContainers.addClass(CLASS_NAME + '-Calendar-ExtraNavigation-PreviousButtons'))
									.append($extraCurrentMonthButtonContainer.addClass(CLASS_NAME + '-Calendar-ExtraNavigation-CurrentMonth'))
									.append($extraNextButtonContainers.addClass(CLASS_NAME + '-Calendar-ExtraNavigation-NextButtons'))
								)
							)
							.append(_$extraSelectionPanel.addClass(CLASS_NAME + '-ExtraNavigation-NavigationPanel'))
							.append($extraPanelCloseButtonContainer.addClass(CLASS_NAME + '-ExtraNavigation-CloseButtonContainer'))
						)
					))										
				)
				.bind('click', stopEvent)				
			)
		;
		
		if(!_Settings.isDropDown) {
			$closeButtonContainer.detach();
			
			_$calendar.addClass(CLASS_NAME + '-IntegratedCalendarContainer').css({
				position : 'relative'
				, top : '0px'
				, left : '0px'
			}).append(_$selectionFocusIndicator);
			
		} else {
			_$calendar.css({
				position : 'absolute'
			}).hide();			
		}
		
		_$extraSelectionPanel.append($(document.createElement('table')).addClass(CLASS_NAME + '-NavigationPanel-Table').attr({ role : 'presentation' })
			.append($(document.createElement('tr'))
				.append($extraPeriodButtonContainer_1)
				.append($extraPeriodButtonContainer_2)
				.append($extraPeriodButtonContainer_3)
			)
			.append($(document.createElement('tr'))
				.append($extraPeriodButtonContainer_4)
				.append($extraPeriodButtonContainer_5)
				.append($extraPeriodButtonContainer_6)
			)
			.append($(document.createElement('tr'))
				.append($extraPeriodButtonContainer_7)
				.append($extraPeriodButtonContainer_8)
				.append($extraPeriodButtonContainer_9)
			)
			.append($(document.createElement('tr'))
				.append($extraPeriodButtonContainer_10)
				.append($extraPeriodButtonContainer_11)
				.append($extraPeriodButtonContainer_12)
			)
		);
				
		_$extraSelection.css({
			opacity : 0
			,display : 'none'
		}).attr({
			id : strExtraPeriodNavigationPanelID
			,'aria-hidden' : 'true'
		});		
		
		_InactiveMonth.$root.hide();

		_$doc.ready(_load);		
	}
	
	this.setSelectedDay = function(dDate) {
	/*
		Sets the calendar's selected day
	*/
		_selectedDate = new Date(dDate.getFullYear(), dDate.getMonth(), dDate.getDate());
		_InactiveMonth.setSelectedDate(_selectedDate, true);
		_ActiveMonth.setSelectedDate(_selectedDate);
	};
	
	this.setDateLimit = function(dFrom, dTo) {
	/*
		Allows the client programmer to set the calendars date limit
	*/
		if(dFrom instanceof Date) {
			_dateLimitFrom = new Date(dFrom.getFullYear(), dFrom.getMonth(), dFrom.getDate());
		} else {
			_dateLimitFrom = null;
		}
		
		if(dTo instanceof Date) {
			_dateLimitTo = new Date(dTo.getFullYear(), dTo.getMonth(), dTo.getDate());
		} else {
			_dateLimitTo = null;
		}
		
		_ActiveMonth.setDateLimit(_dateLimitFrom, _dateLimitTo, true);
		_InactiveMonth.setDateLimit(_dateLimitFrom, _dateLimitTo, true);
		
		closeExtraNavigation(null, true);
		closeCalendar(true);
		
		setMonth(ANIMATE_MONTHS_NONE, _activeDate);
	};
	
	this.getSelectedDay = function() {
	/*
		Returns the selected day to the client programmer
	*/
		return _selectedDate;
	};
	function selectDay(dDate) {
	/*
		Selects the day for the calendar
		
		dDate - JS Date Object, the day that will be selected
	*/
		var strSelectedDay, value, intDay, intMonth, intYear; 
		
		_InactiveMonth.setSelectedDate(dDate, true);
		_ActiveMonth.setSelectedDate(dDate);
		
		intDay = dDate.getDate();
		intMonth = dDate.getMonth() + 1;
		intYear = dDate.getFullYear();
		
		if(typeof _Settings.dateFormatCall != 'function') {				
			strSelectedDay = (intDay < 10 ? ('0' + intDay) : intDay) + '/' + (intMonth < 10 ? ('0' + intMonth) : intMonth) + '/' + intYear;	
		} else {
			strSelectedDay = _Settings.dateFormatCall(dDate);
		}
		
		_selectedDate = dDate;
		
		_$selectionIndicatorText.text(strSelectedDay);		
		_$hiddenButton.text(_longMonthNameArr[intMonth - 1] + ' ' + intDay + ' ' + intYear);		
		
		closeCalendar();
	}
	
	function removeCalendarFromTabOrder() {
	/*
		Removes the calendar from the TabIndex order
	*/
		_PrevYearButton.attr({
			tabIndex : -1
		});
		_PrevMonthButton.attr({
			tabIndex : -1
		});
		_CurrentMonthButton.attr({
			tabIndex : -1
		});
		_NextMonthButton.attr({
			tabIndex : -1
		});
		_NextYearButton.attr({
			tabIndex : -1
		});
		_CloseButton.attr({
			tabIndex : -1
		});
		_ActiveMonth.removeTabIndex();
	}
	
	function addCalendarToTabOrder() {
	/*
		Adds the extra period navigator to the TabIndex order
	*/
		_PrevYearButton.attr({
			tabIndex : 0
		});
		_PrevMonthButton.attr({
			tabIndex : 0
		});
		_CurrentMonthButton.attr({
			tabIndex : 0
		});
		_NextMonthButton.attr({
			tabIndex : 0
		});
		_NextYearButton.attr({
			tabIndex : 0
		});
		_CloseButton.attr({
			tabIndex : 0
		});
		
		_ActiveMonth.addTabIndex();		
	}
	
	function removeNavigatorFromTabOrder() {
	/*
		Removes the extra period navigator from the TabIndex order
	*/
		var index;
		
		_ExtraNextButton.attr({
			tabIndex : -1
		});
		_ExtraPrevButton.attr({
			tabIndex : -1
		});
		_ExtraCurrentButton.attr({
			tabIndex : -1
		});
		_ExtraPanelCloseButton.attr({
			tabIndex : -1
		});
		
		index = _ExtraNavigationPeriods.length;
		while(index--) {
			_ExtraNavigationPeriods[index].attr({
				tabIndex : -1
			});	
		}		
	}
	
	function addNavigatorToTabOrder() {
	/*
		Adds the calendar to the TabIndex order
	*/
		var index;
		
		_ExtraNextButton.attr({
			tabIndex : 0
		});
		_ExtraPrevButton.attr({
			tabIndex : 0
		});
		_ExtraCurrentButton.attr({
			tabIndex : 0
		});
		_ExtraPanelCloseButton.attr({
			tabIndex : 0
		});
		
		index = _ExtraNavigationPeriods.length;
		while(index--) {
			_ExtraNavigationPeriods[index].attr({
				tabIndex : 0
			});	
		}
	}
	
	function makeExtraNavigationPeriod($root) {
	/*
		Makes an individual extra navigation level button
	*/		
		var Button = new CalendarButtonObject({
			onClickCall : extraNavigationPeriodClick
			,value : _ExtraNavigationPeriods.length
			,$root : $root
			,extraVisualButtonClass : _strPeriodNavigationButtonClass
		});	
		
		$root.addClass(CLASS_NAME + '-Calendar-ExtraNavigation-PeriodButtonContainer');
		
		_ExtraNavigationPeriods.push(Button);
	}
	
	function extraNavigationPeriodClick(index) {
	/*
		Handles the extra period click i.e. switches the content of the navigator or selects the month of the calendar based on the period selected
	*/
		var year, monthIndex, animationType, newDate, i, obj, length;
		
		switch(_currentNavigationLevel) {
			case NAVIGATION_LEVEL_MONTH:
				
				year = _activeDate.getFullYear();
				if(year < _currentExtraNavigationBaseYear) {
					animationType = ANIMATE_MONTHS_FROM_RIGHT;
				} else if(year > _currentExtraNavigationBaseYear) {
					animationType = ANIMATE_MONTHS_FROM_LEFT;
				} else {
					monthIndex = _activeDate.getMonth();					
					if(monthIndex < index) {
						animationType = ANIMATE_MONTHS_FROM_BOTTOM;
					} else if(monthIndex > index) {
						animationType = ANIMATE_MONTHS_FROM_TOP;
					} else {
						closeExtraNavigation(true);
						return;
					}
				}
				
				newDate = new Date(_currentExtraNavigationBaseYear, index, 1);
				setMonth(animationType, newDate);
				
				closeExtraNavigation(true);
				return;
			case NAVIGATION_LEVEL_YEAR:			
				year = _currentExtraNavigationBaseYear - 1 + index;				
				makeMonthsExtraNavigation(year);
				break;
			case NAVIGATION_LEVEL_DECADE:
				year = (_currentExtraNavigationBaseYear - 10) + (index * 10);
				makeYearsExtraNavigation(year);
				break;
		}
		
		//checks to see if the button focus was is on a button that is enabled and shifts it if needed
		obj = _ExtraNavigationPeriods[index];
		if(obj.isDisabled()) {
			length = _ExtraNavigationPeriods.length;
			for(i = 0; i < length; i++) {
				if(i != index) {
					obj = _ExtraNavigationPeriods[i];
					
					if(!obj.isDisabled()) {
						obj.focus();
						return;
					}	
				}				
			}
		}
	}
	
	function openExtraNavigation() {
	/*
		Opens the extra navigation panel
	*/
		var width = _$calendar.width()
			, height = _$calendar.height()
		;
		
		_CurrentMonthButton.attr({
			'aria-expanded' : 'true'
		});
		_$extraSelection.attr({
			'aria-hidden' : 'false'
		});
		_ExtraPanelCloseButton.attr({
			'aria-expanded' : 'true'
		});
		
		_isExtraNavigatorOpen = true;		
		
		if(_isCalendarOpen) {
			removeCalendarFromTabOrder();
			addNavigatorToTabOrder();	
		}		
		
		makeMonthsExtraNavigation();
		
		_$extraSelection.stop(true).css({
			position : 'absolute'
			, left : '0px'
			, top :  (0 - height) + 'px'
			, width : width + 'px'
			, height : height + 'px'
			, opacity : 0
			, display : 'block'
		}).animate({
			top : 0
			, opacity : 1
		}, 400);
	
	}
	
	function closeExtraNavigation(focusOnCalendar, doNotFocus) {
	/*
		Closes the extra navigation panel
		
		focusOnCalendar - [Optional] Boolean, if TRUE the focus will be placed on the calendar day, else on the previous year button
	*/
		var width = _$calendar.width()
			, height = _$calendar.height()
		;
		
		_isExtraNavigatorOpen = false;
		
		_CurrentMonthButton.attr({
			'aria-expanded' : 'false'
		});
		_$extraSelection.attr({
			'aria-hidden' : 'true'
		});
		_ExtraPanelCloseButton.attr({
			'aria-expanded' : 'false'
		});
		
		if(_isCalendarOpen) {
			removeNavigatorFromTabOrder();
			addCalendarToTabOrder();
		}
		
		if(!doNotFocus) {
			if(typeof focusOnCalendar == 'boolean' && focusOnCalendar) {
				_ActiveMonth.focusOnActiveDate();
			} else {
				if(_PrevYearButton.isDisabled()) {
					_CurrentMonthButton.focus();
				} else {
					_PrevYearButton.focus();
				}
			}	
		}
		
		makeMonthsExtraNavigation();
		
		_$extraSelection.stop(true).animate({
			top : 0 - _$calendar.height()
			, left : 0
			, opacity : 0
		}, 400);
	}
	
	function documentKeyDown(e) {
	/*
		The document keydown event handler
	*/
		var ret = true;
		
		switch(e.which) {
			case KEY_ESC:
				if(!_isCtrlDown) {
					if(_isExtraNavigatorOpen) {
						closeExtraNavigation();
					} else if(_isCalendarOpen && _Settings.isDropDown) {
						closeCalendar();
					}
					
					ret	= false;
				}
				
				break;
			case KEY_CTRL:
				_isCtrlDown = true;
				_ActiveMonth.preventKeyboardMovement();
				_InactiveMonth.preventKeyboardMovement();
				ret	= false;
				break;				
		}		
		
		return ret;
	}
	
	function getExtraNavigationFocusIndexBasedOnActiveDate() {
	/*
		Returs the index of the extra navigation period button array witch should have the focus based off the _activeDate
	*/
		if(!_isExtraNavigatorOpen) {
			//can't focus on the navigation panel when the panel is not opened
			return 0;			
		}
		
		var baseYear, year, index;
		
		switch(_currentNavigationLevel) {
			case NAVIGATION_LEVEL_MONTH:
				index = _activeDate.getMonth();				
				break;
			case NAVIGATION_LEVEL_YEAR:
				year = _activeDate.getFullYear();
				baseYear = _currentExtraNavigationBaseYear - 1;
				index = year - baseYear;				
				break;
			case NAVIGATION_LEVEL_DECADE:
				year = Math.floor(_activeDate.getFullYear() / 10) * 10;
				baseYear = _currentExtraNavigationBaseYear - 10;
				index = (year - baseYear) / 10;				
				break;
		}
		
		return index;
	}
	
	function documentKeyUp(e) {
	/*
		The document keyup event handler
	*/	
		var ret = true;
		
		switch(e.which) {			
			case KEY_CTRL:
				_isCtrlDown = false;
				_ActiveMonth.enableKeyboardMovement();
				_InactiveMonth.enableKeyboardMovement();
				ret	= false;
				break;
			case KEY_DOWN_ARROW:
				//moves the extra navigation down a level or closes it
				if(_isCtrlDown && _isExtraNavigatorOpen) {
					switch(_currentNavigationLevel) {
						case NAVIGATION_LEVEL_MONTH:
							closeExtraNavigation(true);							
							break;
						case NAVIGATION_LEVEL_YEAR:
							makeMonthsExtraNavigation(_activeDate.getFullYear());							
							_ExtraNavigationPeriods[getExtraNavigationFocusIndexBasedOnActiveDate()].focus();							
							break;
						case NAVIGATION_LEVEL_DECADE:
							makeYearsExtraNavigation(Math.floor(_activeDate.getFullYear() / 10) * 10);
							_ExtraNavigationPeriods[getExtraNavigationFocusIndexBasedOnActiveDate()].focus();
							break;
					}
					ret	= false;
				}
				break;
			case KEY_UP_ARROW:
				//moves to the extra navigation up a level or openes it
				if(_isCtrlDown) {
					if(_isExtraNavigatorOpen) {
						extraCurrentButtonClickCall();
					} else {
						openExtraNavigation();
					}
					_ExtraNavigationPeriods[getExtraNavigationFocusIndexBasedOnActiveDate()].focus();
					ret	= false;
				}
				break;
			case KEY_LEFT_ARROW:
				//moves to the pervious period
				if(_isCtrlDown) {
					if(_isExtraNavigatorOpen) {
						previusExtraPeriodButtonClick();						
					} else {
						setPrevMonth();
						_ActiveMonth.focusOnActiveDate();
					}
					ret	= false;
				}
				break;
			case KEY_RIGHT_ARROW:
				//moves to the next period
				if(_isCtrlDown) {
					if(_isExtraNavigatorOpen) {
						nextExtraPeriodButtonClick();
					} else {
						setNextMonth();
						_ActiveMonth.focusOnActiveDate();
					}
					ret	= false;
				}
				break;
		}
		
		return ret;
	}
		
	function extraCurrentButtonClickCall() {
	/*
		Switches between the extra levels		
	*/
		switch(_currentNavigationLevel) {
			case NAVIGATION_LEVEL_MONTH:
				makeYearsExtraNavigation();
				break;
			case NAVIGATION_LEVEL_YEAR: 
				makeDecadesExtraNavigation();
				break;
			case NAVIGATION_LEVEL_DECADE:
				makeYearsExtraNavigation(Math.floor(_activeDate.getFullYear() / 10) * 10);
				break;
		}
	}
	
	function previusExtraPeriodButtonClick() {
	/*
		Handles the click call of the previoud extra period button
	*/
		switch(_currentNavigationLevel) {
			case NAVIGATION_LEVEL_MONTH:
				makeMonthsExtraNavigation(_currentExtraNavigationBaseYear - 1);
				break;
			case NAVIGATION_LEVEL_YEAR:
				makeYearsExtraNavigation(_currentExtraNavigationBaseYear - 10);
				break;
			case NAVIGATION_LEVEL_DECADE:
				makeDecadesExtraNavigation(_currentExtraNavigationBaseYear - 100);
				break;
		}
	}
	function nextExtraPeriodButtonClick() {
	/*
		Handles the click call of the next extra period button
	*/	
		switch(_currentNavigationLevel) {
			case NAVIGATION_LEVEL_MONTH:
				makeMonthsExtraNavigation(_currentExtraNavigationBaseYear + 1);
				break;
			case NAVIGATION_LEVEL_YEAR:
				makeYearsExtraNavigation(_currentExtraNavigationBaseYear + 10);
				break;
			case NAVIGATION_LEVEL_DECADE:
				makeDecadesExtraNavigation(_currentExtraNavigationBaseYear + 100);
				break;
		}
	}
	
	function makeMonthsExtraNavigation(year, focusIndex) {
	/*
		Makes the extra navigation panel for the months view i.e. the 1 year view in months
		
		year - [Optional] Integer, Allows you to set the active year by hand and not calculate it
	*/
		var index, obj, intLimitYear, intLimitMonthTo, intLmitMonthFrom, strLabel;
		
		if(typeof year != 'number') {
			year = _activeDate.getFullYear();
		}
		
		intLmitMonthFrom = -1;
		if(_dateLimitFrom instanceof Date) {
			
			intLimitYear = _dateLimitFrom.getFullYear();
			
			if(intLimitYear > year) {
				return;
			}
			
			if(intLimitYear == year) {
				_ExtraPrevButton.disable();
				intLmitMonthFrom = _dateLimitFrom.getMonth();
			} else {
				_ExtraPrevButton.enable();
			}
		}
		
		intLimitMonthTo = -1;
		if(_dateLimitTo instanceof Date) {
			intLimitYear = _dateLimitTo.getFullYear();
			
			if(intLimitYear < year) {
				return;
			}
			
			if(intLimitYear == year) {
				_ExtraNextButton.disable();
				intLimitMonthTo = _dateLimitTo.getMonth();
			} else {
				_ExtraNextButton.enable();
			}
		}
		
		_currentNavigationLevel = NAVIGATION_LEVEL_MONTH;
		
		_ExtraNavigationPeriods[0].removeClass(_strOutOfPeriodNavigationButtonClass);
		_ExtraNavigationPeriods[11].removeClass(_strOutOfPeriodNavigationButtonClass);
		
		_currentExtraNavigationBaseYear = year;
		
		_ExtraPrevButton.setText(null, _Settings.Phrases.getYearBreakDown.replace('{0}', year - 1), _Settings.Phrases.previousYear);
		_ExtraNextButton.setText(null, _Settings.Phrases.getYearBreakDown.replace('{0}', year + 1), _Settings.Phrases.nextYear);		
				
		_ExtraCurrentButton.setText(
			'' + year
			, getDecadesButtonText(year)
			, _Settings.Phrases.getDecadeBreakdownInYears
		);
		
		index = _ExtraNavigationPeriods.length;
		while(index--) {
			obj = _ExtraNavigationPeriods[index];
			
			strLabel = '';
			if(index == intLmitMonthFrom) {
				strLabel += _Settings.Phrases.startOfPeriod + ', ';
			}
			
			if(index == intLimitMonthTo) {
				strLabel += _Settings.Phrases.endOfPeriod + ', ';
			}
			
			strLabel += _Settings.Phrases.selectMonth;
			
			obj.setText(
				_shortMonthNameArr[index]
				, _longMonthNameArr[index] + ' ' + _currentExtraNavigationBaseYear
				, strLabel
			);
			
			obj.enable();			
			
			if(intLmitMonthFrom > -1 && index < intLmitMonthFrom) {
				obj.disable();
			}
			
			if(intLimitMonthTo > -1 && index > intLimitMonthTo) {
				obj.disable();
			}			
		}	
	}
	
	function getDecadesButtonText(year) {
	/*
		Returns the text meant on the hidden button of a decade selection button
		
		year - Integer, the base year of the decade in question
	*/
		var fromYear, toYear;
		
		fromYear = Math.floor(year / 10) * 10;
		toYear = fromYear + 10;
		//fromYear--;
		
		return _Settings.Phrases.fromTo.replace('{0}', fromYear).replace('{1}', toYear);
	}
	
	function getCenturyButtonText(year) {
	/*
		Returns the text meant on the hidden button of a century selection button
		
		year - Integer, the base year of the century in question
	*/
		var fromYear, toYear;
		
		fromYear = Math.floor(year / 100) * 100;
		toYear = fromYear + 100;		
		
		return _Settings.Phrases.fromTo.replace('{0}', fromYear).replace('{1}', toYear);
	}
	
	function makeYearsExtraNavigation(year) {
	/*
		Makes the extra navigation panel for the years view i.e. the decade view with the years
		
		year - [Optional] Integer, Allows you to set the active year by hand and not calculate it
	*/
		var i, obj, length, periodEndYear, strLabel
			, intLimitYearFromDecade = undefined			
			, intLimitYearTo = undefined
			, intLimitYearFrom = undefined
		;
		
		if(typeof year != 'number') {
			//calculates the decade in question		
			year = _currentExtraNavigationBaseYear;
		}
		
		year = Math.floor(year / 10) * 10;
		
		if(_dateLimitFrom instanceof Date) {
			
			intLimitYearFrom = _dateLimitFrom.getFullYear();
			intLimitYearFromDecade = Math.floor(intLimitYearFrom / 10) * 10;
			
			if(intLimitYearFromDecade > year) {
				return;
			}
		}
		
		if(_dateLimitTo instanceof Date) {
			intLimitYearTo = _dateLimitTo.getFullYear();
			
			if(intLimitYearTo < year) {
				return;
			}
		}	
		
		_currentNavigationLevel = NAVIGATION_LEVEL_YEAR;
		
		_ExtraNavigationPeriods[0].removeClass(_strOutOfPeriodNavigationButtonClass);
		_ExtraNavigationPeriods[11].removeClass(_strOutOfPeriodNavigationButtonClass);
		
		_currentExtraNavigationBaseYear = year;
		periodEndYear = _currentExtraNavigationBaseYear + 9;
		
		if(typeof intLimitYearFrom == 'number' && intLimitYearFrom >= _currentExtraNavigationBaseYear) {
			_ExtraPrevButton.disable();
		} else {
			_ExtraPrevButton.enable();
		}
		
		if(typeof intLimitYearTo == 'number' && intLimitYearTo <= periodEndYear) {
			_ExtraNextButton.disable();
		} else {
			_ExtraNextButton.enable();
		}
		
		_ExtraCurrentButton.setText(
			year + '-' + periodEndYear
			, getCenturyButtonText(_currentExtraNavigationBaseYear)
			, _Settings.Phrases.getCenturyBreakdownInDecades
		);
				
		_ExtraPrevButton.setText(
			null
			, getDecadesButtonText(_currentExtraNavigationBaseYear - 10)
			, _Settings.Phrases.getPreviousDecadeBreakdownInYears
		);
		_ExtraNextButton.setText(
			null
			, getDecadesButtonText(_currentExtraNavigationBaseYear + 10)
			, _Settings.Phrases.getNextDecadeBreakdownInYears
		);		
		
		for(year--, length = _ExtraNavigationPeriods.length, i = 0; i < length; i++, year++) {
			obj = _ExtraNavigationPeriods[i];
			
			strLabel = '';
			if(year == intLimitYearFrom) {
				strLabel += _Settings.Phrases.startOfPeriod + ', ';
			}
			
			if(year == intLimitYearTo) {
				strLabel += _Settings.Phrases.endOfPeriod + ', ';
			}
			
			obj.setText(
				'' + year
				, _Settings.Phrases.getYearBreakDown.replace('{0}', year)
				, strLabel
			);
			
			obj.enable();
			
			if(typeof intLimitYearFrom == 'number' && intLimitYearFrom > year) {
				obj.disable();
			}
			
			if(typeof intLimitYearTo == 'number' && intLimitYearTo < year) {
				obj.disable();
			}
		}
		
		_ExtraNavigationPeriods[0].addClass(_strOutOfPeriodNavigationButtonClass);
		_ExtraNavigationPeriods[11].addClass(_strOutOfPeriodNavigationButtonClass);
	}
	
	function makeDecadesExtraNavigation(year) {
	/*
		Makes the extra navigation panel for the decade view i.e. the century view with the decades
		
		year - [Optional] Integer, Allows you to set the active year by hand and not calculate it
	*/
		var i, obj, length, periodEndYear, strLabel
			
			, intLimitYearToDecade = undefined 
			, intLimitYearTo = undefined
			, intLimitYearFrom = undefined
			, intLimitYearFromCentury = undefined
		
		if(typeof year != 'number') {
			//calculates the century in question
			year = _currentExtraNavigationBaseYear;
		}
		
		year = Math.floor(year / 100) * 100;
		
		if(_dateLimitFrom instanceof Date) {
			
			intLimitYearFrom = Math.floor(_dateLimitFrom.getFullYear() / 10) * 10;
			intLimitYearFromCentury = Math.floor(intLimitYearFrom / 100) * 100;
			
			if(intLimitYearFromCentury > year) {
				return;
			}
		}
		
		if(_dateLimitTo instanceof Date) {
			intLimitYearToDecade = Math.floor(_dateLimitTo.getFullYear() / 10) * 10;
			intLimitYearTo = intLimitYearToDecade + 9;
			
			if(intLimitYearTo < year) {
				return;
			}
		}
		
		periodEndYear = year + 99;
		
		_currentNavigationLevel = NAVIGATION_LEVEL_DECADE;
		_currentExtraNavigationBaseYear = year;
		
		_ExtraNavigationPeriods[0].removeClass(_strOutOfPeriodNavigationButtonClass);
		_ExtraNavigationPeriods[11].removeClass(_strOutOfPeriodNavigationButtonClass);
		
		if(typeof intLimitYearFrom == 'number' && intLimitYearFrom >= _currentExtraNavigationBaseYear) {
			_ExtraPrevButton.disable();
		} else {
			_ExtraPrevButton.enable();
		}
		
		if(typeof intLimitYearTo == 'number' && intLimitYearTo <= periodEndYear) {
			_ExtraNextButton.disable();
		} else {
			_ExtraNextButton.enable();
		}
		
		_ExtraCurrentButton.setText(
			year + '-' + periodEndYear
			, getDecadesButtonText(_activeDate.getFullYear())
			, _Settings.Phrases.getDecadeBreakdownInYears			
		);		
		
		
		_ExtraPrevButton.setText(
			null
			, getCenturyButtonText(_currentExtraNavigationBaseYear - 100)
			, _Settings.Phrases.getPreviousCenturyBreakdownInDecades
		);
		_ExtraNextButton.setText(
			null
			, getCenturyButtonText(_currentExtraNavigationBaseYear + 100)
			, _Settings.Phrases.getNextCenturyBreakdownInDecades
		);	
		
		for(year -= 10, length = _ExtraNavigationPeriods.length, i = 0; i < length; i++, year += 10) {
			obj = _ExtraNavigationPeriods[i];
			
			strLabel = '';
			if(year == intLimitYearFrom) {
				strLabel += _Settings.Phrases.startOfPeriod + ', ';
			}
			
			if(year == intLimitYearToDecade) {
				strLabel += _Settings.Phrases.endOfPeriod + ', ';
			}
			
			strLabel += _Settings.Phrases.getDecadeBreakdownInYears;
			
			obj.setText(
				year + '-' + (year + 9)
				, getDecadesButtonText(year)
				, strLabel
			);
			
			obj.enable();
			
			if(typeof intLimitYearFrom == 'number' && intLimitYearFrom > year) {
				obj.disable();
			}
			
			if(typeof intLimitYearTo == 'number' && intLimitYearTo < year) {
				obj.disable();
			}
		}
		
		_ExtraNavigationPeriods[0].addClass(_strOutOfPeriodNavigationButtonClass);
		_ExtraNavigationPeriods[11].addClass(_strOutOfPeriodNavigationButtonClass);
	}
	
	function setNextYear(rowIndex, colIndex) {
	/*
		Moves the calendar to the next year
		
		rowIndex - [Optional] Integer, the row index of the calendar grid's active cell
		colIndex - [Optional] Integer, the cell index i.e. the column index of the calendar grid's active cell
	*/
		setMonth(ANIMATE_MONTHS_FROM_RIGHT, SET_NEXT_YEAR, rowIndex, colIndex);
	}
	function setPrevYear(rowIndex, colIndex) {
	/*
		Moves the calendar to the previous year
		
		rowIndex - [Optional] Integer, the row index of the calendar grid's active cell
		colIndex - [Optional] Integer, the cell index i.e. the column index of the calendar grid's active cell
	*/
		setMonth(ANIMATE_MONTHS_FROM_LEFT, SET_PREVIOUS_YEAR, rowIndex, colIndex);
	}
	function setNextMonth(rowIndex, colIndex) {
	/*
		Moves the calendar to the next month
		
		rowIndex - [Optional] Integer, the row index of the calendar grid's active cell
		colIndex - [Optional] Integer, the cell index i.e. the column index of the calendar grid's active cell
	*/
		setMonth(ANIMATE_MONTHS_FROM_BOTTOM, SET_NEXT_MONTH, rowIndex, colIndex);
	}
	
	function setPrevMonth(rowIndex, colIndex) {
	/*
		Moves the calendar to the previous month
		
		rowIndex - [Optional] Integer, the row index of the calendar grid's active cell
		colIndex - [Optional] Integer, the cell index i.e. the column index of the calendar grid's active cell
	*/
	
		setMonth(ANIMATE_MONTHS_FROM_TOP, SET_PREVIOUS_MONTH, rowIndex, colIndex);
	}
	
	function setMonth(animationDirection, newDateMarker, rowIndex, colIndex) {
	/*
		Moves the calendar to some date, with animation
		
		animationDirection - The animation type indicator
		newDateMarker - the date marker, with shows how the _activeDate should be moved, or the new date as a JS Date Object
		rowIndex - [Optional] Integer, the row index of the calendar grid's active cell
		colIndex - [Optional] Integer, the cell index i.e. the column index of the calendar grid's active cell
	*/	
		var prevYear, prevMonth, prevDay
			, newYear, newMonth, newDay
		;
		
		//starts default the animation to the new month
		animateMonths(animationDirection);
		
		//records the current date 
		prevYear = _activeDate.getFullYear();
		prevMonth = _activeDate.getMonth();
		prevDay = _activeDate.getDate();
		
		//sets the new date based on the date marker
		if(newDateMarker instanceof Date) {
			_activeDate = newDateMarker;
		} else {
			switch(newDateMarker) {
				default:
					throw('CalendarObject::setMonth() - unknown date marker "newDateMarker"');
					break;
				case SET_NEXT_MONTH:
					_activeDate.setMonth(_activeDate.getMonth() + 1);
					break;
				case SET_PREVIOUS_MONTH:
					_activeDate.setMonth(_activeDate.getMonth() - 1);
					break;
				case SET_NEXT_YEAR:
					_activeDate.setFullYear(_activeDate.getFullYear() + 1);
					break;
				case SET_PREVIOUS_YEAR:
					_activeDate.setFullYear(_activeDate.getFullYear() - 1);
					break;
			}
		}		
		
		//sets the data for the new month
		if(!setNewMonth(rowIndex, colIndex)) {
			//if the new date was limited, then switches the animation to the out of ragne movement animation
						
			newYear = _activeDate.getFullYear();
			newMonth = _activeDate.getMonth();
			newDay = _activeDate.getDate();
			
			//checks if the new month was limited to the already set month
			if(newYear == prevYear && newMonth == prevMonth && newDay == prevDay) {
				
				//stops the normal animation, for the current month animation				
				_InactiveMonth.$root.finish();
				_ActiveMonth.$root.stop(true).css({
					left : 0
					,top : 0
				});
				
				animateToDisabledMonth(animationDirection, 'fast');
			} else {
				animateToDisabledMonth(animationDirection);
			}			
		}
	}
	
	function animateMonths(animationDirection) {
	/*
		Does the month animation from aider top, bottom, left or right
	*/		
		var obj, inactiveLeft, inactiveTop
			, width = _ActiveMonth.$root.width()
			, height = _ActiveMonth.$root.height()
		;
		
		_ActiveMonth.$root.finish();
		_InactiveMonth.$root.finish();
		
		width = _ActiveMonth.$root.width();
		height = _ActiveMonth.$root.height();
		
		switch(animationDirection) {
			case ANIMATE_MONTHS_FROM_LEFT:
				inactiveLeft = 0 - width;
				inactiveTop = 0;
				break;
			case ANIMATE_MONTHS_FROM_RIGHT:
				inactiveLeft = width;
				inactiveTop = 0;
				break;
			case ANIMATE_MONTHS_FROM_TOP:
				inactiveLeft = 0;
				inactiveTop = 0 - height;
				break;
			case ANIMATE_MONTHS_FROM_BOTTOM:
				inactiveLeft = 0;
				inactiveTop = height;
				break;
			case ANIMATE_MONTHS_NONE:
				return;
			default:
				throw("CalendarObject::animateMonths() - Unknows animation requested");
				break;
		}
		
		_$monthContainer.css({
			width : width + 'px'	
			,height : height + 'px'			
			,position : 'relative'
			,top : '0px'
			,left : '0px'
			,overflow : 'hidden'
		});
		
		_ActiveMonth.$root.css({
			position : 'absolute'
			,top : '0px'
			,left : '0px'
			,width : width + 'px'
			,height : height + 'px'
		}).show();
		
		_InactiveMonth.$root.css({
			position : 'absolute'
			,top : inactiveTop + 'px'
			,left : inactiveLeft + 'px'
			,width : width + 'px'
			,height : height + 'px'
			
		}).show();
		
		obj = _InactiveMonth;
		_InactiveMonth = _ActiveMonth;
		_ActiveMonth = obj;
		
		_inactiveMonthLeft = 0 - inactiveLeft;
		_inactiveMonthTop = 0 - inactiveTop;
		
		_InactiveMonth.$root.animate({
			left : _inactiveMonthLeft
			,top : _inactiveMonthTop
		}, 'slow', null, function() {
			_InactiveMonth.$root.hide();
		});
		
		_ActiveMonth.$root.animate({
			left : 0
			,top : 0
		}, 'slow', null, function() {
			animationStoped();	
		});	
	}
	
	function animateToDisabledMonth(animationType, animationSpeed) {
	/*
		Resets the month animation to the animation for the calendar that tries to move onto a disabled day, but was limited
		
		animationType - the type of month animation the calendar should perform
		animationSpeed - the animation speed as set by the jQuery.animate() method
	*/		
		var offset, activeLeft, activeTop;
		
		if(animationSpeed == undefined) {
			animationSpeed = 'slow';
		}
		
		switch(animationType) {
			case ANIMATE_MONTHS_FROM_LEFT:
				offset = Math.ceil(_ActiveMonth.$root.width() * 0.2);
				
				activeLeft = offset;
				activeTop = 0;				
				break;
			case ANIMATE_MONTHS_FROM_RIGHT:
				offset = Math.ceil(_ActiveMonth.$root.width() * 0.2);
				
				activeLeft = 0 - offset;
				activeTop = 0;				
				break;
			case ANIMATE_MONTHS_FROM_TOP:
				offset = Math.ceil(_ActiveMonth.$root.height() * 0.1);
				
				activeLeft = 0;
				activeTop = offset;
				break;
			case ANIMATE_MONTHS_FROM_BOTTOM:				
				offset = Math.ceil(_ActiveMonth.$root.height() * 0.1);		
				activeLeft = 0;
				activeTop = 0 - offset;				
				break;
			case ANIMATE_MONTHS_NONE:
				return;
		};
		
		_InactiveMonth.$root.stop(true).animate({
			left : _inactiveMonthLeft + activeLeft
			,top : _inactiveMonthTop + activeTop
		}, animationSpeed, null, function() {
			_InactiveMonth.$root.hide();
		});
		
		_ActiveMonth.$root.stop(true).animate({
			left : activeLeft
			,top : activeTop
		}, animationSpeed, null).animate({
			left : 0
			,top : 0
		}, null, null, function(){
			animationStoped();
		});		
	}
	
	function animationStoped() {
	/*
		Resets the calendar to the normal setting after the animation so the CSS could reorganize the calendar		
	*/
	
		_ActiveMonth.$root.css({
			position : 'relative'
			,width : 'auto'
			,height : 'auto'
		});
		_InactiveMonth.$root.css({
			width : 'auto'
			,height : 'auto'
		});
		_$monthContainer.css({
			width : 'auto'	
			,height : 'auto'			
			,position : 'relative'
			,top : '0px'
			,left : '0px'
			,overflow : 'hidden'
		});
	}
	
	function setNewMonth(rowIndex, colIndex) {
	/*
		Sets the month to the _activeDate
		
		Returns TRUE if the month could be set to the _activeDate and FALSE if the _activeDate was on a disabled date
	*/
		
		var intMonth, intYear, date, monthObj, intLimitMonth, intLimitYear;
		
		_InactiveMonth.removeTabIndex();
		
		if(typeof rowIndex == 'number' && typeof colIndex == 'number') {
			date = _activeDate;			
			monthObj = _ActiveMonth.setMonth(date, rowIndex, colIndex);
			_ActiveMonth.focusOnActiveDate();			
		} else {
			monthObj = _ActiveMonth.setMonth(_activeDate);
		}
		
		if(monthObj.isLimited) {
			_activeDate = new Date(monthObj.date.getFullYear(), monthObj.date.getMonth(), 1);			
		}
		
		intMonth = _activeDate.getMonth();
		intYear = _activeDate.getFullYear();
		
		if(_dateLimitFrom instanceof Date) {
			intLimitMonth = _dateLimitFrom.getMonth();
			intLimitYear = _dateLimitFrom.getFullYear();
			
			if(intMonth == intLimitMonth && intYear == intLimitYear) {
				_PrevYearButton.disable();
				_PrevMonthButton.disable();
			} else {
				_PrevYearButton.enable();
				_PrevMonthButton.enable();
			}
		}
		
		if(_dateLimitTo instanceof Date) {
			intLimitMonth = _dateLimitTo.getMonth();
			intLimitYear = _dateLimitTo.getFullYear();
			
			if(intMonth == intLimitMonth && intYear == intLimitYear) {
				_NextYearButton.disable();
				_NextMonthButton.disable();
			} else {
				_NextYearButton.enable();
				_NextMonthButton.enable();
			}
		}
		
		_CurrentMonthButton.setText(_longMonthNameArr[intMonth] + ' ' + intYear, _Settings.Phrases.getYearBreakDown.replace('{0}', intYear));
		
		_PrevYearButton.setText(null, _longMonthNameArr[intMonth] + ' ' + (intYear - 1));		
		_NextYearButton.setText(null, _longMonthNameArr[intMonth] + ' ' + (intYear + 1));
		
		date = new Date(intYear, intMonth, 1);
		date.setMonth(intMonth - 1);
		_PrevMonthButton.setText(null, _longMonthNameArr[date.getMonth()] + ' ' + date.getFullYear());
		
		date.setMonth(intMonth + 2);
		_NextMonthButton.setText(null, _longMonthNameArr[date.getMonth()] + ' ' + date.getFullYear());		
		
		if(!_isCalendarOpen) {
			_ActiveMonth.removeTabIndex();			
		}
		
		return !monthObj.isLimited;
	}
	
	function _load() {
	/*
		The function that will be called when the document has been loaded
	*/
		var intSelectedDate, intSelectedMonth, intSelectedYear;
		
		_selectedDate = _Settings.defaultSelectedDate;		
		
		_activeDate = new Date();
		intSelectedDate = _activeDate.getDate();
		intSelectedMonth = _activeDate.getMonth();
		intSelectedYear = _activeDate.getFullYear();
		
		_activeDate = new Date(intSelectedYear, intSelectedMonth,  intSelectedDate);
		if(_selectedDate != null) {
			_selectedDate = new Date(intSelectedYear, intSelectedMonth,  intSelectedDate);		
			_ActiveMonth.setSelectedDate(_selectedDate, true);
		}	
		
		setNewMonth();
		_activeDate.setDate(1);
		
		removeCalendarFromTabOrder();
		removeNavigatorFromTabOrder();
		
		if(!_Settings.isDropDown) {
			_$calendar
				.bind('mousewheel', mouseWheelScroll)
				.bind('touchstart', touchStart)
			;
		}
		
		//openCalendar();
	}
	
	function stopEvent(e) {
	/*
		Simply stops all events
	*/
		e.preventDefault();
		return false;
	}
	
	function selectionIndicatorClick() {
	/*
		The click event handler for the selection indicator click
	*/
		if(_isCalendarOpen) {
			closeCalendar();
		} else {
			openCalendar();
		}
		
		return false;
	}
	
	function mouseWheelScroll(e, delta, deltaX, deltaY) {
	/*
		Handles the mouse wheel scroll
	*/
		if(delta > 0) {
			
			//moves to the previous month or period i.e. was scrolled up
			if(_isExtraNavigatorOpen) {
				previusExtraPeriodButtonClick();
			} else {
				setPrevMonth();
			}
			
			e.preventDefault();
		} else if(delta < 0) {
			
			//moves to the next month or period  i.e. was scrolled down
			if(_isExtraNavigatorOpen) {
				nextExtraPeriodButtonClick();
			} else {
				setNextMonth();
			}
			
			e.preventDefault();
		}
	}
	
	function touchStart(e) {
	/*
		The touch start event handler
	*/
		var pos;
		
		if(e.originalEvent.touches.length > 1) {					
			return true;
		}
		
		pos = getMousePos(e);
		
		_touchX = pos.x;
		_touchY = pos.y;
		
		_$doc
			.bind('touchmove', stopEvent)
			.bind('touchend', touchEnd)
		;
		
		_swipeTimer = setTimeout(function(){
			_$doc
				.unbind('touchmove', stopEvent)
				.unbind('touchend', touchEnd)
			;
		}, 350);		
	}
	
	function touchEnd(e) {
	/*
		The touch end event handler
	*/	
		var pos, absX, absY;
				
		if(e.originalEvent.touches.length > 1) {					
			return true;
		}
		
		if(typeof _swipeTimer == 'number') {
			clearTimeout(_swipeTimer);
		}
		
		_$doc
			.unbind('touchmove', stopEvent)
			.unbind('touchend', touchEnd)
		;
		
		if(_isCalendarOpen || !_Settings.isDropDown) {
			pos = getMousePos(e);		
			absX = Math.abs(_touchX - pos.x);
			absY = Math.abs(_touchY - pos.y);
			
			if(absX > 30 && absY < 100) {
				if(pos.x > _touchX) {
					//moves to the previous month or period  i.e. was swiped left
					if(_isExtraNavigatorOpen) {
						previusExtraPeriodButtonClick();
					} else {
						setPrevMonth();
					}
				} else {
					//moves to the next month or period  i.e. was swiped right
					if(_isExtraNavigatorOpen) {
						nextExtraPeriodButtonClick();
					} else {
						setNextMonth();
					}
				}
				
				e.preventDefault();
			}			
		}		
		
		return true;
	}
	
	function getMousePos(e) {
	
		var ret = null, touch;
		
		if (!e) var e = window.event;
		if(e == undefined)		
			return ret;
		if(e.originalEvent) { //if this is a jQuery event makes sure this gets the original browser event
			e = e.originalEvent;
		}
		if(e.touches && e.touches.length) {
			
			touch = e.touches[0];
			if(typeof touch == 'object') {
				ret = {
					x : touch.pageX
					,y : touch.pageY
				};
			}
		} else if(e.changedTouches && e.changedTouches.length) {
			touch = e.changedTouches[0];
			if(typeof touch == 'object') {
				ret = {
					x : touch.pageX
					,y : touch.pageY
				};
			}
		} else {
			if (e.pageX || e.pageY) {
				ret = {
					x : e.pageX
					,y : e.pageY
				};
			} else if (e.clientX || e.clientY) {
				if(document.body == null || document.body == undefined) {
					return ret;
				}
				ret = {
					x : e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
					,y : e.clientY + document.body.scrollTop + document.documentElement.scrollTop
				}
			}
		}
		
		return ret;
	}
	
	function openCalendar() {
	/*
		Opens the calendar when it is closed
	*/
		var height;
		
		if(!_isCalendarOpen) {
			_isCalendarOpen = true;
			
			if(_Settings.isDropDown) {
				_$doc.bind('click', closeCalendar);
				
				_$calendar
					.bind('mousewheel', mouseWheelScroll)
					.bind('touchstart', touchStart)
				;
			}
			
			_$doc
				.bind('keydown', documentKeyDown)
				.bind('keyup', documentKeyUp)				
			;
			
			_$hiddenButton.attr({
				'aria-expanded' : 'true'
			});
			_CloseButton.attr({
				'aria-expanded' : 'true'
			});
			_$calendar.attr({
				'aria-hidden' : 'false'
			});			
			
			if(_isExtraNavigatorOpen) {
				removeCalendarFromTabOrder();
				addNavigatorToTabOrder();	
			} else {
				addCalendarToTabOrder();
				removeNavigatorFromTabOrder();
			}			
			
			height = _$selectionIndicator.height();
			
			if(_Settings.isDropDown) {
				_$calendar.stop(true).show().css({
					display : 'block'
					,top : (0 - height) + 'px'
					,opacity : 0
				}).animate({
					top : 0
					,opacity : 1
				});	
			} else {
				if(_isExtraNavigatorOpen) {
					_ExtraPrevButton.focus();
				} else {
					_PrevYearButton.focus();
				}
				
			}			
		}		
		
		return false;
	}
	
	function closeCalendar(doNotFocus) {
	/*
		Closes the calendar when it is opened
	*/
		var height;
		
		if(_isCalendarOpen) {
			_isCalendarOpen = false;
			
			if(_Settings.isDropDown) {
				_$doc.unbind('click', closeCalendar);
				
				_$calendar
					.unbind('mousewheel', mouseWheelScroll)
					.unbind('touchstart', touchStart)
				;
			}
			
			_$doc
				.unbind('keydown', documentKeyDown)
				.unbind('keyup', documentKeyUp)
			;			
			
			_ActiveMonth.enableKeyboardMovement();
			_InactiveMonth.enableKeyboardMovement();
			_isCtrlDown = false;
			
			if(_Settings.isDropDown) {
				closeExtraNavigation();
			}			
			
			removeCalendarFromTabOrder();
			removeNavigatorFromTabOrder();
			
			_$hiddenButton.attr({
				'aria-expanded' : 'false'
			});
			_CloseButton.attr({
				'aria-expanded' : 'false'
			});
			_$calendar.attr({
				'aria-hidden' : 'true'
			});
			
			height = _$selectionIndicator.height();
			
			if(_Settings.isDropDown) {
				_$calendar.stop(true).animate({
					top: 0 - height
					,opacity : 0
				}, null, null, function(){
					_$calendar.hide();
				});		
			}		
			
			if(!doNotFocus) {
				_$hiddenButton.focus();
			}			
		} else {
			_ActiveMonth.removeTabIndex();
			_InactiveMonth.removeTabIndex();
		}
		
		return false;
	}
	
	function buttonFocus() {
	/*
		The focus of the the hidden button
	*/
		
		if(typeof _blurTimeoutTimer == 'number') {
			clearTimeout(_blurTimeoutTimer);
		}
		
		if(!_Settings.isDropDown) {
			_$calendar.css({
				overflow : 'visible'
			});
		}
		
		_$selectionFocusIndicator.css({
			display : 'block'
		});
	}
	
	function buttonBlur(e) {
	/*
		The focusout of the the hidden button
	*/	
		//NB! - The focus elements visibility needs to be handled via the timeout so the changing of the style would not interfier with the click
		//Have not found out why this happens, there seams to be no event overlap with turns off the even bubbling on the blur
		if(typeof _blurTimeoutTimer == 'number') {
			clearTimeout(_blurTimeoutTimer);
		}
		
		if(!_Settings.isDropDown) {
			_$calendar.css({
				overflow : 'hidden'
			});
		}
		
		_blurTimeoutTimer = setTimeout(function() {
			_$selectionFocusIndicator.css({
				display : 'none'
			});	
		}, 100);		
	}
	
	_init();
};