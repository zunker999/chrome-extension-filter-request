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
 * 监听虽有的请求，并过滤匹配到urls规则和types规则的请求
 *（console.log只能在插件的背景页里的console才能看到，在正常页面的console看不到）
 */
chrome.webRequest.onBeforeRequest.addListener(
    async (info) => {
        let dst_url = info.url;
        console.log("Cat intercepted: " + dst_url);

        let dst_url_el = dst_url.split("/");
        let watchface_name = dst_url_el[dst_url_el.length - 1];
        watchface_name = watchface_name.substr(33);
        console.log('表盘名字：' + watchface_name)

        let tab_url = await new Promise((resolve, reject) => {
            chrome.tabs.getSelected(function(tab) {
                console.log('current tab watchface = ' + watchface_name + ',url = ' + tab.url);
                resolve(tab.url);
            });
        });

        let watchface_info={};
        watchface_info['name'] = watchface_name;
        watchface_info['url'] = tab_url;
        console.log('await tab watchface info' + JSON.stringify(watchface_info));
        // success ,storage的get set方法中的key如果是变量，必须要用[keyParam]把变量括起来
        storage_set(tab_url, watchface_info);
        storage_print_all();
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
 * 参考：https://qa.1r1g.com/sf/ask/818488961/
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
 *
 *
 * @param keysss
 */
async function storage_get(keysss) {
    var res2 = await storage_getttt(keysss);
    console.log('2--->' + res2);
    return res2;
    // storage_getttt(keysss).then((res3)=> {
    //     console.log('3--->' + res3);
    // });
}

/**
 * 调用storage_get2的方法前需要加上async 和 await
 * 或者使用.then()，将业务代码放到then里面
 * @param keysss
 * @returns {Promise<unknown>}
 */
function storage_get2(keysss) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keysss, async function(result) {
            let val = result[keysss];
            console.log('get key =' + keysss + ' ,value currently is = ' + val);
            console.log('1--->' + val);
            resolve(val);
        });
    });
}


/**
 * 打印local storage 的所有的value
 */
function storage_print_all() {
    chrome.storage.local.get(function(result) {
        console.log('all storage values = ' + JSON.stringify(result));
    });
}


/**
 * Called when the user clicks on the browser action.
 * 点击浏览器上的插件按钮时，就触发下面的逻辑
 */
chrome.browserAction.onClicked.addListener(async function(tab) {
    // No tabs or host permissions needed!
    let tab_id = tab.id;
    let tab_url = tab.url;
    console.log('onClicked ,tab_id = ' + tab_id + ' ,tab_url = ' + tab_url);
    console.log('已将 ' + tab_url + ' 的背景色改为red!');
    chrome.tabs.executeScript({
        // code: 'document.body.style.backgroundColor="red"'
        code: 'document.header.style.backgroundColor="red"'
    });
    console.log('print--->log');
    // 需要在最前面的function前加上async
    let valuess = await storage_get2(tab_url);
    // storage_getttt('57d8dc9beafd3b82c499708ecbf44fe1_Grandfather_Clock_Free.face').then((res4) => {
    //     console.log('4--->' + res4);
    // });
    console.log('3--->' + JSON.stringify(valuess));
    let title;
    let message;
    if (valuess) {
        let parse = JSON.parse(valuess);
        let name = parse.name;
        title = '检测到表盘' + name;
        message = '表盘地址：' + tab_url;
    } else {
        title = '没有检测到表盘信息';
        message = '请刷当前网页重新点击插件获取表盘信息';
    }
    //发出网页通知
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'icon/watchface_icon.png',
        title: title,
        message: message,
    });

});

// success end------------------------------------------------------------------------------------


// success start------------------------------------------------------------------------------------
// 打印所有的请求信息（console.log只能在插件的背景页里的console才能看到，在正常页面的console看不到）
// chrome.webRequest.onBeforeRequest.addListener(details => {
//     console.log("打印一下onBeforeRequest的detail:");
//     console.log(details);
// }, { urls: ["<all_urls>"] }, ["requestBody"]);
//
// // success end------------------------------------------------------------------------------------


// // success start------------------------------------------------------------------------------------
// // 是否显示图片
// var showImageFlag = 'showImageKKK';
// console.log('init showImage = ' + showImageFlag);
// chrome.storage.sync.get({ showImage: true }, function(items) {
//     showImage = items.showImage;
// });
//
// // web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
// chrome.webRequest.onBeforeRequest.addListener(details => {
//     // cancel 表示取消本次请求
//     console.log('listener showImage = ' + showImageFlag);
//     if (!showImageFlag && details.type == 'image') {
//         // storage_set(showImageFlag, true);
//         // storage_get(showImageFlag);
//         return { cancel: true };
//     }
//     // storage_set(showImageFlag, false);
//     // storage_get(showImageFlag);
//     // 简单的文字检测
//     if (details.type == 'font') {
//         chrome.notifications.create(null, {
//             type: 'basic',
//             iconUrl: 'icon/watchface_icon.png',
//             title: '检测到文字',
//             message: '文字地址：' + details.url,
//         });
//     }
// }, { urls: ["<all_urls>"] }, ["blocking"]);

// success end------------------------------------------------------------------------------------


// //监听请求
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log(request);
//     console.log(sender.tab ? "Request from a content script:" + sender.tab.url : "Request from the extension");
//     if (typeof request.Query !== "undefined" && typeof request.Query.LocalStore !== "undefined") {
//         var res = localStorage[request.Query.LocalStore];//抓取本地数据
//         if (typeof res !== "undefined") {
//             sendResponse({ flag: true, result: res });//响应请求
//         }
//     }
// });


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


/**
 * 点击插件，会打开一个新的tab页
 * 如果需要打开一个新的tab页面，则manifest.json下的browser_action的"default_popup": "/browser_action/index.html"不能设置，否则chrome.tabs.create不生效
 */
// chrome.browserAction.onClicked.addListener(() => {
//     let url = "https://beta.facer.io/watchface/IFDasd5YjN/inspect";
//     chrome.tabs.create({ url });
// });


// // Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.tabs.executeScript(
//         tab.id,
//         {code: 'window.print();'});
// });

