fm.Package("com.newReader");
fm.Import("com.newReader.source.Sources");
fm.Import("com.newReader.article.Articles");
fm.Class("Reader");
com.newReader.Reader = function(me, Sources, Articles){	this.setMe=function(_me){me=_me};
	Static.main = function  () {
		var source = new Sources();
		var articles;
		source.onChange(function(url){
			com.newReader.Reader.parseRSS(url, function(data){
				articles = new Articles(data.responseData.feed);
			});
		}); 
		
	};

	Static.parseRSS = function(url, callback) {
		
		url =  document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&callback=?&q=' + encodeURIComponent(url)
				;
		$.ajax({
			url : url,
			dataType : 'json',
			success : callback
		});
	};
}