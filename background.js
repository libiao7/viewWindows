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
            let splitH = Math.floor(top.screen.height / splitNumber)
            let splitW = Math.floor(top.screen.width / splitNumber)
            for (let jj = 0; top.screen.height - jj >= splitH; jj = jj + splitH) {
                for (let ii = 0; top.screen.width - ii >= splitW; ii = ii + splitW) {
                    let t0 = notChromeTabs.shift()
                    if (t0)
                        chrome.windows.create(
                            {
                                type: "popup",
                                // state:"fullscreen",
                                top: jj,
                                left: ii,
                                width: splitW,
                                height: splitH,
                                tabId: t0.id
                            }
                        )
                }
            }
            chrome.contextMenus.update(
                "windowsSpliter",
                { title: '11' },
                function () {
                    toSplit = false
                }
            )
        }
    )
}
chrome.browserAction.onClicked.addListener((tab) => {
    splitWindows()
})
chrome.contextMenus.create({
    id: "windowsSpliter",
    title: "99",
    contexts: ["all"],
    onclick: (onClickData, onClickTab) => {
        if (toSplit) {
            splitWindows()
        } else {
            chrome.tabs.query(
                { pinned: false },
                function (ts) {
                    chrome.windows.create({ state: 'maximized', tabId: ts.shift().id }, function (createdW) {
                        chrome.tabs.move(
                            ts.map((tt) => tt.id),
                            { windowId: createdW.id, index: -1 },
                            function () {
                                chrome.contextMenus.update(
                                    "windowsSpliter",
                                    { title: '99' },
                                    function () {
                                        toSplit = true
                                        chrome.tabs.update(onClickTab.id, { active: true })
                                    }
                                )
                            }
                        )
                    }
                    )
                }
            )
        }
    }
})
