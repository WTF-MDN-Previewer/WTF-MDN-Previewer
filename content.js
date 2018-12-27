$(function() {
  const html = document.getElementsByTagName('body');
  const wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'wtf-mdn-previewer');
  wrapper.style.position = 'fixed';
  wrapper.style.width = '100%';
  wrapper.style.zIndex = '999999999';
  wrapper.style.height = 'auto';
  wrapper.style.top = '-1000px';
  wrapper.style.borderBottom = '5px solid black';
  wrapper.style.transition = 'all .2s ease-in-out';
  wrapper.style.background = '#fff';
  wrapper.style.padding = '20px 20px 0';
  html[0].appendChild(wrapper);

  chrome.runtime.onMessage.addListener(gotMessage);

  function gotMessage(request, sender, sendResponse) {
    if (request === 'empty') {
      $('#wtf-mdn-previewer')
        .css({ top: '-1000px' })
        .children()
        .remove();
    } else {
      triggerPopup(request.documents);
    }
  }

  function triggerPopup(result) {
    $('#wtf-mdn-previewer')
      .children()
      .remove();
    for (let i = 0; i < 5; i++) {
      $.ajax({
        url: result[i].url,
        context: document.body
      }).done(function(data) {
        parseHtml(data, result[i]);
      });
    }
  }

  function parseHtml(data, result) {
    data = data.toString();
    let dataWithoutSpaces = data.replace('[\\t\\n\\r]+', '');
    let dataAsArray = dataWithoutSpaces.split('wikiArticle');
    dataAsArray.shift();
    let dataAsSecondArray = dataAsArray.join('').split('<p>');
    dataAsSecondArray.shift();
    let dataAsThirdArray = dataAsSecondArray.join('').split('</p>');
    const pTag = dataAsThirdArray.shift();

    $('#wtf-mdn-previewer').css({ top: '0px' }).append(`
        <div style='border-bottom: 1px solid #ccc; padding: 0 0 10px;'>
            <h1 style='margin-top: 10px; margin-bottom: 10px;line-height: 20px; font-size: 22px;'>${
              result.title
            }</h1>
            <p style='font-size: 14px; margin-bottom: 10px; padding: 0;'>${pTag}</p>
            <a href=${result.url} target='_blank'>go to MDN</a>
        </div>
      `);
  }
});
