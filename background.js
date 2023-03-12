chrome.runtime.onInstalled.addListener(async (tab) => {
  chrome.action.setBadgeText({
    tabId: tab.id,
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "ON" ? "OFF" : "ON";

  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  await chrome.scripting.insertCSS({
    files: ["css/styles.css"],
    target: { tabId: tab.id },
  });

  chrome.tabs.captureVisibleTab(null, {}, function (image) {
    chrome.tabs.sendMessage(tab.id, { image });
  });
});
