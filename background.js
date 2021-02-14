chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'mycourses2.mcgill.ca'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

var endTime = 0;
chrome.webRequest.onSendHeaders.addListener(
    function(details) {
        console.log(details)
        var urlKeyword = 'https://lrscdn.mcgill.ca/api/tsmedia';
        if(details.method === 'GET' && details.url.indexOf(urlKeyword) >= 0){
            console.log(details.requestHeaders);
            curEndTime = details.requestHeaders.filter(e => e.name === 'Range'|| e.name === 'range')[0]['value'].match(/\d+/g)[1];
            endTime = Math.max(endTime, curEndTime);
            chrome.storage.local.set({requestHeaders: details.requestHeaders}, function(){});
            chrome.storage.local.set({url: details.url},function(){});
            chrome.storage.local.set({endTime : endTime}, function(){});
        }
    },
    {
        urls: ["<all_urls>"],
        types: ['xmlhttprequest']
    },
    ['requestHeaders']
);

