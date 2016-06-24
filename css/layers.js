
// Code to handle popup messages and floating graphics

function showImage(ref) 
{
	var img = obj(ref);
	img.style.display = 'inline';
	img.src = img.src;						// reload
}

function hideImage(ref) 
{
	obj(ref).style.display = 'none';
}

function showLayer(ref) 
{
	obj(ref).style.display = 'block';
}

function hideLayer(ref) 
{
	obj(ref).style.display = 'none';
}

function showPopup(ref,alertFrame) 
{
	window.scroll(0,0);
	showLayer(ref + '_popup');
	showLayer('overlay');
	showLayer('overlay_dark');
	if(typeof(alertFrame) != 'undefined') {
		showLayer('jsAlertFrame');
	}
}

function hidePopup(ref) 
{
	hideLayer(ref + '_popup');
	hideLayer('overlay');
	hideLayer('overlay_dark');
}

// a hack for firefox to raise iframe layers above Flash movies
function raiseIFrames() {
	var iframes = document.getElementsByTagName('iframe')
	for (var i=0;i<iframes.length;i=i+1) {iframes[i].style.display="block";}
}

// writes or changes a general message
function msg(text)
{
	setText('jsAlertMessage',text);
	showPopup('alert',1);
	obj('errorTitle').style.display = 'none';
	obj('errorControls').style.display = 'none';
	obj('messageControls').style.display = 'inline';
	window.scroll(0,0);
}

// writes or changes an error message
function err(text)
{
	setText('jsAlertMessage',text);
	showPopup('alert',1);
	// the following turns on alert elements specific to errors and turns off the default (message) controls
	obj('errorTitle').style.display = 'inline';
	obj('errorControls').style.display = 'inline';
	obj('messageControls').style.display = 'none';
	
	window.scroll(0,0);
}

/* Store for testing
	<a href="javascript://" onclick="showLayer('error')">SHOW ERRORS</a>
			<a href="javascript://" onclick="hideLayer('error')">HIDE ERRORS</a>
			<a href="javascript://" onclick="showLayer('msg');">SHOW MSG</a>
			<a href="javascript://" onclick="hideLayer('msg');">HIDE MSG</a>
			<a href="javascript://" onclick="err('Oops, an error!');">SHORT ERROR</a>
			<a href="javascript://" onclick="err('errorjk asdkj dhsakd kjhd kja djksah dkjsa hdj sahkjd hsakjh  djksah dkj sahdkjsah djksah jdh sajkd hsajkd j jksh djksh djksh dkjs hdjksa hdkjash dkjsah jh jdha sjdh ');">LONG ERROR</a>
			<a href="javascript://" onclick="msg('Oops, an error!');">SHORT MSG</a>
			<a href="javascript://" onclick="msg('errorjk asdkj dhsakd kjhd kja djksah dkjsa hdj sahkjd hsakjh  djksah dkj sahdkjsah djksah jdh sajkd hsajkd j jksh djksh djksh dkjs hdjksa hdkjash dkjsah jh jdha sjdh ');">LONG MSG</a>			
*/