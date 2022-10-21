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
/**
 * 点击插件，会打开一个新的tab页
 */
chrome.browserAction.onClicked.addListener(() => {
    let url = "https://beta.facer.io/watchface/IFDasd5YjN/inspect";
    chrome.tabs.create({ url });
});

/**
 * 监听虽有的请求，并过滤匹配到urls规则和types规则的请求
 *（console.log只能在插件的背景页里的console才能看到，在正常页面的console看不到）
 */
chrome.webRequest.onBeforeRequest.addListener(
    (info) => {
        let dst_url = info.url;
        console.log("Cat intercepted: " + dst_url);

        var dst_url_el = dst_url.split("/");
        let watchface_name = dst_url_el[dst_url_el.length - 1];
        console.log('表盘名字：' + watchface_name)

        // success ,storage的get set方法中的key如果是变量，必须要用[keyParam]把变量括起来
        storage_set(watchface_name, dst_url);
        storage_get(watchface_name);

        chrome.storage.local.get(function(result) {
            console.log('get values = ' + JSON.stringify(result));
        });

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
        // //types 可选择放开或者不放开，放开的话，就会结合urls一起过滤这个类型的请求
        // types: ["image"]
        // types: ["csp_report", "font", "image", "main_frame", "media", "object", "other", "ping", "script", "stylesheet", "sub_frame", "websocket", "xmlhttprequest"]
    },
    // extraInfoSpec
    ["blocking"]
);


/**
 * 注意[keysss]，set时变量keysss必须要用[]括起来
 * @param keysss
 * @param valsss
 */
function storage_set(keysss, valsss) {
    chrome.storage.local.set({ [keysss]: valsss }, function() {
        console.log('set key = ' + keysss + ', value = ' + valsss);
    });
}

/**
 * 注意result[keysss]，取值时变量keysss必须要用[]括起来
 * @param keysss
 */
function storage_get(keysss) {
    chrome.storage.local.get(keysss, function(result) {
        console.log('get key =' + keysss + ' ,value currently is = ' + result[keysss]);
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
