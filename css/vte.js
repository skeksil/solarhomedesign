/******************************************************************************
* Version 1.1.2 (August 25 2006)
*
* Author: Torstein Hønsi
* Email: See www.vikjavev.no/megsjol
*
* This script is free for non-commersial use, but leave this header.
*
******************************************************************************/



var vte = {

// Apply your own settings here, or override them in the html file.  
vteDir : 'vte/',
expandSteps : 10, // number of steps in zoom. Each step lasts for duration/step milliseconds.
expandDuration : 250, // milliseconds.
restoreSteps : 10,
restoreDuration : 250,
fullExpandDelay : 500, // delay of the 'full expand'-icon
numberOfImagesToPreload : 5, // set to 0 for no preload
restoreCursor : "zoomout.cur", // necessary for preload
marginLeft : 5,
marginRight : 25, // leave room for scrollbars
marginTop : 5,
marginBottom : 25, // leave room for scrollbars
spaceForCaption : 20, // leaves space below images with captions
captionWidthCorrection : 2, // : image border + padding
zIndexCounter : 1001, // adjust to other absolutely positioned elements
fullExpandIcon : 'fullexpand.gif',
fullExpandTitle : "Expand to actual size",
restoreTitle : "Click to restore thumbnail",
focusTitle : "Click to bring to front",
// END OF YOUR SETTINGS


// declare object properties
preloadTheseImages : new Array(),
expandedImagesCounter : 0,
expanders : new Array(),
mouseIsOverFullExpand : false,
isBusy : false,
container : null,
defaultRestoreCursor : null,
leftBeforeDrag : null,
topBeforeDrag : null,

// drag functionality
ie : document.all,
nn6 : document.getElementById && !document.all,
hasFocused : false,
isDrag : false,
dragX : null,
dragY : null,
dragObj : null,

//--- Find client width and height
clientInfo : function ()	{
    var myWidth = 0;
    var myHeight = 0;
    var scrollTop = -1;
    var scrollLeft = -1;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  
  } else {
    if( document.documentElement &&
        ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
      //IE 6+ in 'standards compliant mode'
      myWidth = document.documentElement.clientWidth;
      myHeight = document.documentElement.clientHeight;
      
      
    } else {
      if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;      
		}
    }
  }
  this.width = myWidth;
  this.height = myHeight;
  
  var iebody = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body

  this.scrollLeft = document.all? iebody.scrollLeft : pageXOffset
  this.scrollTop = document.all? iebody.scrollTop : pageYOffset
} ,

//--- Finds the position of an element
position : function(el)	{ 
	var pos = new Array(2);
	var parent = el;
	pos['x'] = parent.offsetLeft;
	pos['y'] = parent.offsetTop;
	// loop outh through parent elements:
	while (parent.offsetParent)	{
		parent = parent.offsetParent;
		pos['x'] += parent.offsetLeft;
		pos['y'] += parent.offsetTop;
	}
    
	return pos;
}, 

//--- Expander object keeps track of all properties
expander : function() { },


//--- Do the thing
expand : function(a, elId) {
    if (vte.isBusy) return;
    vte.isBusy = true;
    try {
    
        vte.container = document.getElementById('vte-container');    
        
        if (typeof(elId) == 'string') {
            var el = document.getElementById(elId);
        
        } else { // search within the anchor
            for (i = 0; i < a.childNodes.length; i++) {
                if (a.childNodes[i].className && a.childNodes[i].className.match('vte-')) {
                    var el = a.childNodes[i];
                    break;
                }
    		
            }
        }
        
        // check if already open
        for (var i in vte.expanders) {
            if (vte.expanders[i] && vte.expanders[i].thumb == el) {
                vte.isBusy = false;
                return false;
            }
        }
        
        // initialize the new Expander object
        var key = vte.expandedImagesCounter++;
        vte.expanders[key] = new vte.expander();
        var exp = vte.expanders[key];
        exp.a = a;
        
        var imgId = 'expanded-'+ vte.expandedImagesCounter;
        exp.thumbsUserSetId = el.id;
        if (!el.id) el.id = 'thumb-'+ vte.expandedImagesCounter;
        exp.thumb = el;
        
        el.style.cursor = 'wait';

        var pos = vte.position(el);  
                
        // instanciate the wrapper
        var wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.className = 'vte-wrapper';
        wrapper.style.zIndex = vte.zIndexCounter++;
        
        exp.wrapper = wrapper;
        
        // store properties of the thumbnail
        exp.thumbWidth = el.width;
        exp.thumbHeight = el.height;
        exp.thumbLeft = pos['x'];
        exp.thumbTop = pos['y'];
    
        // instanciate the full-size image
        var img = new Image;
        vte.expanders[key].fullImage = img;
        img.onload = function () { vte.showFullImage(key); }
        img.src = a.href;
        img.className = 'vte-expanded-blur '+ el.className;
        img.style.visibility = 'hidden' // hack to prevent flickering in IE
        img.style.display = 'block';
        img.id = imgId;
        img.title = vte.restoreTitle;
        img.onmouseover = function () { setTimeout("vte.showFullExpand('"+ key +"')", vte.fullExpandDelay); }
        img.onmouseout = function () { setTimeout("vte.hideFullExpand('"+ key +"')", 50); }
        img.setAttribute('key', key); // used on drag


        return false; // important!
    
    } catch (e) {
        return true; // script failed: default href fires
    }
    
}, 

