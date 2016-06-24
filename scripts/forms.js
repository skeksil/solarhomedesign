// Form-related javascript

var form_errors = new Array();

// prevent double-submissions by disabling 'submit' buttons after submit
function form_disable_submit(myForm)
{
	for (var c=0; c < myForm.length; c++) {
		if (myForm[c].name.toLowerCase().indexOf('submit') == 0) {
			myForm[c].disabled = true;
		}
	}
}

// Unlock submit buttons (called if submit was aborted)
function form_enable_submit(myForm)
{
	for (var c=0; c < myForm.length; c++) {
		if (myForm[c].name.toLowerCase().indexOf('submit') == 0) {
			myForm[c].disabled = false;
		}
	}
}

// update and reload the form page when a value is chosen
function form_reload(myField, page)
{
	if (arguments.length == 1) page = window.location;
	myField.form.action = page;
	myField.form.submit();
}

// Like form_reload but only happens if 'value is selected
function form_reload_if(myField, page, value)
{
	var myFieldVal = myField.options[myField.selectedIndex].text;
	if (myFieldVal == value) {
		form_reload(myField, page);
	}
}

// shortcut to submit main form
function form_submit(myField)
{
	myField.form.submit();
}

function wait_animation()
{
	var myMsg = "Sending form data to server... Please Wait...<br>";
	window.status = myMsg;
	msg(myMsg + "<img name='wait' src='/all/images/wait.gif' height=7 width=78> ");
	obj('messageControls').style.display = 'none';
}

function long_wait_animation()
{
	var myMsg = "Still sending... You are uploading large files and we have not yet received " +
							"all the information. Unfortunately, Internet Explorer sometimes interprets " +
							"this delay as a server error. If you receive a 'Timeout' or 'Site not found' " +
							"error please click your 'Back' button and try sending less files.<br>";
	window.status = "Still sending ...";
	msg(myMsg + "<img name='wait' src='/all/images/wait.gif' height=7 width=78> ");
	obj('messageControls').style.display = 'none';
}

// Generic onSubmit handler
function form_on_submit( myForm )
{
	form_check_lists( myForm );
	if (form_errors.length != 0) {
		err(	'There are some problems with the information you entered:' +
					'<ul><li>' + form_errors.join('<li>') );
		form_enable_submit(myForm); // re-enable submit (so user can retry)
	} else {
		hidePopup('alert');
		window.status = "Uploading Data... Please Wait...";
		form_disable_submit(myForm); // function that prevents double-submissions
		window.setTimeout("wait_animation()", 10);  			// 1/100th sec (must happen after submit)
		window.setTimeout("long_wait_animation()", 60*1000); // 60 secs
		myForm.submit();
	}
	// reset form errors
	form_errors = new Array();
	return false;   // false=don't submit (because we probably just submitted it).
}

// Displays FORM validation errors
function form_err(myForm, myField, myValue, myMsg)
{
	var myMsgArray = new Array(myMsg);
	form_errors.push( myMsgArray );			// add message to errors array
	myField.className = myField.className + ' form_error';		// highlight bad field
	return true;												// force CFMX form validation to continue
}


// Reset FORM validation errors
function form_ok(myField)
{
	myField.className = myField.className.replace(/ form_error/,'');
}


// Limits the length of textarea fields
function textLimit(field, maxlen) {
	if (field.value.length > maxlen + 1)
		alert('Maximum ' + maxlen + ' characters. Your input has been truncated!');
	if (field.value.length > maxlen)
		field.value = field.value.substring(0, maxlen);
}

// Check for unselected select elements (not used with cf)
function form_check_lists(myForm)
{
	// loop over every field in form
	for (var counter = 0; counter < myForm.length; counter++) {
		var myField = myForm[counter];
		// check if field is a select box
		if (myField.type == "select-one") {
			// check for "--" as first two characters of selected value
			var mySelectedOption = myField.options[myField.selectedIndex];
			if (mySelectedOption.text.indexOf("--") == 0) {
				form_err(myForm, myField, mySelectedOption.value, 'You must select a value for \'' + myField.title + '\'.');
			}
		}
	}
}

