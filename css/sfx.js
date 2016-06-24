// Cross-browser CSS Opacity won't validate so use this instead. Keep alpha between 0 and 1.
function setOpacity(objName,alpha)
{
	var myObj = obj(objName);
	if (myObj && typeof myObj.style != "undefined") {
		if (ie) {
			myObj.style.filter = 'alpha(opacity=' + alpha + ')';
		} else if (typeof myObj.style.opacity != "undefined") {
			myObj.style.opacity = alpha/100;
		} else if (typeof myObj.style.MozOpacity != "undefined") {
			myObj.style.MozOpacity = alpha/100;
		} else if (typeof myObj.style.KhtmlOpacity != "undefined") {
			myObj.style.KhtmlOpacity = alpha/100;
		}
	}
}

// SIDE ADS FADE-IN
function drawAds()
{
	var ads = new Array();
	for (var i=1; i<10; i++) {
		var ad = document.getElementById('ad' + i);
		if (ad) {
			ads[i] = new Fadomatic(ad,5,0); 
			ads[i].fadeIn();
		}
	}
}
	
// SIMPLE FADE:
nereidFadeObjects = new Object();
nereidFadeTimers = new Object();

function nereidFade(object, destOp, rate, delta){
if (!document.all)
return
    if (object != "[object]"){  //do this so I can take a string too
        setTimeout("nereidFade("+object+","+destOp+","+rate+","+delta+")",0);
        return;
    }
        
    clearTimeout(nereidFadeTimers[object.sourceIndex]);
    
    diff = destOp-object.filters.alpha.opacity;
    direction = 1;
    if (object.filters.alpha.opacity > destOp){
        direction = -1;
    }
    delta=Math.min(direction*diff,delta);
    object.filters.alpha.opacity+=direction*delta;

    if (object.filters.alpha.opacity != destOp){
        nereidFadeObjects[object.sourceIndex]=object;
        nereidFadeTimers[object.sourceIndex]=setTimeout("nereidFade(nereidFadeObjects["+object.sourceIndex+"],"+destOp+","+rate+","+delta+")",rate);
    }
}


// FADE-O-MATIC: DHTML fade effects. Thanks to Phil (www.chimpen.com/fadeomatic)

// Fade interval in milliseconds
// Make this larger if you experience performance issues
Fadomatic.INTERVAL_MILLIS = 15;

// Creates a fader
// element - The element to fade
// speed - The speed to fade at, from 0.0 to 100.0
// initialOpacity (optional, default 100) - element's starting opacity, 0 to 100
// minOpacity (optional, default 0) - element's minimum opacity, 0 to 100
// maxOpacity (optional, default 0) - element's minimum opacity, 0 to 100

