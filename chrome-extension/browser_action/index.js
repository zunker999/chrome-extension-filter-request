
window.onload = function() {
    const btnObj = document.getElementById("btn");
    let count = 0;
    if (btnObj) {
        btnObj.addEventListener('click', function() {
            btnObj.innerText = "click--->" + count;
            console.log('btn被点击了-->' + count);
            count++;
        });
    }

    const btn_clean_storage = document.getElementById("btn_clean_storage");
    if(btn_clean_storage){
        console.log('开始清除extension local_storage');
        // chrome.storage.local.clear();
    }
}



