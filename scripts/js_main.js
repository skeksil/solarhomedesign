window.onload = function() {
    PutSlideshowBanner();
    PutByline();
}

function ecoAjaxGet(uri,a) {
    try {
    var ndHeading = document.getElementById("catheading");
    //var ndAwards = document.getElementById("rightnav");
    //ndAwards.style.display = "none";
    var ndContent = document.getElementById("content");
    ndContent.style.marginright= "15px";
    if(ndHeading) ndHeading.innerHTML = a.nextSibling.innerHTML;
    var ndContent = document.getElementById("content");
    ndContent.innerHTML = "<h2>Loading... " + a.innerHTML + "</h2>";
    var xmlHttpReq = false;
    var self = this;
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    self.xmlHttpReq.open('GET', uri, true);
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4) {
            ndContent.innerHTML = self.xmlHttpReq.responseText;
        }
    }
    self.xmlHttpReq.send(null);
    }
    catch(e) {
	alert("AJAX exception: " + e);
	alert("happened while fetching " + uri);
    }
}

function PutSlideshowBanner() {
    var so = new SWFObject("http://theecovillage.com.au/images//monoslideshow.swf", "mss", "100%", "200", "7", "#CCCC66");
    so.addVariable("dataFile", "http://theecovillage.com.au/site/slides.php");
    so.addVariable("showLogo", "false");
    so.write("mssHolder");
}

function PutByline() {
    var so = new SWFObject("http://theecovillage.com.au//byline_home.1.swf", "byline", "90%", "30", "7", "#AFAF3C");
    so.write("mssHolderUnderbar");
}