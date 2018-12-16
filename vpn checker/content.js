var $ = window.jQuery;
var invalid_country_codes = ["US","CU","IR","KP","SD"];
var iccLength = Object.keys(invalid_country_codes).length;

$(document).ready(function($) {	
	secured();
	setInterval(function() {secured()}, 10000);
});

function secured() {
	$.getJSON('https://json.geoiplookup.io/', {"_": new Date().getTime()}, function(data) {
		console.log('IPchexmex: checking if secured');
		for(var i = 0; i < iccLength; i++) {
			if(data.country_code == invalid_country_codes[i] || data.region == "Quebec") {
				alert('WARNING! Your IP is in country prohibited from holding positions or entering into contracts at BitMEX! Use a VPN before continuing. Current location: ' + data.country_name);
				console.log('IPchexmex: not secured');
				return false
			}	
			else {
				console.log('IPchexmex: secured');
				return true
			}
		}
	});
}


