// These mouse events implement a unique rollover system. Objects under
// the cursor are scanned (innermost to outermost) to see wether any have a 
// class name ending in '_norm'. If they do they are assumed to be a 'hotbox', 
// meaning they switch class on rollover. This is basically a workaround for 
// IE not supporting :hover on anything but <A>. Note: If the hotbox does not
// have a mousedown event then the event on the first child <A> is used. This
// is basically for convenience and smaller HTML code.

// WARNING: If your hotbox already has mouseover/mouseout then they will override this.

var SCAN_DEPTH = 7;

function docMouseOver (e) {
	var node = (!e) ? window.event.srcElement : e.target;
	for (var i=0; i<SCAN_DEPTH; i++) {
		if (node) {
			if (node.className && node.className.indexOf(' norm') != -1) { // Aha! a hotbox!
				node.className = node.className.replace(/ norm/,' over');
				node.style.cursor = (ie) ? 'hand' : 'pointer';
				return;
			}
			node = node.parentNode;
		}
	}
}

function docMouseOut (e) {
	var node = (!e) ? window.event.srcElement : e.target;
	for (var i=0; i<SCAN_DEPTH; i++) {
		if (node) {
			if (node.className && node.className.indexOf(' over') != -1) {
				node.className = node.className.replace(/ over/,' norm');
				node.style.cursor = 'auto';
				return;
			}
			node = node.parentNode;
		}
	}
}
function docMouseDown (e) {
	var node = (!e) ? window.event.srcElement : e.target;
	// skip if user clicked a link
	if (node.tagName != 'A') {
		for (var i=0; i<SCAN_DEPTH; i++) {
			if (node) {
				if (node.className && node.className.indexOf(' over') != -1) {
					if (typeof node.onMouseDown != 'undefined') {
						node.onmousedown();
					} else if (node.getElementsByTagName) {
						// Use link on first A tag
						var links = node.getElementsByTagName('A');
						if (links.length) {
							window.location = links[0].href;
						}
					}
					return;
				}
				node = node.parentNode;
			}
		}
	}
}

//function docOnLoad () {
	// Not using anymore. For reference only
	//window.setTimeout("drawAds()", 100);
//}

document.onmousedown = docMouseDown;
document.onmouseover = docMouseOver;
document.onmouseout = docMouseOut;
//window.onload = docOnLoad;
