# IPchexmex
Checks to see if you are in a country that allows Bitmex trading

#TODO
-Make it so no permissions are required (get rid of the content_scripts > matches)
-Add indicator that you are secure (change icon somwhow. good luck)

background script with listener for new tab
check if tab is bitmex with
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
});

if its bitmex, chrome.alarms.create({delayInMinutes: 3.0}) create an alarm  for every 5 seconds? maybe user interface in popup ;s


if new tab, store tabid in array
on tab update loop array to see if url matches bitmex