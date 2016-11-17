"use strict";
/*! Developed by Illimar Pihlam�e | e-mail: illimar@idra.pri.ee | Euroland Estonia � 2016 | e-mail: illimar@euroland.com */
var CalendarButtonObject = function(_Settings) {
/*
	The Button object that handels a hidden button and a visual button
*/
	var 
		CLASS_NAME = 'Button'
	;
	
	this.$root = null;
	this.focusCall = null;
	this.blurCall = null;
	
	/********************************************************************************
	These variables are commented out, because they need to be added using prototype.
	---------------------------------------------------------------------------------
	
	this.Settings = {}
		
	********************************************************************************/
	
	var This = this
		,_DefaultSettings = {
			Phrases : {
				hiddenButtonText : '' //The hidden button text, by default the same as the visualButtonText
				,visualButtonText : '' //The visible button text
				,label : '' //The hidden button label, that will be added to the button
			}
			,parentClassName : '' //the parent class name name of the parent object that will be appended to this object
			,extraVisualButtonClass : '' //String allows the client programmer to add in a new class name for the visual button
			,$root : null //allows you to set the $root element
			,onClickCall : null //the onClick call 
			,value : null //some sort of value that is given to the _Settings.onClickCall
			,isDisabled : false //if TRUE the button is dissabled
		}
		
		,_$button = $(document.createElement('button')).attr({ type : 'button' }) //the hidden button
		,_$visualButton = $(document.createElement('span')) //the button that will be visible to the normal user
		,_$labelText = $(document.createElement('span')) //the label text
		,_$label = $(document.createElement('label')) //the actual label container
		
		,_strFocusClassName = '' //String, the visual button's focus class name
		,_strDisabledClassName = '' //String, the visual button's disabled class name
	;
	
	function _init() {		
		_Settings = $.extend(true, {}
			,_DefaultSettings
			,typeof This.Settings != 'object' ? {} : This.Settings
			,typeof _Settings != 'object' ? {} : _Settings			
		);
		
		if(_Settings.parentClassName.length) {
			CLASS_NAME = _Settings.parentClassName + '-' + CLASS_NAME;
		} else {
			CLASS_NAME = 'Euroland-CommonObjects-Calendar-' + CLASS_NAME;
		}
		 
		if(_Settings.$root instanceof jQuery) {
			This.$root = _Settings.$root;
		} else {
			This.$root = $(document.createElement('div'));
		}
				
		_$label
			.addClass(CLASS_NAME + '-HiddenButton')
			.append(_$labelText).attr({
				tabIndex : -1
			})
			.append(document.createTextNode(' '))
		;
		
		_strFocusClassName = CLASS_NAME + '-VisualButton-Focus';
		_strDisabledClassName = CLASS_NAME + '-VisualButton-Disabled';
		
		if(typeof _Settings.Phrases.hiddenButtonText != 'string') {
			_Settings.Phrases.hiddenButtonText = _Settings.Phrases.visualButtonText;
		}
		
		_$button
			.text(_Settings.Phrases.hiddenButtonText)
			.bind('focus', buttonFocus)
			.bind('blur', buttonBlur)
			.bind('click', This.click)
		;
		_$visualButton
			.text(_Settings.Phrases.visualButtonText).addClass(CLASS_NAME + '-VisualButton')
			.bind('click', This.click)
			.attr({
				"aria-hidden" : 'true'
				,role : 'presentation'
			})
		;
		
		if(_Settings.isDisabled) {
			This.disable();
		}
		
		if(_Settings.extraVisualButtonClass.length) {
			_$visualButton.addClass(_Settings.extraVisualButtonClass);
		}
		
		if(_Settings.Phrases.label.length) {
			_$labelText.text(_Settings.Phrases.label);
		}
		
		This.$root
			.append(_$label.append(_$button))
			.append(_$visualButton)
		;		
	}
	
	this.isDisabled = function() {
	/*
		Returns a boolean value showing if the button is dissabled or not
	*/
		return _$button[0].disabled;
	};
	
	this.disable = function() {
	/*
		Disables the button
	*/
		var dom = _$button[0];
		if(!dom.disabled) {
			dom.disabled = true;		
			_$visualButton
				.addClass(_strDisabledClassName)	
				.removeClass(_strFocusClassName)
			;
		}
	};
	
	this.enable = function() {
	/*
		Enables the button
	*/
		var dom = _$button[0];
		if(dom.disabled) {
			dom.disabled = false;
			_$visualButton.removeClass(_strDisabledClassName);
		}		
	};
	
	this.click = function() {
	/*
		The function that will be called on the buttons onClick event
	*/
		if(typeof _Settings.onClickCall == 'function') {
			_Settings.onClickCall(_Settings.value);
		}
	}
	
	this.setText = function(strVisible, strHidden, strLabel) {
	/*
		Sets the text on the visible and hidden button
		
		strVisible - [Optional] String, the visible button text
		strHidden - [Optional] String the hidden button text, if not set, then the visible button text will be used
		strLabel - [Optional] String, sets the hidden label text
	*/		
		if(typeof strVisible == 'string') {
			if(typeof strHidden != 'string') {
				strHidden = strVisible;
			}
			
			_$visualButton.text(strVisible);	
		}
		if(typeof strHidden == 'string') {
			_$button.text(strHidden);
		}		
		
		if(typeof strLabel == 'string') {
			_$labelText.text(strLabel);
		}
	}
	
	this.setLabel = function(strLabel) {
	/*
		Allows to set the label of the hidden button individaully
		
		strLabel - String, sets the hidden label text
	*/
		if(typeof strLabel == 'string') {
			_$labelText.text(strLabel);
		} else {
			_$labelText.empty();	
		}
	}
	
	
	this.attr = function(attrObj) {
	/*
		Allows you to set the attributes for the hidden button
	*/
		_$button.attr(attrObj);
	};
	
	this.focus = function() {		
		_$button.focus();
	};
	this.blur = function() {		
		_$button.blur();
	};
	
	this.addClass = function(strClass) {
	/*
		Adds a CSS class into the visual button
	*/
		_$visualButton.addClass(strClass);
	};
	this.removeClass = function(strClass) {
	/*
		Removes a CSS class from the visual button
	*/	
		_$visualButton.removeClass(strClass);
	};
		
	function buttonFocus() {
		_$visualButton.addClass(_strFocusClassName);
		
		_$label.attr({
			"aria-live" : "polite"
		});
		
		if(typeof This.focusCall == 'function') {
			This.focusCall();
		}
	}
	
	function buttonBlur() {
		_$visualButton.removeClass(_strFocusClassName);
		
		_$label.attr({
			"aria-live" : "off"
		});
		
		if(typeof This.blurCall == 'function') {
			This.blurCall();
		}
	}
	
	_init();
};