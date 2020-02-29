const BASELINK_ORDER_URL_REGEX = 'https:\/\/panel-b\.baselinker\.com\/orders\.php';

// CSS was added due to fragment identifier (we want to explore order details,
// but after '#' there is also status:all which can't be excluded with following code)
// panel2 is display: none on non-order screens, that's why it's ignored by stateMatcher
chrome.runtime.onInstalled.addListener(installedCallback);

function installedCallback() {
    refreshRules();
    registerOnClickEvent();
}

function refreshRules() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, addRules);
}

function registerOnClickEvent() {
  chrome.pageAction.onClicked.addListener(performGet);
}

function addRules() {
  chrome.declarativeContent.onPageChanged.addRules([
    {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlMatches: BASELINK_ORDER_URL_REGEX },
          css: ['#panel2']
        })],
      actions: [
         new chrome.declarativeContent.ShowPageAction()
       ]
    }
  ]);
}

function performGet() {
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    const url = tabs[0].url.toString();
    const segments = url.split(':');
    if(segments.length != 0) {
      const orderId = segments[segments.length - 1];
      fetch("http://localhost:8088/orders/" + orderId);
    }
  });
}
