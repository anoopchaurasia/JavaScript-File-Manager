fm.Package("com.reader.filler");
fm.Class("FillContent");
com.reader.filler.FillContent = function (me){this.setMe=function(_me){me=_me;};
    $.fn.SkipRoot = function () {
    	this.find("*").filter(function(){
    		return this.tagName.toLowerCase() != 'br' && $.trim($(this).text()) == '';
    	}).remove();
    };
    $.fn.htmlTruncate = function (strt, max, settings) {
        settings = jQuery.extend({
            chars: /\s/
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
            myStr = myStr.substring(strt, myStr.length);//strt is removing text only thats why we need tags
        }
        
        if (myStr.length > max) {
            var c;
            while (max > 0) {
                c = myStr.charAt(max);
                if (c.match(settings.chars)) {
                    myStr = myStr.substring(0, max);
                    break;
                }
                max--;
            }
        }else{
        	max = totalLen;
        }
        var start = 0;
        if(strt != 0  && myRegExHash[0]){
        	start = myRegExHash[0].length;
        }
        var end = 0;
        if ( myStrOrig.search(myRegEx) != -1 ) {
            for ( var eachEl in myRegExHash ) {
            	if(end == 0 && eachEl >= myStr.length){
            		end = myStr.length;
            	}
            	myStr = [myStr.substring(0, eachEl ), myRegExHash[eachEl], myStr.substring(eachEl , myStr.length)].join("");
            }
        }
        if(end == 0 ){
        	end = myStr.length;
        }
        myStr = myStr.substring(0, start).replace(/<br\s*\/?>/mgi,"")+
        			myStr.substring( start, end)+
        		myStr.substring(end, myStr.length).replace(/<br\s*\/?>/mgi,"");
        $(this).html(myStr);
        $(this).SkipRoot();
        return [ max + 1, totalLen];
    };
    function charsPerLine(dom){
    	
    	var target_width = dom.width(); // line width
    	var text = 'I want to know how many chars of this text fit.';
    	var span = document.createElement('span');
    	dom.html(span);
    	span.style.whiteSpace = 'nowrap';
    	var fit = text.length;
    	span.innerHTML = text;
    	var chars = Math.floor( target_width/span.offsetWidth * fit );
    	return chars - 3;
    }
    this.truncateWithHeight = function (dom, from, origHtml) {
    	var cpl = charsPerLine( dom );
    	var lineHeight = parseInt(dom.css("line-height"));
    	 var ownHeight = dom.height();
    	var nols = Math.floor( ownHeight / lineHeight);
    	var totalChars = cpl*nols;
    	dom.html(origHtml);
        var lastCharOffset = dom.htmlTruncate(from, totalChars);
        var step = 3;
        var brs = dom.find("br");
        var ps = dom.find("p");
        $(ps[0]).css("margin-top","0px");
        var decrease = 0;
        
        var relativeHeight = dom.get(0).offsetTop +  ownHeight;
        for(var i = 0; i < brs.length; i++){
            if (relativeHeight > brs[i].offsetTop ) {
                decrease++;
            }
        }
        for(var i = 0; i < ps.length - 1; i++){
            if (relativeHeight > ps[i].offsetTop ) {
                decrease++;
            }
        }
        var totalLen = lastCharOffset[1];
        console.log(decrease);
       decrease = Math.floor( decrease * cpl / 1.7 );
       var count = 0;
        while (ownHeight < dom.get(0).scrollHeight) {
            lastCharOffset = dom.htmlTruncate(0, lastCharOffset[0]- step - decrease );
            count++;
            decrease = 0;
            if(lastCharOffset[0] <=0){
            	lastCharOffset[0] = 0;
            	break;
            }
        }
        dom.html(dom.html().replace(/<\/a>/mgi, "</a> "));
        return [from + lastCharOffset[0], totalLen - from - lastCharOffset[0] ];
    };
	this.FillContent = function() {
		
	};
};