function Fadomatic (element, rate, initialOpacity, minOpacity, maxOpacity) {
  this._element = element;
  this._intervalId = null;
  this._rate = rate;
  this._isFadeOut = true;

  // Set initial opacity and bounds
  // NB use 99 instead of 100 to avoid flicker at start of fade
  this._minOpacity = 0;
  this._maxOpacity = 99;
  this._opacity = 99;

  if (typeof minOpacity != 'undefined') {
    if (minOpacity < 0) {
      this._minOpacity = 0;
    } else if (minOpacity > 99) {
      this._minOpacity = 99;
    } else {
      this._minOpacity = minOpacity;
    }
  }

  if (typeof maxOpacity != 'undefined') {
    if (maxOpacity < 0) {
      this._maxOpacity = 0;
    } else if (maxOpacity > 99) {
      this._maxOpacity = 99;
    } else {
      this._maxOpacity = maxOpacity;
    }

    if (this._maxOpacity < this._minOpacity) {
      this._maxOpacity = this._minOpacity;
    }
  }
  
  if (typeof initialOpacity != 'undefined') {
    if (initialOpacity > this._maxOpacity) {
      this._opacity = this._maxOpacity;
    } else if (initialOpacity < this._minOpacity) {
      this._opacity = this._minOpacity;
    } else {
      this._opacity = initialOpacity;
    }
  }

	// Select opacity model (W3C,MSIE,Mozilla<1.7,Safari)
  if(	typeof element.style.opacity != 'undefined' ) {	// W3C/CSS3
  	this._updateOpacity = this._updateOpacityW3c;

  } else if(typeof element.style.filter != 'undefined') { // MSIE (DX filter)
    // If there's not an alpha filter on the element already, add one
    if (element.style.filter.indexOf("alpha") == -1) {

      // Attempt to preserve existing filters
      var existingFilters="";
      if (element.style.filter) {
        existingFilters = element.style.filter+" ";
      }
      element.style.filter = existingFilters+"alpha(opacity="+this._opacity+")";
    }
    this._updateOpacity = this._updateOpacityMSIE;
    
  } else if( typeof element.style.MozOpacity != 'undefined' ) { // Mozilla<1.7
   	this._updateOpacity = this._updateOpacityMoz; 
   	
  } else if( typeof element.style.KhtmlOpacity != 'undefined' ) { // Safari or Konqueror
  	this._updateOpacity = this._updateOpacityKhtml;
    
  } else {

    this._updateOpacity = this._updateVisibility;
  }

  this._updateOpacity();
}

// Initiates a fade out
Fadomatic.prototype.fadeOut = function () {
  this._isFadeOut = true;
  this._beginFade();
}

// Initiates a fade in
Fadomatic.prototype.fadeIn = function () {
	this._element.style.visibility = 'visible';
  this._isFadeOut = false;
  this._beginFade();
}

// Makes the element completely opaque, stops any fade in progress
Fadomatic.prototype.show = function () {
  this.haltFade();
  this._opacity = this._maxOpacity;
  this._updateOpacity();
}

// Makes the element completely transparent, stops any fade in progress
Fadomatic.prototype.hide = function () {
  this.haltFade();
  this._opacity = 0;
  this._updateOpacity();
}

// Halts any fade in progress
Fadomatic.prototype.haltFade = function () {

  clearInterval(this._intervalId);
}

// Resumes a fade where it was halted
Fadomatic.prototype.resumeFade = function () {

  this._beginFade();
}

// Pseudo-private members

Fadomatic.prototype._beginFade = function () {

  this.haltFade();
  var objref = this;
  this._intervalId = setInterval(function() { objref._tickFade(); },Fadomatic.INTERVAL_MILLIS);
}

Fadomatic.prototype._tickFade = function () {

  if (this._isFadeOut) {
    this._opacity -= this._rate;
    if (this._opacity < this._minOpacity) {
      this._opacity = this._minOpacity;
      this.haltFade();
    }
  } else {
    this._opacity += this._rate;
    if (this._opacity > this._maxOpacity ) {
      this._opacity = this._maxOpacity;
      this.haltFade();
    }
  }

  this._updateOpacity();
}

Fadomatic.prototype._updateVisibility = function () {
  
  if (this._opacity > 0) {
    this._element.style.visibility = 'visible';
  } else {
    this._element.style.visibility = 'hidden';
  }
}

Fadomatic.prototype._updateOpacityW3c = function () {
  
  this._element.style.opacity = this._opacity/100;
  this._updateVisibility();
}

Fadomatic.prototype._updateOpacityMSIE = function () {
  
  this._element.filters.alpha.opacity = this._opacity;
  this._updateVisibility();
}

Fadomatic.prototype._updateOpacityMoz = function () {
  
	this._element.style.MozOpacity = this._opacity/100;
  this._updateVisibility();
}

Fadomatic.prototype._updateOpacityKhtml = function () {
  
  this._element.style.KhtmlOpacity = this._opacity/100;
  this._updateVisibility();
}

Fadomatic.prototype._updateOpacity = null;
