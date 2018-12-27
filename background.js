chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: 'red' }, function() {
    console.log('The color is red.');
  });
});
