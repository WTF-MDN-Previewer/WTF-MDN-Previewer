// Invoke jquery passing in a callback function. This give us access to the jquery parent object and all of its methods.
$(function() {
  // This block of code appends a wrapper div to the dom which eventuall display our MDN dov preview. It also contains styling.
  // getElementsByTagName always returns an array
  const html = document.getElementsByTagName('body');
  // console.log(html);
  // creat a wrapper div.
  const wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'wtf-mdn-previewer');
  wrapper.style.position = 'fixed';
  wrapper.style.width = '100%';
  wrapper.style.zIndex = '999999999';
  wrapper.style.height = 'auto';
  wrapper.style.top = '-1000px';
  wrapper.style.borderBottom = '5px solid black';
  wrapper.style.transition = 'all .3s ease-in-out';
  wrapper.style.background = '#fff';
  wrapper.style.padding = '20px 20px 0';
  wrapper.style.fontFamily = 'sans-serif';
  html[0].appendChild(wrapper);

  // This event listener is what is communicating to the background.js file. gotMessage is a callback function
  chrome.runtime.onMessage.addListener(gotMessage);

  // definition for gotMessage callback function
  function gotMessage(request, sender, sendResponse) {
    // if request is the string 'empty'
    if (request === 'empty') {
      // select the div and shut it down.
      $('#wtf-mdn-previewer')
        .css({ top: '-1000px' })
        .children()
        .remove();
      // otherwise invoke triggerPopup
    } else {
      triggerPopup(request.documents);
    }
  }
  // This function first removes the current div, but then loops through, appending the
  // top 5 search results on document.body to 5 separate divs within our wrapper div.
  function triggerPopup(result) {
    $('#wtf-mdn-previewer')
      .children()
      .remove();
    for (let i = 0; i < 5; i++) {
      $.ajax({
        url: result[i].url,
        context: document.body
      }).done(function(data) {
        // once data has been returned from the server, send the plain text html to parseHtml
        parseHtml(data, result[i]);
      });
    }
  }
  /* This function does the heavy lifting */
  function parseHtml(data, result) {
    // convert ajax returned data to a string
    data = data.toString();

    // use replace to remove all whitespace
    let dataWithoutSpaces = data.replace('[\\t\\n\\r]+', '');
    // split the text into an array separated by wikiArticle ID, right before the ptag. There will be a bunch of garbage text in the first element.
    let dataAsArray = dataWithoutSpaces.split('wikiArticle');
    // remove the first element garbage
    dataAsArray.shift();

    let dataAsDescription = dataAsArray.join('').split('<h2 id="Description">');
    dataAsDescription.shift();
    let dataAsFirstDescPTags = dataAsDescription.join('').split('<p>');
    dataAsFirstDescPTags.shift();
    let dataAsFirstDescPTag = dataAsFirstDescPTags.join('').split('</p>');
    const descPTag = dataAsFirstDescPTag.shift();

    // join all the text back into a string, then split into an array separated by the opening p tag.
    let dataAsSecondArray = dataAsArray.join('').split('<p>');
    console.log(dataAsSecondArray);
    // pop the first element off, which is more garbage text
    dataAsSecondArray.shift();
    // join text back into a string and then split along the closing p tag
    let dataAsThirdArray = dataAsSecondArray.join('').split('</p>');
    // shift the first element off, which is the text we want.
    const pTag = dataAsThirdArray.shift();
    // This appends the parsed information to the wrapper div, creating our preview.
    $('#wtf-mdn-previewer').css({ top: '0px' }).append(`
        <div style='border-bottom: 1px solid #ccc; padding: 0 0 10px;'>
            <h1 style='margin-top: 10px; font-family:sans-serif; margin-bottom: 10px;line-height: 20px; font-size: 18px;'>${
              result.title
            }</h1>
            <p style='font-size: 12px; font-family:sans-serif; margin-bottom: 0px; padding: 0;'>${pTag}</p>
            <p style='font-size: 12px;font-family:sans-serif; margin-bottom: 10px; padding: 0;'>${descPTag}</p>
            <a style='font-family:sans-serif;' href=${
              result.url
            } target='_blank'>go to MDN</a>
        </div>
      `);
  }
});
