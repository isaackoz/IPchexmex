var $ = window.jQuery;
var invalid_country_codes = ["US","CU","IR","KP","SD"]; //list of all countries that bitmex blocks
var iccLength = Object.keys(invalid_country_codes).length; // 5
var bitmexTabsOpen = [];

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){ //gives us tabid, changeinfo, and tab info each time the tab is updated (url change, title change, etc.)

	if(changeInfo.url && changeInfo.url.toString().indexOf("https://www.bitmex.com/") !== -1){ //checks to see if the changeinfo contains a url change with it and if it does, see if the url matches bitmex's web address	
		alarmCount(function(count){
			var alarmVal = count;	
			if(alarmVal == 0){		//checks to see if we already have an alarm on bitmex (in case of opening another tab or whatever)
				chrome.alarms.create("IPCMalarm", {periodInMinutes: 1}); //create an alarm to check if we are secured that will go off every minute
			};
		});
		secured(); //run that function down there
		bitmexTabsOpen.push(tabId); //add the tabID to an array so we can use it later to determine if we should create/delete an alarm when tab closed
	};
});


chrome.tabs.onRemoved.addListener(function(tabId,removeInfo){
	if(bitmexTabsOpen.length <= 1){				// if we have more than 1 bitmex tab open, dont delete our alarm
			chrome.alarms.clear("IPCMalarm"); //once all bitmex tabs are closed, we delete the alarmm
		}
	if(bitmexTabsOpen.includes(tabId)){
		bitmexTabsOpen = jQuery.grep(bitmexTabsOpen, function(value){return value != tabId});
	}
});

chrome.alarms.onAlarm.addListener(function(alarm){
	secured()
});

function alarmCount(callback){
	var count;
	chrome.alarms.getAll(function(alarms){callback(alarms.length)});
};

function secured() {
	$.getJSON('https://json.geoiplookup.io/', {"_": new Date().getTime()}, function(data) { //gets our ip address in json format
		console.log('IPchexmex: checking if secured'); //logging
		for(var i = 0; i < iccLength; i++) { 
			if(data.country_code == invalid_country_codes[i] || data.region == "Quebec") { //if the country code from the invalid_country_codes array matches, or from quebec, then continue into function
				alert('WARNING! Your IP is in a country prohibited from holding positions or entering into contracts at BitMEX! Use a VPN before continuing. Current location: ' + data.country_name); //alerts us that we are in a blocked country
				console.log('IPchexmex: not secured'); //logging
				return false
			}	
			else {
				console.log('IPchexmex: secured');
				return true
			}
		}
	});
};

