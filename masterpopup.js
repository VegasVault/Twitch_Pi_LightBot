	var baseUrl = "https://www.amazon.com/s?url=search-alias%3Daps&field-keywords=";
	var affilaiteLink = "&tag=vegasvault-20";

	$(function() {
	    $('#searchBtn').click(function() {
	        var term = $('#searchTxt').val();
	        window.open(baseUrl + term + affilaiteLink);
	    });
	});


	$(function() {
	    $('#searchTxt').keypress(function(e) {
	        var key = e.which;
	        if (key == 13) // the enter key code
	        {
	            var term = $('#searchTxt').val();
	            window.open(baseUrl + term + affilaiteLink);
	        }
	    });
	});