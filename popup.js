let downloadBtn = document.getElementById('download-btn');
let progressEle = document.getElementById('progress');
downloadBtn.onclick = (element) => {
    onClick();
};

function onClick(){
  chrome.storage.local.get(['endTime', 'requestHeaders', 'url'], async (res) => {
    let url = res.url;
    let headerArr = res.requestHeaders;
    let endTime = res.endTime;
    
    let header = {};
    headerArr.forEach(element => {
      header[element.name] = element.value;
    });

    function replaceStartTime(match, p1,p2, offset, string){
      return "bytes="+"0-"+endTime;
    }
    let newRange = header['Range'].replace(/bytes=(\d*)-(\d*)/, replaceStartTime);
    header['Range'] = newRange;

    const response = await fetch(url, {
      method: 'GET',
      headers: new Headers(header)
    });
    const reader = response.body.getReader();
    const contentLengthHeader = response.headers.get('Content-Length');
    const resourceSize = parseInt(contentLengthHeader, 10);
    var chunks = [];
    var runningTotal = 0;
    while(true){
      const {value, done} = await reader.read();
      
      if (done) {
        progressEle.innerHTML = 'Download completed'
        break;
      }
      chunks.push(value);
      runningTotal += value.length;
      const percentComplete = Math.round((runningTotal / resourceSize) * 100);

      progressEle.innerHTML = 'Progress:' + percentComplete + '%';
    }
    
    var blob = new Blob(chunks)

    var fakeurl = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = fakeurl;

    var currentdate = new Date();
    a.download = ""+ currentdate.getFullYear() 
    + (currentdate.getMonth()+1)   
    + currentdate.getDate()
    + "_"
    + currentdate.getHours() 
    + currentdate.getMinutes()
    + currentdate.getSeconds() + "_video.ts";

    document.body.appendChild(a); 
    a.click();    
    a.remove();  
    
  });
}