//--- Show the image after it has been preloaded
showFullImage : function(key) {

try { 
    var exp = vte.expanders[key];
    
    // prevent looping on certain Mozilla engines:
    if (exp.showFullImageStarted) return;
    else exp.showFullImageStarted = true;
    
    exp.thumb.style.cursor = '';
    
    var newWidth = exp.fullImage.width;
    var newHeight = exp.fullImage.height;
    exp.fullExpandWidth = newWidth;
    exp.fullExpandHeight = newHeight;
    
    exp.fullImage.width = exp.thumb.width;
    exp.fullImage.height = exp.thumb.height;

    var anchor;
    var classNames = exp.thumb.className.split(" ");
    for (var i in classNames) {
        if (classNames[i].match("vte-")) {
            anchor = classNames[i].replace('vte-', '');
        }
    }
    
    
    // identify caption div
    var marginBottomInclCaption = vte.marginRight;
    var thumbsUserSetId = exp.thumbsUserSetId; // id has to be user set
    if (thumbsUserSetId && document.getElementById('caption-for-'+ thumbsUserSetId)) {
        var captionClone = document.getElementById('caption-for-'+ exp.thumb.id).cloneNode(true);
        exp.caption = captionClone;
        marginBottomInclCaption += vte.spaceForCaption;
    }
    
    
    exp.wrapper.appendChild(exp.fullImage)
    exp.wrapper.style.left = exp.thumbLeft;
    exp.wrapper.style.top = exp.thumbTop;
    vte.container.appendChild(exp.wrapper);
    
    var ratio = newWidth / newHeight;
    
    // default (start) values
    var newLeft = parseInt(exp.thumbLeft);
    var newTop = parseInt(exp.thumbTop);
    var oldRight = newLeft + parseInt(exp.thumb.width);
    var oldBottom = newTop + parseInt(exp.thumb.height);
    
    var justifyX;
    var justifyY;
    switch (anchor) {
    case 'auto':
        justifyX = 'auto';
        justifyY = 'auto';
        break;
    case 'top':
        justifyX = 'auto';
        break;
    case 'top-right':
        justifyX = 'right';
        break;
    case 'right':
        justifyX = 'right';
        justifyY = 'auto';
        break;
    case 'bottom-right':
        justifyX = 'right';
        justifyY = 'bottom';
        break;
    case 'bottom':
        justifyX = 'auto';
        justifyY = 'bottom';
        break;
    case 'bottom-left':
        justifyY = 'bottom';
        break;
    case 'left':
        justifyY = 'auto';
        break;
    case 'top-left':
        break;
    default:
        justifyX = 'auto';
        justifyY = 'auto';        
    } 
    
    var client = new vte.clientInfo();
    
    
    
    if (justifyX == 'auto') {
        var hasMovedNewLeft = false;
        // calculate newLeft
        newLeft = Math.round(newLeft - ((newWidth - exp.thumb.width) / 2)); // as in center
        if (newLeft < client.scrollLeft + vte.marginLeft) {
            newLeft = client.scrollLeft + vte.marginLeft;
            hasMovedNewLeft = true;
        }
        // calculate right/newWidth
        if (newLeft + newWidth > client.scrollLeft + client.width - vte.marginLeft) {
            if (hasMovedNewLeft) newWidth = client.width - vte.marginLeft - vte.marginRight; // can't expand more
            else if (newWidth < client.width - vte.marginLeft - vte.marginRight) { // move newTop up
                newLeft = client.scrollLeft + client.width - newWidth - vte.marginLeft - vte.marginRight;
            } else { // image larger than client
                newLeft = client.scrollLeft + vte.marginLeft;
                newWidth = client.width - vte.marginLeft - vte.marginRight;
            }
        }
    } else if (justifyX == 'right') {
        newLeft = Math.floor(newLeft - newWidth + exp.thumb.width);
    }
    
    if (justifyY == 'auto') {
        var hasMovedNewTop = false;
        // calculate newTop
        newTop = Math.round(newTop - ((newHeight - exp.thumb.height) / 2)); // as in center
        if (newTop < client.scrollTop + vte.marginTop) {
            newTop = client.scrollTop + vte.marginTop;
            hasMovedNewTop = true;
        }
        // calculate bottom/newHeight
        if (newTop + newHeight > client.scrollTop + client.height - vte.marginTop) {
            if (hasMovedNewTop) newHeight = client.height - vte.marginTop - marginBottomInclCaption; // can't expand more
            else if (newHeight < client.height - vte.marginTop - marginBottomInclCaption) { // move newTop up
                newTop = client.scrollTop + client.height - newHeight - vte.marginTop - marginBottomInclCaption;
            } else { // image larger than client
                newTop = client.scrollTop + vte.marginTop;
                newHeight = client.height - vte.marginTop - marginBottomInclCaption;
            }
        }
    } else if (justifyY == 'bottom') {
        newTop = Math.floor(newTop - newHeight + exp.thumb.height);
    }
    
    // don't leave the page; better to expand right bottom
    if (newLeft < vte.marginLeft) {
        tmpLeft = newLeft;
        newLeft = vte.marginLeft; 
        newWidth = newWidth - (newLeft - tmpLeft);
    }
    if (newTop < vte.marginTop) {
        tmpTop = newTop;
        newTop = vte.marginTop;
        newHeight = newHeight - (newTop - tmpTop);
    }

    // Correct ratio
    if (newWidth / newHeight > ratio) { // width greater
        var tmpWidth = newWidth;
        newWidth = newHeight * ratio;
        if (justifyX == 'center' || justifyX == 'auto') {
            // recalculate newLeft
            newLeft = Math.round(parseInt(exp.thumbLeft) 
                - ((newWidth - exp.thumb.width) / 2));
            if (newLeft < client.scrollLeft + vte.marginLeft) { // to the left
                newLeft = client.scrollLeft + vte.marginLeft;
            } else if (newLeft + newWidth > client.scrollLeft + client.width - vte.marginRight) { // to the right
                newLeft = client.scrollLeft + client.width - newWidth - vte.marginRight;
            }
        }
        if (justifyX == 'right') newLeft = newLeft + (tmpWidth - newWidth);
    
    } else if (newWidth / newHeight < ratio) { // height greater
        var tmpHeight = newHeight;
        newHeight = newWidth / ratio;
        if (justifyY == 'center' || justifyY == 'auto') {
            // recalculate newTop
            newTop = Math.round(parseInt(exp.thumbTop) 
                - ((newHeight - exp.thumb.height) / 2));
            if (newTop < client.scrollTop + vte.marginTop) { // above
                newTop = client.scrollTop + vte.marginTop;
            } else if (newTop + newHeight > client.scrollTop + client.height - marginBottomInclCaption) { // below
                newTop = client.scrollTop + client.height - newHeight - marginBottomInclCaption;
            }
        }
        if (justifyY == 'bottom') newTop = newTop + (tmpHeight - newHeight);
    }
    
        
    
    // Apply size change    
    var width = exp.thumb.width;
    var height = exp.thumb.height;
    var left = exp.thumbLeft;
    var top = exp.thumbTop;
	intervalWidth = (newWidth - width) / vte.expandSteps;
	intervalHeight = (newHeight - height) / vte.expandSteps;
    intervalLeft = (newLeft - left) / vte.expandSteps;
    intervalTop = (newTop - top) / vte.expandSteps;
    
    for (i = 1; i < vte.expandSteps; i++) {
		width += intervalWidth;
		height += intervalHeight;
        left += intervalLeft;
        top += intervalTop;
        if (justifyX == 'right') { // follow the edge nicely
            width = Math.round(width);
            left = oldRight - width;
        }
        if (justifyY == 'bottom') { 
            heigt = Math.round(height);
            top = oldBottom - height;
        }
        
		setTimeout("vte.changeSize("+ key +", "+ width +", "+ height +", "+ left +", "+ top +")", 
            Math.round(i * (vte.expandDuration / vte.expandSteps)));
	}
    
    setTimeout("vte.changeClassName("+ key +")", vte.expandDuration/2);    
	// Finally land on the right number:
	setTimeout("vte.changeSize("+ key +", "+ newWidth +", "+ newHeight +", "+ newLeft 
        +", "+ newTop +")", vte.expandDuration);
	setTimeout("vte.focus("+ key +")", vte.expandDuration);
    if (exp.caption) {
        setTimeout("vte.writeCaption("+ key +")", vte.expandDuration + 50);
    }	
	if (exp.fullExpandWidth > newWidth) {
        setTimeout("vte.putFullExpand("+ key +")", vte.expandDuration + vte.fullExpandDelay);
    }
   
} catch (e) {
    window.location.href = vte.expanders[key].a.href;
}
}, 

