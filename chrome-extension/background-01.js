// 注册回调，当收到请求的时候触发
chrome.extension.onRequest.addListener(({ tabId, args }) => {
    // 在给定tabId的tab页中执行脚本
    chrome.tabs.executeScript(tabId, {
        code: `console.log(...${JSON.stringify(args)});`,
        code: `console.log(...${args});`,
    });
});

// success start------------------------------------------------------------------------------------
chrome.runtime.onInstalled.addListener(() => {
    console.log('background.js---后台脚本运行成功！')
});
// success end------------------------------------------------------------------------------------


// success start------------------------------------------------------------------------------------
// 点击插件，会打开一个新的tab页
chrome.browserAction.onClicked.addListener(() => {
    let url = "https://beta.facer.io/watchface/IFDasd5YjN/inspect";
    chrome.tabs.create({ url });
});

// success
// 监听虽有的请求，并过滤匹配到urls规则和types规则的请求
// （console.log只能在插件的背景页里的console才能看到，在正常页面的console看不到）
chrome.webRequest.onBeforeRequest.addListener(
    (info) => {
        let dst_url = info.url;
        console.log("Cat intercepted: " + info.url);

        chrome.storage.local.set({ 'watchface_url_1': dst_url }, function() {
            console.log('set key = ' + 'watchface_url_1' + ', value = ' + dst_url);
        });
        // storage的get set方法不能封装，get方法的回调里面result.xxx，这个xxx必须是设置的缓存的key，而不是单纯的关键字key
        // // failed
        // storage_get('watchface_url_1')

        chrome.storage.local.set({ 'watchface_url_2': '12345678' }, function() {
            console.log('set key = ' + 'watchface_url_2' + ', value = ' + '12345678');
        });
        // // failed
        // storage_get('watchface_url_2')

        // success
        chrome.storage.local.get(function(result) {
            console.log('val = ' + JSON.stringify(result));
        });

        // failed
        chrome.storage.local.get(['watchface_url_1'], function(result) {
            console.log('get value is-1 ' + result.key);
        });

        // failed
        chrome.storage.local.get('watchface_url_1', function(result) {
            console.log('get value is-2 ' + result.key);
        });

        // failed
        chrome.storage.local.get({ 'watchface_url_1': 'xxxx' }, function(result) {
            console.log('get value is-3 ' + result.key);
        });

        // success
        chrome.storage.local.get('watchface_url_1', function(result) {
            console.log('get value is-4 ' + result.watchface_url_1);
        });

        // success
        chrome.storage.local.get(['watchface_url_1','watchface_url_2'], function(result) {
            console.log('get value is-5 val1 ' + result.watchface_url_1);
            console.log('get value is-5 val2 ' + result.watchface_url_2);
        });


        // let key_1 = 'watchface_url_1';
        // storage_get(key_1);
        // storage_set(key_1, dst_url);
        // storage_get(key_1);
        //
        // let key_2 = 'watchface_url_2';
        // storage_get(key_2);
        // storage_set(key_2, '123456789');
        // storage_get(key_2);

        // Redirect the lolcal request to a random loldog URL.
        // var i = Math.round(Math.random() * loldogs.length);
        // return { redirectUrl: loldogs[i] };
    },
    // filters
    {
        urls: [
            // "https://beta.facer.io/*",
            "https://*.cloudfront.net/original/*.face"
        ]
        // types: ["image"]
        // types: ["font", "image", "xmlhttprequest"]
        // types: ["csp_report", "font", "image", "main_frame", "media", "object", "other", "ping", "script", "stylesheet", "sub_frame", "websocket", "xmlhttprequest"]
    },
    // extraInfoSpec
    ["blocking"]
);


function storage_set(key1, value1) {
    // var user1 = { 'name': 'diego', 'age': 18 }
    // // 往存储中写入数据
    // chrome.storage.sync.set({ 'user1': user1 }, function() {
    //     console.log('保存成功' + user1);
    // });

    chrome.storage.local.set({ key1: value1 }, function() {
        console.log('set key = ' + key1 + ', value = ' + value1);
    });

}

function storage_get(keysss) {
    // // 从存储中读取数据
    // chrome.storage.sync.get('user1', function(result) {
    //     let name = result['user1'].name
    //     let age = result['user1'].age
    //     console.log('name:' + name + 'age = ' + age)
    // });

    // chrome.storage.local.get([key], function(result) {
    //     console.log('get key =' + key + ' ,val = ' + result.key);
    // });

    // chrome.storage.local.get(function(result) {
    //     console.log('get key =' + key + ' ,val = ' + JSON.stringify(result));
    // });

    chrome.storage.local.get(keysss, function(result) {
        console.log('get key =' + keysss + ' ,val = ' + result.keysss);
    });
}


// success end------------------------------------------------------------------------------------


// success start------------------------------------------------------------------------------------
// 打印所有的请求信息（console.log只能在插件的背景页里的console才能看到，在正常页面的console看不到）
// chrome.webRequest.onBeforeRequest.addListener(details => {
//     console.log("打印一下onBeforeRequest的detail:");
//     console.log(details);
// }, { urls: ["<all_urls>"] }, ["requestBody"]);
//
// // success end------------------------------------------------------------------------------------


// success start------------------------------------------------------------------------------------
// 是否显示图片
var showImageFlag = 'showImageKKK';
// console.log('init showImage = ' + showImageFlag);
// chrome.storage.sync.get({ showImage: true }, function(items) {
//     showImage = items.showImage;
// });

// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(details => {
    // cancel 表示取消本次请求
    // console.log('listener showImage = ' + showImageFlag);
    // storage_get(showImageFlag);
    if (showImageFlag && details.type === 'image') {
        // storage_set(showImageFlag, true);
        // storage_get(showImageFlag);
        return { cancel: true };
    }
    // storage_set(showImageFlag, false);
    // storage_get(showImageFlag);
    // 简单的文字检测
    if (details.type === 'font') {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'icon/watchface_icon.png',
            title: '检测到文字',
            message: '文字地址：' + details.url,
        });
    }
}, { urls: ["<all_urls>"] }, ["blocking"]);

// success end------------------------------------------------------------------------------------


//监听请求
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    console.log(sender.tab ? "Request from a content script:" + sender.tab.url : "Request from the extension");
    if (typeof request.Query !== "undefined" && typeof request.Query.LocalStore !== "undefined") {
        var res = localStorage[request.Query.LocalStore];//抓取本地数据
        if (typeof res !== "undefined") {
            sendResponse({ flag: true, result: res });//响应请求
        }
    }
});


// //监听浏览器tab更新
// chrome.tabs.onUpdated.addListener(checkForValidUrl);
// function checkForValidUrl(tabId, changeInfo, tab) {
//     console.log('tabId=' + tabId)
//     console.log('changeInfo=' + changeInfo)
//     console.log('tab.url=' + tab.url)
//
//     if (tab.url.toLowerCase().indexOf("www.jianshu.com/p/") > 0) {
//         chrome.pageAction.show(tabId);//显示插件page_Action的图标
//     } else {
//         chrome.pageAction.hide(tabId);
//     }
// }
