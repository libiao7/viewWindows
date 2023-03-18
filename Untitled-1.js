chrome.windows.create({ state: 'maximized' }, function (createdW) {
    chrome.tabs.move(
        1076381438,
        { windowId: createdW.id, index: -1 },
        function (movedTabs) {
            console.log(movedTabs)
            for (let mT of movedTabs) {
                console.log(mT)
            }
        }
    )
}
)


chrome.tabs.removeCSS(
    1076381467,
    { allFrames: true, file: 'videofixed.css' }
)
chrome.windows.getAll(
    function (ws) {
        console.log(ws)
    }
  )

  chrome.windows.update(
    1076383559,
    {drawAttention: true}
  )
  
