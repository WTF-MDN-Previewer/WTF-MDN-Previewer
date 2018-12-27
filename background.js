// This listener executes code for a few reasons: when the extension is first installed, when it's updated to a new version, or when chrome updates to a new version. In our case, the code doesn't do anything except console log the color red.
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: 'red' }, function() {
    console.log('WTF MDN is running');
  });
});

chrome.omnibox.setDefaultSuggestion({
  description: 'Search MDN Docs Library'
});

// This event listener is triggered when input is added to the omnibox in chrome
chrome.omnibox.onInputChanged.addListener(function(e) {
  let curTab;
  // This chrome API allows extractions of tab information using the query method. Query takes an object containing properties of the tab(s) we want to target. In this case we want to targer the active tab and the window where the tab is open. We have specified permission for active tab in the manifest file, which gives us acccess to tab URL, ID, etc.

  // We are querying in order to extract the tab ID, which we need in order to use the sendMessage method.
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // first element in array object containing current tab information
    curTab = tabs[0];
    // stores MDN search API with concatenated input, forming the query string
    const url = 'https://developer.mozilla.org/en-US/search.json?q=' + e;
    // Only fetches if more than 3 chars have been typed into the omnibox
    if (e.length > 3) {
      fetch(url)
        .then(data => data.json())
        .then(resp => {
          // checks to see if any search results came back
          if (resp.documents.length) {
            // pass response object to the content.js file using sendMessage
            chrome.tabs.sendMessage(curTab.id, resp);
          } else {
            // pass empty string to content.js
            chrome.tabs.sendMessage(curTab.id, 'empty');
          }
        });
      // if less than 3 chars have been inputted, send 'empty'
    } else {
      chrome.tabs.sendMessage(curTab.id, 'empty');
    }
  });
});
