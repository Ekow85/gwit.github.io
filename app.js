var weatherloaded = false;
var weathericonurl = "http://openweathermap.org/img/w/";

$(document).on("panelbeforeopen", "#weatherpanel", function(e, ui) {

	var panel = this;
	
	//Do we have our weather data?
	if(!weatherloaded) {
	
		$("p.weather", panel).html("<i>Fetching weather - please stand by!</i>");

		$.get("http://api.openweathermap.org/data/2.5/weather?q=lafayette,la&units=imperial", function(res,code) {
			/*
			Generate a weather string. This could be nicer if it used something like Handlebars
			*/
			var s = "";
			s += "<p>The current temperature is "+ Math.round(res.main.temp) + " degrees. Today's low will " + 
				 "be " + Math.round(res.main.temp_min) + " degrees with a high of " + 
				 Math.round(res.main.temp_max) + " degrees.</p>";
			
			//weather is optional
			if(res.weather && res.weather.length >= 1) {
				s += "<p><img style='width:100px' src='" + weathericonurl + res.weather[0].icon + ".png'></p>";
			}
			
			$("p.weather", panel).html(s);
			$(panel).trigger( "updatelayout" );
			weatherloaded = true;
			
		}, "JSONP");
		
	}

});
