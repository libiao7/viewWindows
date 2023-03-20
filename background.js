let toSplit = true
function splitWindows() {
    chrome.tabs.query(
        { pinned: false },
        function (ts) {
            let notChromeTabs = []
            for (let t of ts) {
                if (t.url.indexOf("chrome") !== 0) {
                    notChromeTabs.push(t)
                }
            }
            let splitNumber = Math.ceil(Math.sqrt(notChromeTabs.length))
            let splitH = Math.ceil(top.screen.height / splitNumber) + 39
            let splitW = Math.ceil(top.screen.width / splitNumber) + 16
            function createNextWindow(createdW) {
                if (createdW) {
                    let t0 = notChromeTabs.shift()
                    if (t0) {
                        let tp
                        let lef
                        if (top.screen.width - (createdW.left + createdW.width) > (createdW.width - 16) * 0.8) {
                            tp = createdW.top
                            lef = createdW.left + createdW.width - 16

                        } else {
                            tp = createdW.top - splitH + 41
                            lef = 0
                        }
                        chrome.windows.create(
                            {
                                type: "popup",
                                // state:"fullscreen",
                                top: tp,
                                left: lef,
                                width: createdW.width,
                                height: createdW.height,
                                tabId: t0.id
                            }, function (createdW) {
                                chrome.tabs.removeCSS(
                                    t0.id,
                                    { allFrames: true, file: 'videofixed.css' },
                                    function () {
                                        chrome.tabs.insertCSS(
                                            t0.id,
                                            { allFrames: true, file: 'videofixed.css' },
                                            function () {
                                                if (notChromeTabs.length === 0) {
                                                    chrome.contextMenus.update(
                                                        "ctxm",
                                                        { title: '1' },
                                                        function () {
                                                            toSplit = false
                                                        }
                                                    )
                                                }
                                                else if (notChromeTabs.length > 0) createNextWindow(createdW)
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    }

                }
            }
            let t0 = notChromeTabs.shift()
            if (t0) {
                chrome.windows.create(
                    {
                        type: "popup",
                        // state:"fullscreen",
                        top: top.screen.height - splitH,
                        left: 0,
                        width: splitW,
                        height: splitH,
                        tabId: t0.id
                    }, function (createdW) {
                        chrome.tabs.removeCSS(
                            t0.id,
                            { allFrames: true, file: 'videofixed.css' },
                            function () {
                                chrome.tabs.insertCSS(
                                    t0.id,
                                    { allFrames: true, file: 'videofixed.css' },
                                    function () {
                                        if (notChromeTabs.length === 0) {
                                            chrome.contextMenus.update(
                                                "ctxm",
                                                { title: '1' },
                                                function () {
                                                    toSplit = false
                                                }
                                            )
                                        }
                                        else if (notChromeTabs.length > 0) createNextWindow(createdW)
                                    }
                                )
                            }
                        )
                    }
                )
            }
        }
    )
}
function toOneWindow(onClickTab) {
    chrome.tabs.query(
        { pinned: false, url: ['https://*/*', 'http://*/*', 'file:///*'] },
        function (ts) {
            if (ts.length > 0) {
                let id0 = ts.shift().id
                chrome.windows.create({ state: 'maximized', tabId: id0 }, function (createdW) {
                    chrome.tabs.removeCSS(
                        id0,
                        { allFrames: true, file: 'videofixed.css' },
                        function () {
                            if (ts.length > 0)
                                chrome.tabs.move(
                                    ts.map((tt) => tt.id),
                                    { windowId: createdW.id, index: -1 },
                                    function (movedTabs) {
                                        for (let mT of movedTabs) {
                                            chrome.tabs.removeCSS(
                                                mT.id,
                                                { allFrames: true, file: 'videofixed.css' },
                                                function () {
                                                    if (mT === movedTabs[movedTabs.length - 1]) {
                                                        chrome.contextMenus.update(
                                                            "ctxm",
                                                            { title: 'splitWindows' },
                                                            function () {
                                                                toSplit = true
                                                                if (onClickTab) chrome.tabs.update(onClickTab.id, { active: true })
                                                            }
                                                        )
                                                    }
                                                }
                                            )
                                        }
                                    }
                                )
                            else if (ts.length === 0) {
                                chrome.contextMenus.update(
                                    "ctxm",
                                    { title: 'splitWindows' },
                                    function () {
                                        toSplit = true
                                        if (onClickTab) chrome.tabs.update(onClickTab.id, { active: true })
                                    }
                                )
                            }
                        }
                    )
                }
                )
            }
        }
    )
}
chrome.browserAction.onClicked.addListener((tab) => {
    splitWindows()
})
chrome.commands.onCommand.addListener(function (command) {
    if (command == 'splitWindows') {
        splitWindows()
    }
    else if (command == 'toOneWindow') {
        toOneWindow()
    }
})
chrome.contextMenus.create({
    id: "ctxm",
    title: "splitWindows",
    contexts: ["all"],
    onclick: (onClickData, onClickTab) => {
        if (toSplit) {
            splitWindows()
        } else toOneWindow(onClickTab)
    }
})