//--- Write caption div
writeCaption : function(key) {
    var exp = vte.expanders[key];
    
    exp.wrapper.style.width = (exp.fullImage.width + vte.captionWidthCorrection) + 'px';
    exp.wrapper.appendChild(exp.caption);
        
    exp.caption.className += ' vte-display-block'; // have to use className due to Opera
    
},

//--- Focus by click
focus : function(key) {
    var img = vte.expanders[key].fullImage;
    // image
    for (var i in vte.expanders) {
        if (vte.expanders[i] && vte.expanders[i].fullImage.className == 'vte-expanded-focus' && i != key) {
            var blurKey = i;
            vte.expanders[i].fullImage.className = 'vte-expanded-blur';
            vte.expanders[i].fullImage.title = vte.focusTitle;
        }
    }
    vte.expanders[key].wrapper.style.zIndex = vte.zIndexCounter++;
    img.className = 'vte-expanded-focus';
    img.title = vte.restoreTitle;
    
    vte.isBusy = false;    
},

//--- Focus the topmost image after restore
focusTopmost : function() {
    var topZ = 0;
    var topmostKey = '';
    for (var i in vte.expanders) {
        if (vte.expanders[i] && vte.expanders[i].fullImage.className == 'vte-expanded-blur') {
            if (vte.expanders[i].wrapper.style.zIndex && vte.expanders[i].wrapper.style.zIndex > topZ) {
                topZ = vte.expanders[i].wrapper.style.zIndex;
                topmostKey = i;
            }
        }
    }
    //alert (topmostKey);
    if (topmostKey != '') vte.focus(topmostKey);
    vte.isBusy = false;
}, 

