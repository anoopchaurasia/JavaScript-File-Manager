var t = 0;
fm.Package("com.reader.filler");
fm.Class("FillContent");

com.reader.filler.FillContent = function (me) {
	this.setMe = function( _me ) {
		me = _me;
	};
	$.fn.SkipRoot = function( ) {
		this.find("*").filter(function( ) {
			return this.tagName.toLowerCase() != 'br' && $.trim($(this).text()) == '';
		}).remove();
	};
	$.fn.htmlTruncate = function( strt, max, settings ) {
		settings = jQuery.extend({
			chars : /\s|\."|\./
		}, settings);
		var myRegEx = /<\/?[^<>]*\/?>/gim;
		var $this = this;
		var myStrOrig = $this.html();
		var myStr = myStrOrig;
		var myRegExArray;
		var myRegExHash = {};
		while ((myRegExArray = myRegEx.exec(myStr)) != null) {
			if (myRegExHash[(myRegExArray.index - strt) < (myRegExHash[0] == undefined ? 0 : (myRegExHash[0].length)) ? 0 : (myRegExArray.index - strt)] != undefined)
				myRegExHash[0] += myRegExArray[0];
			else
				myRegExHash[(myRegExArray.index - strt) < 0 ? 0 : (myRegExArray.index - strt)] = myRegExArray[0];
		}
		myStr = jQuery.trim(myStr.split(myRegEx).join(""));
		var totalLen = myStr.length;
		if (strt != 0) {
			myStr = myStr.substring(strt, myStr.length);// strt is removing text
														// only thats why we
														// need tags
		}
		
		if (myStr.length > max) {
			var c;
			while (max > 0) {
				c = myStr.charAt(max);
				if (c.match(settings.chars)) {
					myStr = myStr.substring(0, max + 1);
					break;
				}
				max--;
			}
		}
		else {
			max = totalLen;
		}
		var start = 0;
		if (strt != 0 && myRegExHash[0]) {
			start = myRegExHash[0].length;
		}
		var end = 0;
		if (myStrOrig.search(myRegEx) != -1) {
			for ( var eachEl in myRegExHash) {
				if (end == 0 && eachEl >= myStr.length) {
					end = myStr.length;
				}
				myStr = [ myStr.substring(0, eachEl), myRegExHash[eachEl], myStr.substring(eachEl, myStr.length) ].join("");
			}
		}
		if (end == 0) {
			end = myStr.length;
		}
		myStr = myStr.substring(0, start).replace(/<br\s*\/?>/mgi, "") + myStr.substring(start, end) + myStr.substring(end, myStr.length).replace(/<br\s*\/?>/mgi, "");
		$(this).html(myStr);
		return [ max + 1, totalLen ];
	};
	function charsPerLine( dom ) {
		
		var target_width = dom.width(); // line width
		var text = 'I want to know how many chars of this text fit.';
		var span = document.createElement('span');
		dom.html(span);
		span.style.whiteSpace = 'nowrap';
		var fit = text.length;
		span.innerHTML = text;
		var chars = Math.floor(target_width / span.offsetWidth * fit);
		return chars - 3;
	}
	this.truncateWithHeight = function( dom, from, origHtml ) {
		var t2 = Date.now();
		var cpl = charsPerLine(dom);
		var lineHeight = parseInt(dom.css("line-height"));
		var ownHeight = dom.height();
		var nols = Math.floor(ownHeight / lineHeight);
		var totalChars = cpl * nols;
		dom.html(origHtml);
		var step = 3;
		var lastCharOffset = dom.htmlTruncate(from, totalChars);
		var all = dom.find("*");
		var decrease = 0, firstP = true;
		var relativeHeight = dom.get(0).offsetTop + ownHeight;
		for ( var i = 0; i < all.length; i++) {
			if (relativeHeight < all[i].offsetTop) {
				jQuery(all[i]).remove();
			}
			else if(all[i].nodeName != 'BR' && jQuery(all[i]).text() == ""){
				 jQuery(all[i]).remove();
			}
			else if(firstP && all[i].nodeName == "P" ){
				$(all[i]).css("margin-top","0px");
				firstP = false;
			}
		}
		var totalLen = lastCharOffset[1];
		var count = 0;
		var diff = dom.get(0).scrollHeight - ownHeight;
		decrease = Math.floor((diff / lineHeight) * cpl / 1.7);
		if (decrease <= 0) {
			decrease = 0;
		}
		while (diff >= lineHeight / 5 || count == 0) {
			lastCharOffset = dom.htmlTruncate(0, lastCharOffset[0] - decrease);
			if (lastCharOffset[0] <= 0) {
				lastCharOffset[0] = 0;
				break;
			}
			if (count > 20) {
				break;
			}
			count++;
			diff = dom.get(0).scrollHeight - ownHeight;
			decrease = Math.floor((diff / lineHeight -1 ) * cpl / 1.7);
			if (decrease <= 0) {
				decrease = step;
			}
		}
		dom.html(dom.html().replace(/<\/a>/mgi, "</a> "));
		t += Date.now() - t2;
 	//	console.log(count);
		return [ from + lastCharOffset[0], totalLen - from - lastCharOffset[0] ];
	};
	this.FillContent = function( ) {

	};
};