function form_check_int(myForm, myField, myValue)
{
	re = /([^0-9]*)/g;
	var val = parseInt( myValue.replace(re,"") );
	if ( !isNaN(val) ) {
		myField.value = val;
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}

function form_check_year(myForm, myField, myValue)
{
	re = /([^0-9]*)/g;
	var val = parseInt( myValue.replace(re,"") );
	if ( (!isNaN(val)) && (val >= 1920) && (val <= 2020) ) {
		myField.value = val;
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}

function form_check_price(myForm, myField, myValue)
{
	var re = /([^0-9.]*)/g;
	var val = parseInt( myValue.replace(re,"") );
	if ( !isNaN(val) ) {
		myField.value = val;
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}

function form_force_float(myForm, myField, myValue)
{
	var re = /([^0-9.]*)/g;
	var val = forceFloat( myValue.replace(re,"") );
	if ( !isNaN(val) ) {
		myField.value = val;
	} else {
		myField.value = 0;
	}
	return true;
}

function form_force_int(myForm, myField, myValue)
{
  var re_cents = /(\.\d+)/;
  var val = myValue.replace(re_cents,"");
	var re = /([^0-9]*)/g;
	var val = parseInt( val.replace(re,"") );
	if ( !isNaN(val) ) {
		myField.value = val;
	} else {
		myField.value = 0;
	}
	return true;
}

function form_check_text(myForm, myField, myValue)
{
	if ( myValue != "" ) {
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}

function form_check_phone(myForm, myField, myValue)
{
	re = /([^0-9]*)/g;
	var val = parseInt( myValue.replace(re,"") );
	if ( !isNaN(val) ) {
		myField.value = val;
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}

function form_check_list(myForm, myField, myValue)
{
	if ( myValue != "" ) {
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}

/* not required for dealers */
var card_required = true;

function form_check_password(myForm, myField, myValue)
{
	// check for minimum length
	var minLength = 6;
	if ( myValue.length >= minLength) {
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}


function form_confirm_password(myForm, myField, myValue)
{
	if ( myValue == myForm.password.value ) {
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}


// If the admin changes a user role we change CC requirement
function form_change_role( role )
{
	if ( role == "dealer" || role == "admin" ) {
		var card_required = false;
	} else {
		var card_required = true;
	}
}


function form_check_card_full_name(myForm, myField, myValue)
{
	if ( myValue != "" || !card_required ) {
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}


function form_check_card_num(myForm, myField, myValue)
{
	re = /([^0-9]*)/g;
	var val = myValue.replace(re,"");
	if ( (!isNaN(parseInt(val)) && val.length > 11 && val.length < 17) || !card_required ) {
		myField.value = val;
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}


function form_check_card_expiry(myForm, myField, myValue)
{
	re = /([^0-9]*)/g;
	var val = myValue.replace(re,"");
	if ( (!isNaN(parseInt(val)) && val.length == 4) || !card_required) {
		myField.value = val;
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}

// Used to syncronise feet/inches with metres
function form_sync_length(myField)
{
	var temp = new Array();
	temp = myField.name.split('_');
	var name = temp[0];
	var unit = temp[1];
	switch(unit) {
		case 'm':
			var total_inches = Math.round(forceFloat(myField.value) * 39.37008);
			var feet = Math.floor(total_inches / 12);
			var inches = total_inches - (feet * 12);
			myField.form[name + '_' + 'ft'].value = feet;
			myField.form[name + '_' + 'in'].value = inches;
			break;
		case 'ft':
			var inches = forceFloat(myField.form[name + '_' + 'in'].value);
			var total_inches = (forceFloat(myField.value) * 12) + inches;
			var metres = total_inches * 0.0254;
			myField.form[name + '_' + 'm'].value = Math.round(metres*100)/100;
			break;
		case 'in':
			var feet = forceFloat(myField.form[name + '_' + 'ft'].value);
			var total_inches = forceFloat(myField.value) + (feet*12);
			var metres = total_inches * 0.0254;
			myField.form[name + '_' + 'm'].value = Math.round(metres*100)/100;
			break;
	}
}

function form_check_email(myForm, myField, myValue)
{
	if (myValue.indexOf('@') > 0) {
		form_ok(myField); // reset to default style
		return true;
	} else {
		return false;
	}
}

function form_text_limit(myTextArea, myCounter, myLimit)
{
	var myTextAreaObj = obj( myTextArea );
	var myCounterObj = obj( myCounter );
	var myTextLen = myTextAreaObj.value.length;
	myCounterObj.value = myTextLen;
	if( myTextLen > myLimit ) {
		myCounterObj.style.fontWeight = 'bold';
		myCounterObj.style.color = '#ff0000';
	} else if( myTextLen <= myLimit ) {
		myCounterObj.style.fontWeight = 'normal';
		myCounterObj.style.color = '#000000'; 
	}
}

// FORM PRICE OPTIONS: Insert a list of options covering a price range into a form select. Also selects the 'selected' value if it exists.
function form_price_options( form_name,select_name, start, stop, step, selected ) {
	var options = document.forms[form_name][select_name].options;
	var i = options.length; // index (allows for existing options)
	var v = 0; // value
	for (v=start; v<=stop; v=v+step) {
		options[i] = new Option(toMoneyNoCents(v),v);
		if (v == selected) {
			options[i].selected = true;
		}
		i++;
	}
}

// --------------------------
// COLDFUSION FORM VALIDATION
// --------------------------

// ColdFusion JavaScript functions for cfform client-side validation (Modified by SpliFF)

var _CF_loaded=0;

function _CF_signalLoad()
{
	_CF_loaded = 1;
}

function _CF_onError(form_object, input_object, object_value, error_message)
{
	return form_err(form_object, input_object, object_value, error_message);
}

function _CF_hasValue(obj, obj_type)
{
	if (obj_type == "TEXT" || obj_type == "PASSWORD")
	{
		/* TODO: why isn't obj defined? 
		if (obj.value == "") 
	  		return false;
		else 
	  		return true;
		*/
	}
	else if (obj_type == "SELECT")
	{
		for (i=0; i < obj.length; i++)
		{
			if (obj.options[i].selected && !(obj.options[i].value.indexOf('--') == 0))
			return true;
		}
		return false;
	}
	else if (obj_type == "SINGLE_VALUE_RADIO" || obj_type == "SINGLE_VALUE_CHECKBOX")
	{
		if (obj.checked)
			return true;
		else
	   		return false;	
	}
	else if (obj_type == "RADIO" || obj_type == "CHECKBOX")
	{
		for (i=0; i < obj.length; i++)
		{
			if (obj[i].checked)
				return true;
		}
	   	return false;	
	}
}

function _CF_checkrange(object_value, min_value, max_value)
{
	if (object_value.length == 0)
		return true;

	if (!_CF_checknumber(object_value))
		return false;
	else
		return (_CF_numberrange((eval(object_value)), min_value, max_value));

	return true;
}

function _CF_setFormParam( strFormName, strParamName, strParamValue )
{
	var strObjName = "document." + strFormName + "." + strParamName;
	var obj = eval( strObjName );
	obj.value = strParamValue;
	return true;
}

function _CF_checkregex(object_value, regex)
{
	return regex.test(object_value);
}