//--- Interface for text links
closeId : function(elId) {
    for (var i in vte.expanders) {
        if (vte.expanders[i] && vte.expanders[i].thumb.id == elId) {
            vte.restoreThumb(i);
            return;
        }
    }
},

//--- Click on large image to restore thumb size
restoreThumb : function(key) {
    if (vte.isBusy) return;
    vte.isBusy = true;
    try {
        // remove full expand icon
        if (vte.expanders[key].fullExpand) {
            vte.expanders[key].fullExpand.parentNode.removeChild(vte.expanders[key].fullExpand);
            vte.expanders[key].fullExpand = null;
        }
        // remove caption div
        if (vte.expanders[key].caption) {
            vte.expanders[key].wrapper.removeChild(vte.expanders[key].caption);
            vte.expanders[key].caption = null;
        }
        
        vte.expanders[key].wrapper.style.width = null;
        
        var width = vte.expanders[key].fullImage.width;
        var height = vte.expanders[key].fullImage.height;
        var left = parseInt(vte.expanders[key].wrapper.style.left);
        var top = parseInt(vte.expanders[key].wrapper.style.top);
	    intervalWidth = (vte.expanders[key].thumbWidth - width) / vte.restoreSteps;
	    intervalHeight = (vte.expanders[key].thumbHeight - height) / vte.restoreSteps;
        intervalLeft = (vte.expanders[key].thumbLeft - left) / vte.restoreSteps;
        intervalTop = (vte.expanders[key].thumbTop - top) / vte.restoreSteps;
        
        var oldRight = Math.round(left + width);
        var oldBottom = Math.round(top + height);        
	    
        for (i = 1; i < vte.restoreSteps; i++) {
		    width += intervalWidth;
		    height += intervalHeight;
            left += intervalLeft;
            top += intervalTop;
            
		    setTimeout("vte.changeSize("+ key +", "+ width +", "+ height +", "+ left +", "+ top +")", 
                Math.round(i * (vte.restoreDuration / vte.restoreSteps)));
	    }
        setTimeout('vte.endRestore('+ key +')', vte.restoreDuration);
    
    } catch (e) {
        vte.expanders[key].thumb.style.visibility = 'visible';
        vte.expanders[key].wrapper.parentNode.removeChild(vte.expanders[key].wrapper);
    }
},

