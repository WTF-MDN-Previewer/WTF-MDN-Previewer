chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: 'red' }, function() {
    console.log('The color is red.');
  });
});

chrome.omnibox.onInputChanged.addListener(function(e) {
  let curTab;
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    curTab = tabs[0];
    const url = 'https://developer.mozilla.org/en-US/search.json?q=' + e;
    if (e.length > 3) {
      fetch(url)
        .then(data => data.json())
        .then(resp => {
          if (resp.documents.length) {
            chrome.tabs.sendMessage(curTab.id, resp);
          } else {
            chrome.tabs.sendMessage(curTab.id, 'empty');
          }
        });
    } else {
      chrome.tabs.sendMessage(curTab.id, 'empty');
    }
  });
});
