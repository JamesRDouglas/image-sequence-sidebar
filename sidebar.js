let running = false;

async function getThumbs(url) { 
  if(!running){

    running = true;

    document.body.replaceChildren();

    if( (url.indexOf('?') === -1) & (url.indexOf('#') === -1) & (url !== 'about:blank') ){

      const prefix = url.substr(0,url.lastIndexOf('/')+1); 
      const extension = url.substr(url.lastIndexOf('.')); 

      for(let n = 1; n<100; n++) {
        const thumb = prefix + n + extension;
        try{
          const response = await fetch(thumb);
          if(response.ok){
            const a = document.createElement('a');
            a.href = thumb;
            const i = document.createElement('img');
            i.src = thumb;
            a.appendChild(i);
            document.body.appendChild(a);
          }else{
            break;
          }
        } catch {
          running = false;
        }
      }

    }

    running = false;

  }
}

browser.tabs.onActivated.addListener(async a => {
  const tab = await browser.tabs.get(a.tabId);
  getThumbs(tab.url);
});

browser.tabs.onUpdated.addListener(async (tabId, changed) => {
  if (changed.url) {
    const tabs = await browser.tabs.query({ currentWindow: true, active: true });
    if( tabs[0].id === tabId ) getThumbs(tabs[0].url);
  }
});