endRestore : function (key) {
    var exp = vte.expanders[key];
    exp.thumb.style.visibility = 'visible';
    exp.fullImage.style.visibility = 'hidden';
    
    exp.wrapper.parentNode.removeChild(exp.wrapper);
    
    vte.expanders[key] = null;
    
    vte.focusTopmost();
},

//--- Do the stepwise change
changeSize : function (key, newWidth, newHeight, newLeft, newTop) {
    try {
        var exp = vte.expanders[key];
    
        exp.fullImage.width = newWidth;
        exp.fullImage.height = newHeight;
        exp.wrapper.style.left = newLeft +'px';
        exp.wrapper.style.top = newTop +'px';
        exp.fullImage.style.visibility = 'visible';
        exp.thumb.style.visibility = 'hidden';
        
    } catch (e) {
        window.location.href = vte.expanders[key].a.href;
    }
},

//--- Icon for full expand 
putFullExpand : function (key) {
    if (vte.isBusy) return;
    
    if (!vte.expanders[key]) {
        return;
    }
    
    var href = vte.expanders[key].fullImage.src;
    var thisKey = key;
    
    // the anchor
    
    var aFullExpand = document.createElement('a');
    aFullExpand.id = 'fullexpand-'+ vte.expanders[key].fullImage.id;
    aFullExpand.style.position = 'absolute';
    aFullExpand.style.left = (vte.expanders[key].fullImage.width - 55) +'px';
    aFullExpand.style.top = (vte.expanders[key].fullImage.height - 55) +'px';
    aFullExpand.href = 'javascript:vte.fullExpand('+ key +');';
    aFullExpand.title = vte.fullExpandTitle;
    aFullExpand.onmouseover = function () { vte.mouseIsOverFullExpand = true; }
    aFullExpand.onmouseout = function () { vte.mouseIsOverFullExpand = false; }
    
    // the image
    var imgFullExpand = document.createElement('img');
    imgFullExpand.src = vte.vteDir + vte.fullExpandIcon;
    imgFullExpand.style.border = '0';
    imgFullExpand.style.display = 'block';
    aFullExpand.appendChild(imgFullExpand);
    
    vte.expanders[key].wrapper.appendChild(aFullExpand);
    vte.expanders[key].fullExpand = aFullExpand;
},

fullExpand : function (key) {
    try {
        var exp = vte.expanders[key];
        
        var newLeft = parseInt(exp.wrapper.style.left) - (exp.fullExpandWidth - exp.fullImage.width) / 2;
        if (newLeft < vte.marginLeft) newLeft = vte.marginLeft;
        exp.wrapper.style.left = newLeft +'px';
        
        exp.fullImage.width = exp.fullExpandWidth;
        exp.fullImage.height = exp.fullExpandHeight;
        vte.focus(key);
        
        exp.fullExpand.className = 'vte-display-none'; // send back
        
        vte.mouseIsOverFullExpand = false;
        
        exp.wrapper.style.width = (exp.fullImage.width + vte.captionWidthCorrection) + 'px';
    
    } catch (e) {
        window.location.href = vte.expanders[key].fullImage.src;
    }
},

showFullExpand : function (key) {
    if (vte.expanders[key] && vte.expanders[key].fullExpand) {
        vte.expanders[key].fullExpand.style.visibility = 'visible';
    }
},

