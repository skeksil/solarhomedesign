// Browser detect
var w3c=0; var ie=0; var old=0;
if (document.all) { //IS Internet Explorer
	ie = 1; 
} else if (document.getElementById && !document.all) { //IS W3C DOM COMPLIANT (Mozilla)
	moz = 1;
} else { // Probably a very old browser. It's going to break no matter what we do.
	old = 1;
}

// Easy way to change pages
function go( where )
{
	window.location = where;
	return false;
}
function goExternal( where )
{
	window.open( where );
	return false;
}

// Reload current page
function reloadPage() {
	window.location.replace( unescape(window.location.pathname) );
}

// Cross-browser way to get objects by ID
function obj(ref)
{
	if (ie) {
		return document.all[ref];
	}
	if (moz) {
		return document.getElementById(ref);
	}
}

// Dynamically change CSS class
function setClass(ref, newClass)
{
	obj(ref).className=newClass;
}

function setText(ref,text)
{
	obj(ref).innerHTML = text;
}

function confirmDelete(str)
{
	return confirm('This will remove ' + str + ' from the server. Are you sure?');
}

function printPage()
{
	if (window.print) window.print();
}

function getWinWidth()
{
	if (moz) {
	  return window.innerWidth;
	 }
	 else if (ie) {
	  return document.body.offsetWidth;
	 }
	 else {
	  return 640;
	}
}

// Resize Window Event (disabled because interferes with forms)
//function onResize () {
//	// Reload Page
//	window.location.href = window.location.href;
//}
//window.onresize = onResize;


// Mouseover events for rows. CSS :hover does this better but IE is fucked.

function setClassOver( elem )
{
	elem.className = elem.className + '_over';
}

function setClassOut( elem )
{
	if (elem.className) {
		elem.className.subString(0,4);
		elem.className = elem.className.subString(0,elem.className.lastIndexOf("_"));
		alert( elem.className );
	}
}

function makeRowsHover( tableId ) 
{
	if (ie) {
		var myTable = obj(tableId);
		for (var i = 0; i < myTable.rows.length; i++) {
			var row = myTable.rows[i];
			row.onmouseover = setClassOver;
			row.onmouseout = setClassOut;
		}
	}
}


// LIST FIND NEXT: Finds next instance of 'val' in array 'list', wrapping around.
function ListFindNext( list, val, pos ) {
	var i=0;
	for (i=1;i <= list.length;i=i+1) {
		if (pos == list.length) {
			pos = 1;
		} else {
			pos = pos + 1;
		}
		if ( list[pos-1] == val ) {
			return pos;
		}
	}
	return false;
};


// LIST FIND PREV: Finds previous instance of 'val' in array 'list', wrapping around.
function ListFindPrev( list, val, pos ) {
	var i=0;
	for (i=1;i <= list.length;i=i+1) {
		if (pos == 1) {
			pos = list.length;
		} else {
			pos = pos - 1;
		}
		if ( list[pos-1] == val ) {
			return pos;
		}
	}
	return false;
};


// Conversion / Formatting functions

function forceInt( val ) {
	val = parseInt(val);
	if (isNaN(val)) val = 0;
	return val;
};

function forceFloat( val ) {
	val = parseFloat(val);
	if (isNaN(val)) val = 0.0;
	return val;
};

// Original:  Cyanide_7 (leo7278@hotmail.com)
// Web Site:  http://www7.ewebcity.com/cyanide7

// This script and many more are available free online at
// The JavaScript Source!! http://javascript.internet.com

function toMoney( num ) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num)) num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num*100+0.50000000001);
	cents = num%100;
	num = Math.floor(num/100).toString();
	if(cents<10) cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		num = num.substring(0,num.length-(4*i+3))+','+
		num.substring(num.length-(4*i+3));
	return (((sign)?'':'-') + '$' + num + '.' + cents);
}

function toMoneyNoCents( num ) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num)) num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num*100+0.50000000001);
	num = Math.floor(num/100).toString();
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		num = num.substring(0,num.length-(4*i+3))+','+
		num.substring(num.length-(4*i+3));
	return ( ((sign)?'':'-') + '$' + num );
}

// Hack for IE activation of objects
function activateObjects() {
	if (document.body.outerHTML) {
		objects = document.getElementsByTagName("object");
		for (var i = 0; i < objects.length; i++) {
			objects[i].outerHTML = objects[i].outerHTML;
		}
	}
}