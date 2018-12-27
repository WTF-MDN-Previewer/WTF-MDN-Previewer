chrome.runtime.onInstalled.addListener(function() {
  const html = document.getElementsByTagName('body');
  const wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'wtf-mdn-previewer');
  wrapper.style.position = 'fixed';
  wrapper.style.width = '100%';
  wrapper.style.height = '300';
  wrapper.style.zIndex = '';
  html[0].appendChild(wrapper);
  html[0].appendChild(wrapper);
  chrome.storage.sync.set({ color: 'red' }, function() {
    console.log('The color is red.');
  });
});

chrome.omnibox.onInputChanged.addListener(function(e) {
  const url = 'https://developer.mozilla.org/en-US/search.json?q=' + e;
  fetch(url)
    .then(data => data.json())
    .then(resp => {
      console.log(resp);
      console.log(resp);
      if (resp.documents.length && e.length > 3) {
        triggerPopup();
      }
    });
});

function triggerPopup() {}