hideFullExpand : function(key) {
    if (vte.expanders[key] && vte.expanders[key].fullExpand && !vte.mouseIsOverFullExpand) {
        vte.expanders[key].fullExpand.style.visibility = 'hidden';
    }
},
        
//--- Change classname midway in the expansion
changeClassName : function (key) {
    vte.expanders[key].fullImage.className = 'vte-expanded-focus';
},


//--- Preload a number of images recursively
preloadFullImage : function (i) {
    if (vte.preloadTheseImages[i]) {
        var img = new Image;
        img.onload = function() { vte.preloadFullImage(i + 1); }
        img.src = vte.preloadTheseImages[i];
    }
},

//-----------------------------------------------------------------------------


mouseMoveHandler : function(e)
{
  if (vte.isDrag)
  {
    var key = vte.dragObj.getAttribute('key');
    var wrapper = vte.expanders[key].wrapper;
    
    var left = vte.nn6 ? tx + e.clientX - vte.dragX : tx + event.clientX - vte.dragX;
    wrapper.style.left = left +'px';
    var top = vte.nn6 ? ty + e.clientY - vte.dragY : ty + event.clientY - vte.dragY;
    wrapper.style.top  = top +'px';
    
    return false;
  }
}, 

mouseDownHandler : function(e) 
{

  var fobj       = vte.nn6 ? e.target : event.srcElement;
  var topelement = vte.nn6 ? "HTML" : "BODY";
  
  while (fobj.tagName != topelement && fobj.tagName != 'HTML' && !fobj.className.match('vte-expanded-'))
  {
    fobj = vte.nn6 ? fobj.parentNode : fobj.parentElement;
  }

  if (fobj.className.match('vte-expanded-'))
  {
    vte.isDrag = true;
    vte.dragObj = fobj;
    var tmpCursor = vte.dragObj.style.cursor;
    vte.defaultRestoreCursor = tmpCursor;
    vte.dragObj.style.cursor = 'move';
    tx = parseInt(vte.dragObj.parentNode.style.left);
    ty = parseInt(vte.dragObj.parentNode.style.top);
    
    vte.leftBeforeDrag = tx;
    vte.topBeforeDrag = ty;
    
    vte.dragX = vte.nn6 ? e.clientX : event.clientX;
    vte.dragY = vte.nn6 ? e.clientY : event.clientY;
    document.onmousemove = vte.mouseMoveHandler;
    
    if (fobj.className.match('vte-expanded-blur')) {
        vte.focus(fobj.getAttribute('key'));
        vte.hasFocused = true;
    }
    return false;
  }
},
mouseUpHandler : function(e) {
    vte.isDrag = false;
    var fobj       = vte.nn6 ? e.target : event.srcElement;
    var topelement = vte.nn6 ? "HTML" : "BODY";

    while (fobj.tagName != topelement && fobj.tagName != 'HTML' && !fobj.className.match('vte-expanded-'))
    {
        fobj = vte.nn6 ? fobj.parentNode : fobj.parentElement;
    }
    if (fobj.className.match('vte-expanded-focus')) {
        fobj.style.cursor = vte.defaultRestoreCursor;
        //if (hasDragged) hasDragged = false;
        var left = parseInt(fobj.parentNode.style.left);
        var top = parseInt(fobj.parentNode.style.top);
        if (left == vte.leftBeforeDrag && top == vte.topBeforeDrag && !vte.hasFocused) {
            vte.restoreThumb(fobj.getAttribute('key'));
        }
        vte.hasFocused = false;
    
    } else if (fobj.className.match('vte-expanded-blur')) {
        fobj.style.cursor = vte.defaultRestoreCursor;
        
    }
},

//--- Preload full-size images etc.
init : function () {
    
    var j = 0;
    
    for (var i in document.images) {
        img = document.images[i];
        if (img.className && img.className.match("vte-")) {
            // hide dotted border on anchors
            a = img.parentNode;
            a.onfocus = function() { this.blur(); }
            
            if (j < this.numberOfImagesToPreload) {
                vte.preloadTheseImages[j] = a.href;
                j++;
            }
        }
    }
    
    vte.preloadFullImage(0); // starts domino-effect
    
    // preload cursor
    var cur = new Image;
    cur.src = vte.vteDir + vte.restoreCursor;
}
} // end vte object

// set handlers
document.onmousedown = vte.mouseDownHandler;
document.onmouseup = vte.mouseUpHandler;


    